require 'jekyll'
require 'nokogiri'
require 'time'
require_relative '../_plugins/cache-bust'

root = File.expand_path('..', __dir__)
site = Jekyll::Site.new(Jekyll.configuration('source' => root, 'baseurl' => '/notes', 'quiet' => true))
failures = []
check = lambda do |name, &assertions|
  assertions.call
  puts "PASS: #{name}"
rescue StandardError => error
  failures << "#{name}: #{error.message}"
end
render = lambda do |source, payload|
  html = site.liquid_renderer.file(source).parse(source).render!(payload, registers: {site: site, page: payload['page']})
  Nokogiri::HTML.fragment(html)
end
note = {'title' => '[Paper Review] Example note', 'url' => '/blog/2026/example/', 'date' => Time.parse('2026-01-02'),
        'description' => 'A concise bilingual 연구 summary.', 'categories' => ['optimization']}
payload = {'page' => {'latest_posts' => {'limit' => 2}}, 'site' => {
  'posts' => [note, note.merge('url' => '/blog/2026/second/'), note.merge('url' => '/blog/2026/third/')],
  'data' => {'blog_category_labels' => {'optimization' => 'Optimization'}}}}

check.call('Latest notes preserve summaries and a two-post limit') do
  html = render.call('{% include latest_posts.liquid %}', payload)
  raise 'Expected two readable article entries' unless html.css('article').size == 2
  raise 'Missing article heading' unless html.at_css('h3 a')&.text == 'Example note'
  raise 'Missing summary' unless html.at_css('.blog-archive-row__description')&.text == 'A concise bilingual 연구 summary.'
  raise 'Missing semantic date' unless html.at_css('time')&.[]('datetime')&.start_with?('2026-01-02')
  raise 'Category lost its subpath-safe destination' unless html.at_css('a.blog-topic-chip')&.[]('href') == '/notes/blog/category/optimization/'
end

check.call('Latest notes retain safe internal and external redirect destinations') do
  redirected = payload.merge('site' => payload['site'].merge('posts' => [
    note.merge('redirect' => '/blog/2026/replacement/'), note.merge('redirect' => 'https://example.org/paper')]))
  links = render.call('{% include latest_posts.liquid %}', redirected).css('h3 a')
  raise 'Internal redirect lost its base path' unless links[0]&.[]('href') == '/notes/blog/2026/replacement/'
  raise 'External redirect is not protected' unless links[1]&.[]('href') == 'https://example.org/paper' && links[1]['rel'].split.include?('noopener')
end

check.call('An empty latest-notes collection does not render an empty list') do
  empty = payload.merge('site' => payload['site'].merge('posts' => []))
  html = render.call('{% include latest_posts.liquid %}', empty)
  raise 'Empty article container rendered' if html.at_css('.home-writing, table')
  raise 'Missing empty-state explanation' unless html.text.include?('No posts')
end

check.call('Pagination identifies the current page despite index.html path variants') do
  [1, 2].each do |number|
    paginator = {'page' => number, 'total_pages' => 2, 'page_trail' => [
      {'num' => 1, 'path' => '/blog/', 'title' => 'Blog'}, {'num' => 2, 'path' => '/blog/page/2/', 'title' => 'Page 2'}]}
    html = render.call('{% include pagination.liquid %}', {'page' => {'url' => '/blog/index.html'}, 'paginator' => paginator})
    raise 'Current page is not uniquely identified' unless html.css('[aria-current="page"]').map { |a| a.text.strip } == [number.to_s]
    raise 'Current page lacks a visible state' unless html.at_css('.page-item.active [aria-current="page"]')
  end
end

check.call('Project cards use the supplied heading level and retain genuine code links') do
  project = {'title' => 'Test project', 'url' => '/projects/test/', 'description' => 'Description', 'github' => 'https://github.com/example/research-code'}
  html = render.call('{% include projects.liquid heading_level=3 %}', {'project' => project})
  raise 'Project heading breaks its parent section hierarchy' unless html.at_css('h3.project-card__title')&.text == 'Test project'
  raise 'Genuine code link was lost' unless html.at_css('.project-card__repo')&.[]('href') == 'https://github.com/example/research-code'
  html = render.call('{% include projects.liquid %}', {'project' => project.merge('github' => nil)})
  raise 'Default project heading changed' unless html.at_css('h2.project-card__title')
  raise 'Invented an unavailable code link' if html.at_css('.project-card__repo')
end

abort failures.join("\n") unless failures.empty?
