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
    before: 1 # The number of links before the current page
    after: 3 # The number of links after the current page
---

<div class="post">
  <div class="tag-list mb-4" style="text-align: center;">
    <span class="badge bg-secondary p-2 m-1">Optimization</span>
    <span class="badge bg-secondary p-2 m-1">Control</span>
    <span class="badge bg-secondary p-2 m-1">Reinforcement Learning</span>
    <span class="badge bg-secondary p-2 m-1">Paper Review</span>
  </div>

  <ul class="post-list">
    {% for post in paginator.posts %}
    <li>
      <h3>
        <a class="post-title" href="{{ post.url | relative_url }}">{{ post.title }}</a>
      </h3>
      <p class="post-meta">{{ post.date | date: "%B %-d, %Y" }}</p>
      <p class="post-excerpt">{{ post.description }}</p>
      <div class="post-tags">
        {% for tag in post.tags %}
        <span class="badge rounded-pill border border-dark text-dark">{{ tag }}</span>
        {% endfor %}
      </div>
    </li>
    <hr>
    {% endfor %}
  </ul>
  {% include pagination.liquid %}
</div>