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

<div class="post">

  <div class="header-bar">
    <h1>{{ site.blog_name }}</h1>
    <h2>{{ site.blog_description }}</h2>
  </div>

  {% if site.display_categories.size > 0 %}
  <div class="tag-category-list mb-4" style="text-align: center;">
    <ul class="p-0 m-0">
      {% for category in site.display_categories %}
        <li class="d-inline-block p-1">
          <a class="btn btn-sm btn-outline-secondary" href="{{ category | slugify | prepend: '/blog/category/' | relative_url }}">
            {{ category | replace: '-', ' ' | capitalize }}
          </a>
        </li>
      {% endfor %}
    </ul>
  </div>
  {% endif %}

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
          <a href="{{ tag | slugify | prepend: '/blog/tag/' | relative_url }}">
            <span class="badge rounded-pill border border-dark text-dark">{{ tag }}</span>
          </a>
        {% endfor %}
      </div>
    </li>
    <hr> {% endfor %}
  </ul>

  {% include pagination.liquid %}

</div>