---
layout: default
permalink: /blog/
title: blog
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
  <ul class="post-list">
    {% for post in paginator.posts %}
    <li class="post-list-item">
      <div class="row">
        {% if post.thumbnail %}
        <div class="col-sm-3">
           <img class="img-fluid z-depth-1 rounded" src="{{ post.thumbnail | relative_url }}">
        </div>
        {% endif %}
        
        <div class="col-sm-9">
          <h3>
            <a class="post-title" href="{{ post.url | relative_url }}">{{ post.title }}</a>
          </h3>
          <p class="post-meta">{{ post.date | date: "%b %-d, %Y" }}</p>
          <p>{{ post.description }}</p>
        </div>
      </div>
    </li>
    <hr>
    {% endfor %}
  </ul>

  {% include pagination.liquid %}
</div>