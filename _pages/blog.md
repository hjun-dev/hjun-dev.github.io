---
layout: default
permalink: /blog/
title: Blog
nav: true
nav_order: 1
pagination:
  enabled: true
  collection: posts
  permalink: /page/:num/
  per_page: 5
  sort_field: date
  sort_reverse: true
  trail:
    before: 1
    after: 3
---

<div class="blog-index journal-shell">
  {% if paginator.page == 1 %}
    <header class="blog-intro">
      <p class="eyebrow">Research notes</p>
      <h1>{{ site.blog_name }}</h1>
      <p>{{ site.blog_description }}. Technical notes on optimization, control, reinforcement learning, and the mathematics behind them.</p>
    </header>

    <dl class="blog-summary" aria-label="Blog summary">
      <div>
        <dt>Articles</dt>
        <dd>{{ site.posts.size }}</dd>
      </div>
      <div>
        <dt>Topics</dt>
        <dd>{{ site.data.blog_topics.size }}</dd>
      </div>
      <div>
        <dt>Latest</dt>
        <dd>{{ site.posts.first.date | date: '%Y.%m.%d' }}</dd>
      </div>
    </dl>

    <section class="blog-section" aria-labelledby="latest-writing">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Recently published</p>
          <h2 id="latest-writing">Latest writing</h2>
        </div>
      </div>

      {% include blog/featured_post.liquid post=site.posts.first %}

      <div class="blog-recent-grid">
        {% for post in site.posts offset: 1 limit: 4 %}
          {% include blog/post_card.liquid post=post %}
        {% endfor %}
      </div>
    </section>

    <section class="blog-section" aria-labelledby="explore-topics">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Browse the archive</p>
          <h2 id="explore-topics">Explore by topic</h2>
        </div>
      </div>

      <div class="blog-topic-grid">
        {% for topic in site.data.blog_topics %}
          {% include blog/topic_panel.liquid topic=topic %}
        {% endfor %}
      </div>
    </section>
  {% endif %}

  <section class="blog-section blog-archive" aria-labelledby="all-posts">
    <div class="section-heading">
      <div>
        <p class="eyebrow">Chronological archive</p>
        <h2 id="all-posts">All posts{% if paginator.page > 1 %} · Page {{ paginator.page }}{% endif %}</h2>
      </div>
    </div>

    <div class="blog-post-list">
      {% for post in paginator.posts %}
        {% include blog/post_row.liquid post=post %}
      {% endfor %}
    </div>

    {% include pagination.liquid %}
  </section>
</div>
