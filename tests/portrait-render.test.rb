require 'jekyll'
require 'nokogiri'
require 'uri'
require_relative '../_plugins/cache-bust'

root = File.expand_path('..', __dir__)
site = Jekyll::Site.new(Jekyll.configuration('source' => root, 'quiet' => true))
site.config['imagemagick']['enabled'] = true
payload = { 'site' => site.site_payload['site'], 'page' => { 'profile' => { 'image' => 'leepic.jpg' } }, 'content' => '' }
registers = { site: site, page: payload['page'] }

about = site.liquid_renderer.file('_layouts/about.liquid').parse(File.read(File.join(root, '_layouts/about.liquid')))
portrait = Nokogiri::HTML(about.render!(payload, registers: registers)).at_css('.home-hero__portrait picture')
raise 'About must retain its profile portrait' unless portrait
raise 'The profile portrait must not select a downsampled source' if portrait.at_css('source[srcset]')
image_url = URI.parse(portrait.at_css('img')['src'])
raise 'The profile must use the original image' unless image_url.path == '/assets/img/leepic.jpg'
raise 'The original image must retain cache invalidation' unless image_url.query&.match?(/\A[0-9a-f]{32}\z/)

figure = site.liquid_renderer.file('_includes/figure.liquid').parse(File.read(File.join(root, '_includes/figure.liquid')))
ordinary_image = figure.render!({ 'site' => payload['site'], 'include' => { 'path' => 'assets/img/leepic.jpg' } }, registers: registers)
raise 'Other images must retain responsive sources' unless Nokogiri::HTML(ordinary_image).at_css('source[srcset]')

puts 'Portrait rendering checks passed: original source, cache invalidation, other responsive images unchanged.'
