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
  per_page: 8
  sort_field: date
  sort_reverse: true
  trail:
    before: 1
    after: 3
---

{% assign active_topic_count = 0 %}
{% for group in site.data.blog_topics %}
{% for topic in group.topics %}
{% assign topic_posts = site.categories[topic.key] %}
{% assign topic_item_count = 0 %}
{% if topic_posts %}
  {% assign topic_item_count = topic_item_count | plus: topic_posts.size %}
{% endif %}
{% if topic_item_count > 0 %}
{% assign active_topic_count = active_topic_count | plus: 1 %}
{% endif %}
{% endfor %}
{% endfor %}

<div class="blog-index journal-shell">
  {% if paginator.page == 1 %}
    <div class="blog-masthead">
      <header class="blog-intro">
        <p class="eyebrow">Hyeong-Jun Lee / Notes &amp; reviews</p>
        <h1>{{ site.blog_name }}</h1>
        <p>{{ site.blog_description }}.</p>
        <nav class="blog-jump-nav" aria-label="On this page">
          <a href="#explore-topics">Topics <span aria-hidden="true">↘</span></a>
          <a href="#all-posts">All posts <span aria-hidden="true">↘</span></a>
        </nav>
      </header>

    <dl class="blog-summary" aria-label="Blog summary">
      <div>
        <dt>Articles</dt>
        <dd>{{ site.posts.size }}</dd>
      </div>
      <div>
        <dt>Active topics</dt>
        <dd>{{ active_topic_count }}</dd>
      </div>
    </dl>
    </div>

    <section class="blog-section blog-discovery" aria-labelledby="explore-topics">
      <div class="section-heading">
        <div>
          <h2 id="explore-topics">Explore by topic</h2>
        </div>
      </div>

      <div class="blog-topic-groups">
        {% for group in site.data.blog_topics %}
          {% assign group_post_count = 0 %}
          {% for topic in group.topics %}
            {% assign topic_posts = site.categories[topic.key] %}
            {% if topic_posts %}
              {% assign group_post_count = group_post_count | plus: topic_posts.size %}
            {% endif %}
          {% endfor %}

          {% if group_post_count > 0 %}
            <section class="blog-topic-group" aria-labelledby="topic-group-{{ group.label | slugify }}">
              <header class="blog-topic-group__header">
                <h3 id="topic-group-{{ group.label | slugify }}">{{ group.label }}</h3>
              </header>
              <div class="blog-topic-grid">
                {% for topic in group.topics %}
                  {% include blog/topic_panel.liquid topic=topic %}
                {% endfor %}
              </div>
            </section>
          {% endif %}
        {% endfor %}
      </div>

      <details class="blog-specific-topics">
        <summary>Browse specific topics</summary>
        {% include blog/tag_browser.liquid %}
      </details>
    </section>

{% endif %}

  <section class="blog-section blog-archive" aria-labelledby="all-posts">
    <div class="section-heading">
      <div>
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
