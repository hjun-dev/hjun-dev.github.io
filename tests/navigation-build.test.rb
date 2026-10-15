require 'nokogiri'

root = File.expand_path('../_site', __dir__)
failures = []
%w[index.html blog/index.html cv/index.html publications/index.html].each do |path|
  html = Nokogiri::HTML(File.read(File.join(root, path)))
  skip = html.at_css('body > a.skip-link')
  target = html.at_css('[role="main"]')
  failures << "Missing keyboard route to main content in #{path}" unless skip && target && skip['href'] == "##{target['id']}" && target['tabindex'] == '-1'
end

home = Nokogiri::HTML(File.read(File.join(root, 'index.html')))
failures << 'Home project titles must sit below their section heading' unless home.css('.home-projects h3.project-card__title').size == 3
projects = Nokogiri::HTML(File.read(File.join(root, 'projects/index.html')))
failures << 'Portfolio cards must not advertise the blog source as project code' if projects.css('.project-card__repo').any? { |a| a['href'].end_with?('/hyeong-jun-lee.github.io') }

missing = Nokogiri::HTML(File.read(File.join(root, '404.html')))
failures << 'The missing-page screen must not force an automatic navigation' if missing.at_css('meta[http-equiv="refresh"]')
failures << 'Missing recovery route to the writing archive' unless missing.at_css('main a[href="/blog/"], [role="main"] a[href="/blog/"]')
failures << 'Missing recovery route to the home page' unless missing.at_css('main a[href="/"], [role="main"] a[href="/"]')

abort failures.join("\n") unless failures.empty?
puts 'Navigation build checks passed: skip links, heading hierarchy, truthful project actions, and persistent 404 recovery.'
