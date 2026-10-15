module ReadingRecommendations
  # Format labels do not establish a technical relationship between two articles.
  GENERIC_TAGS = ['paper review', 'math', 'study'].freeze

  def reading_recommendations(page, posts, limit = 5)
    limit = [limit.to_i, 0].max
    result = {'series' => nil, 'previous' => nil, 'next' => nil, 'posts' => []}
    return result if limit.zero?

    candidates = Array(posts).map { |post| post.respond_to?(:to_liquid) ? post.to_liquid : post }
      .reject { |post| post['url'] == page['url'] || !post['redirect'].to_s.empty? }
      .uniq { |post| post['url'] }
    current_series = reading_series(page)

    if current_series
      siblings = candidates.filter_map do |post|
        series = reading_series(post)
        [series[1], post] if series && series[0] == current_series[0]
      end.sort_by(&:first)
      result['series'] = current_series[0]
      result['previous'] = siblings.reverse.find { |number, _| number < current_series[1] }&.last
      result['next'] = siblings.find { |number, _| number > current_series[1] }&.last if limit > 1 || !result['previous']
    end

    selected_urls = [result['previous'], result['next']].compact.map { |post| post['url'] }
    categories = Array(page['categories'])
    tags = Array(page['tags']) - GENERIC_TAGS
    ranked = candidates.filter_map do |post|
      next if selected_urls.include?(post['url'])

      same_category = !(categories & Array(post['categories'])).empty?
      shared_tags = (tags & Array(post['tags'])).size
      series = reading_series(post)
      same_series = current_series && series && series[0] == current_series[0]
      next unless same_series || same_category || shared_tags.positive?

      [post, same_series ? 1 : 0, same_category ? 1 : 0, shared_tags]
    end
    result['posts'] = ranked.sort_by do |post, series_score, category_score, tag_score|
      [-series_score, -category_score, -tag_score, -post['date'].to_time.to_i, post['url']]
    end.first(limit - selected_urls.size).map(&:first)
    result
  end

  private

  # Existing numbered titles provide sequence metadata without changing article files.
  def reading_series(post)
    match = post['title'].to_s.match(/\A\[([^\]]+)\]\s*(\d+)\s*[.:]/)
    [match[1], match[2].to_i] if match
  end
end

Liquid::Template.register_filter(ReadingRecommendations)
