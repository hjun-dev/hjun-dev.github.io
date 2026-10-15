require 'nokogiri'

root = File.expand_path('../_site', __dir__)
origin = 'https://hyeong-jun-lee.github.io'
github = 'https://github.com/hyeong-jun-lee'
paths = %w[index.html blog/index.html cv/index.html projects/index.html publications/index.html]
paths << 'blog/2026/00-mehrotra-predictor-corrector-method/index.html'

paths.each do |path|
  document = Nokogiri::HTML(File.read(File.join(root, path)))
  expected_url = "#{origin}/#{path.delete_suffix('index.html')}"
  raise "Wrong canonical URL: #{path}" unless document.at_css('link[rel="canonical"]')&.[]('href') == expected_url
  raise "Wrong sharing URL: #{path}" unless document.at_css('meta[property="og:url"]')&.[]('content') == expected_url
  %w[meta[property="og:image"] meta[name="twitter:image"]].each do |selector|
    raise "Wrong sharing image: #{path}" unless document.at_css(selector)&.[]('content') == "#{origin}/assets/img/name-card.png"
  end
end

home = Nokogiri::HTML(File.read(File.join(root, 'index.html')))
raise 'GitHub profile must point to the renamed account' unless home.at_css("a[href='#{github}']")
raise 'Structured profile data must use the renamed account' unless home.css('script[type="application/ld+json"]').any? { |script| script.text.include?(github) }

Dir.glob(File.join(root, '**/*.html')).each do |path|
  document = Nokogiri::HTML(File.read(path))
  document.css('[href], [src], meta[content]').each do |element|
    %w[href src content].each do |attribute|
      value = element[attribute].to_s
      raise "Retired address in #{path}: #{value}" if value.match?(%r{https?://(?:hjun-dev\.github\.io|github\.com/hjun-dev)(?:/|\z)})
    end
  end
end

%w[feed.xml sitemap.xml robots.txt].each do |path|
  content = File.read(File.join(root, path))
  raise "Missing new origin in #{path}" unless content.include?(origin)
  raise "Retired origin in #{path}" if content.include?('https://hjun-dev.github.io')
end

puts 'Site address checks passed: canonical URLs, social previews, GitHub links, feed, sitemap, and robots.'
