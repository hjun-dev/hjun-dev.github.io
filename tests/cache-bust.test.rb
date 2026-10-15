require 'tmpdir'
require 'fileutils'
require 'liquid'
require_relative '../_plugins/cache-bust'

fixture_root = File.expand_path('../vendor', __dir__)
FileUtils.mkdir_p(fixture_root)
filter = Object.new.extend(Jekyll::CacheBust)

Dir.mktmpdir('cache-bust-', fixture_root) do |fixture|
  Dir.chdir(fixture) do
    FileUtils.mkdir_p(['_sass', 'assets/css', '_posts'])
    File.write('assets/css/main.scss', '@import "theme";')
    File.write('_sass/_theme.scss', 'body { color: #172238; }')
    path = '/portfolio/assets/css/main.css'
    original = filter.bust_css_cache(path)

    File.write('_sass/_theme.scss', 'body { color: #254fc5; }')
    after_partial = filter.bust_css_cache(path)
    raise 'Changing a Sass partial must invalidate the CSS cache' if original == after_partial

    File.write('assets/css/main.scss', '@import "theme"; body { margin: 0; }')
    after_entrypoint = filter.bust_css_cache(path)
    raise 'Changing the Sass entrypoint must invalidate the CSS cache' if after_partial == after_entrypoint

    File.write('_posts/note.md', 'An unrelated note')
    raise 'Unrelated content must not invalidate the CSS cache' unless after_entrypoint == filter.bust_css_cache(path)
    raise 'The versioned URL must preserve the base path' unless after_entrypoint.start_with?(path + '?')

    puts 'CSS cache checks passed: partial changes, entrypoint changes, stable content, base path.'
  end
end
