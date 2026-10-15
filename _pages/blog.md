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

{% assign active_topic_count = 0 %}
{% assign planned_notes = site.planned | sort: 'plan_order' %}
{% for group in site.data.blog_topics %}
{% for topic in group.topics %}
{% assign topic_posts = site.categories[topic.key] %}
{% assign topic_planned = planned_notes | where: 'primary_category', topic.key %}
{% assign topic_item_count = topic_planned.size %}
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
        <dt>Planned</dt>
        <dd>{{ planned_notes.size }}</dd>
      </div>
      <div>
        <dt>Active topics</dt>
        <dd>{{ active_topic_count }}</dd>
      </div>
      <div>
        <dt>Latest</dt>
        <dd>{{ site.posts.first.date | date: '%Y.%m.%d' }}</dd>
      </div>
    </dl>

    <section class="blog-section" aria-labelledby="explore-topics">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Browse the archive</p>
          <h2 id="explore-topics">Explore by topic</h2>
        </div>
      </div>

      <div class="blog-topic-groups">
        {% for group in site.data.blog_topics %}
          {% assign group_post_count = 0 %}
          {% for topic in group.topics %}
            {% assign topic_posts = site.categories[topic.key] %}
            {% assign topic_planned = planned_notes | where: 'primary_category', topic.key %}
            {% if topic_posts %}
              {% assign group_post_count = group_post_count | plus: topic_posts.size %}
            {% endif %}
            {% assign group_post_count = group_post_count | plus: topic_planned.size %}
          {% endfor %}

          {% if group_post_count > 0 %}
            <section class="blog-topic-group" aria-labelledby="topic-group-{{ group.label | slugify }}">
              <header class="blog-topic-group__header">
                <h3 id="topic-group-{{ group.label | slugify }}">{{ group.label }}</h3>
                <p>{{ group.description }}</p>
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

      <div class="blog-specific-topics">
        <div class="blog-specific-topics__heading">
          <h3>Browse specific topics</h3>
          <p>Methods, applications, and article formats across the primary fields.</p>
        </div>
        {% include blog/tag_browser.liquid %}
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

  {% if paginator.page == 1 %}
    <section class="blog-section writing-queue" aria-labelledby="writing-queue">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Next in the notebook</p>
          <h2 id="writing-queue">Writing queue</h2>
        </div>
        <p class="section-heading__note">Paper reviews and method notes currently being prepared.</p>
      </div>
      <div class="writing-queue__grid">
        {% for note in planned_notes %}
          {% include blog/planned_note.liquid note=note %}
        {% endfor %}
      </div>
    </section>
  {% endif %}
</div>
