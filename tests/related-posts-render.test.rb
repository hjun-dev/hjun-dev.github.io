require 'jekyll'
require 'nokogiri'
require 'time'
Dir[File.join(__dir__, '../_plugins/reading-recommendations.rb')].each { |path| require path }

template = Liquid::Template.parse(File.read(File.join(__dir__, '../_includes/related_posts.liquid')))
site = Jekyll::Site.new(Jekyll.configuration('source' => File.expand_path('..', __dir__), 'baseurl' => '/notes', 'quiet' => true))

def post(slug, title, category, tags, date = '2026-01-01')
  {'url' => "/blog/2026/#{slug}/", 'title' => title, 'categories' => [category], 'tags' => tags, 'date' => Time.parse(date)}
end

kkt = post('kkt', '[Convex Optimization] 12. KKT conditions', 'optimization', ['math', 'study', 'CMU 10-725'])
dual = post('dual', '[Convex Optimization] 11. Duality', 'optimization', ['math', 'study', 'CMU 10-725'])
next_chapter = post('correspondences', '[Convex Optimization] 13. Correspondences', 'optimization', ['math', 'study', 'CMU 10-725'])
newton = post('newton', '[Convex Optimization] 14. Newton Method', 'optimization', ['CMU 10-725'])
optnet = post('optnet', '[Paper Review] OptNet', 'optimization', ['paper review', 'differentiable optimization'], '2026-10-15')
supcon = post('supcon', '[Paper Review] SupCon', 'representation learning', ['paper review', 'math', 'study'], '2026-10-15')

render = lambda do |current, posts, limit = 5|
  html = template.render!(
    {'page' => current, 'site' => {'posts' => posts, 'related_posts' => posts,
      'related_blog_posts' => {'max_related' => limit}, 'newsletter' => {'enabled' => false}}},
    registers: {site: site}
  )
  Nokogiri::HTML.fragment(html)
end

# A newer unrelated review must not displace adjacent chapters or same-field notes.
document = render.call(kkt, [supcon, optnet, kkt, newton, next_chapter, dual])
raise 'Missing previous series chapter' unless document.at_css('a[rel="prev"]')&.[]('href') == '/notes/blog/2026/dual/'
raise 'Missing next series chapter' unless document.at_css('a[rel="next"]')&.[]('href') == '/notes/blog/2026/correspondences/'
raise 'Series not prioritized over newer same-field review' unless document.css('.post-related__list a').map { |a| a['href'] } == [
  '/notes/blog/2026/newton/', '/notes/blog/2026/optnet/'
]
links = document.css('a').map { |a| a['href'] }
raise 'Self-link or unrelated recommendation leaked' if links.any? { |url| url.end_with?('/kkt/', '/supcon/') }
raise 'Recommendations repeated' unless links == links.uniq

first = render.call(dual, [kkt, dual])
raise 'Invented a previous chapter at series start' if first.at_css('a[rel="prev"]')
raise 'Lost the next available chapter' unless first.at_css('a[rel="next"]')&.[]('href') == '/notes/blog/2026/kkt/'

last = render.call(newton, [dual, newton, next_chapter])
raise 'Invented a next chapter at series end' if last.at_css('a[rel="next"]')
raise 'Lost previous chapter' unless last.at_css('a[rel="prev"]')&.[]('href') == '/notes/blog/2026/correspondences/'

cross_field = post('differentiable-control', 'Differentiable control', 'control', ['differentiable optimization'])
redirect = post('old-optnet', 'Old OptNet', 'optimization', []).merge('redirect' => '/blog/2026/optnet/')
document = render.call(optnet, [redirect, supcon, optnet, cross_field])
raise 'Shared technical tag not recognized' unless document.css('a').map { |a| a['href'] } == ['/notes/blog/2026/differentiable-control/']
raise 'Unrelated-only list should be omitted' if render.call(supcon, [supcon, dual]).at_css('.post-related')
raise 'Zero limit should omit recommendations' if render.call(kkt, [dual, next_chapter], 0).at_css('.post-related')
raise 'Limit exceeded' if render.call(kkt, [dual, next_chapter, newton, optnet], 2).css('a').length > 2

puts 'Related reading checks passed: series order, category priority, technical tags, no self-links/duplicates/redirects, boundaries, limits, and baseurl.'
