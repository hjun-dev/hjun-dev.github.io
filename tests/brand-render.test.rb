require 'jekyll'
require 'nokogiri'
require 'uri'
require_relative '../_plugins/cache-bust'

root = File.expand_path('..', __dir__)
site = Jekyll::Site.new(Jekyll.configuration('source' => root, 'quiet' => true))
header = site.liquid_renderer.file('_includes/header.liquid').parse(File.read(File.join(root, '_includes/header.liquid')))

['', '/preview'].each do |baseurl|
  site.config['baseurl'] = baseurl
  payload = { 'site' => site.site_payload['site'], 'page' => { 'url' => '/blog/' } }
  html = Nokogiri::HTML(header.render!(payload, registers: { site: site, page: payload['page'] }))
  brand = html.at_css('a.site-brand')
  raise 'Brand must remain a home link at each deployment path' unless brand['href'] == "#{baseurl}/"
  raise 'The visible brand must be the full name with its signature dot' unless brand.text.gsub(/\s+/, ' ').strip == 'Hyeong-Jun Lee.'
  raise 'The home link needs a descriptive accessible name' unless brand['aria-label'] == 'Hyeong-Jun Lee — home'
  raise 'The decorative dot should not add spoken punctuation' unless brand.at_css('[aria-hidden="true"]')&.text == '.'
  raise 'Mobile navigation must retain its collapse target' unless html.at_css('button[aria-controls="navbarNav"]') && html.at_css('#navbarNav')
end

site.config['baseurl'] = ''
payload = { 'site' => site.site_payload['site'], 'page' => { 'url' => '/' } }
head = site.liquid_renderer.file('_includes/head.liquid').parse(File.read(File.join(root, '_includes/head.liquid')))
icon = Nokogiri::HTML(head.render!(payload, registers: { site: site, page: payload['page'] })).at_css('link[rel="shortcut icon"]')
icon_url = URI.parse(icon['href'])
raise 'Tab icon must use the scalable name-mark asset' unless icon_url.path == '/assets/img/name-mark.svg'
raise 'Tab icon needs cache invalidation' unless icon_url.query&.match?(/\A[0-9a-f]{32}\z/)
svg = Nokogiri::XML(File.read(File.join(root, icon_url.path.delete_prefix('/')))) { |config| config.strict }
raise 'The name mark must contain vector artwork' unless svg.at_css('svg') && svg.at_css('path')
raise 'Tab icon must not execute scripts or load external resources' if svg.at_css('script, image, foreignObject') || svg.xpath('//@*[local-name()="href"]').any?

share_path = URI.parse(site.config['og_image']).path
raise 'Shared links must use the matching name-first image' unless share_path == '/assets/img/name-card.png'
share_image = File.binread(File.join(root, share_path.delete_prefix('/')))
raise 'Social preview must be a valid PNG for link crawlers' unless share_image.start_with?("\x89PNG\r\n\x1a\n".b)
raise 'Social preview must have a 1200 x 630 canvas' unless share_image[16, 8].unpack('NN') == [1200, 630]

puts 'Brand rendering checks passed: visible name, accessible home link, subpath, mobile hooks, and cache-busted vector favicon.'
