require 'liquid'
require 'nokogiri'

template = Liquid::Template.parse(File.read(File.join(__dir__, '../_includes/cv/map.liquid')))
contents = [
  {'name' => 'Name', 'value' => 'Planning @ Inha'},
  {'name' => 'Email', 'value' => 'hjunlee525@gmail.com'}
]
document = Nokogiri::HTML.fragment(template.render!('entry' => {'contents' => contents}))
rows = document.css('tr')
raise 'Changed the email text' unless rows[1].css('td').last.text.strip == 'hjunlee525@gmail.com'
raise 'Missing a natural email wrap point' unless rows[1].at_css('td:last-child wbr')
raise 'Wrapped unrelated CV text' if rows[0].at_css('wbr')
raise 'Changed unrelated CV text' unless rows[0].css('td').last.text.strip == 'Planning @ Inha'
puts 'CV mobile rendering checks passed: email text preserved with a natural wrap point, other values unchanged.'
