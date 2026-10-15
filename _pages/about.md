---
layout: about
title: About
permalink: /
subtitle: M.S. in Dept. of Aerospace Engineering, Inha University
profile:
  align: right
  image: leepic.jpg
  image_circular: false # crops the image to make it circular
  address: >
    Dept. of Aerospace Engineering<br>
    Inha University<br>
    Incheon, South Korea

selected_papers: false # includes a list of papers marked as "selected={true}"
social: true # includes social icons at the bottom of the page

announcements:
  enabled: false # includes a list of news items
  scrollable: false # adds a vertical scroll bar if there are more than 3 news items
  limit: 5 # leave blank to include all the news in the `_news` folder

latest_posts:
  enabled: true
  scrollable: false # adds a vertical scroll bar if there are more than 3 new posts items
  limit: 2 # leave blank to include all the blog posts
---

<div class="home-research">
  <section class="home-research__focus">
    <h2>Research focus</h2>
    <p>My research focuses on optimal control theory, deep learning and reinforcement learning applications for aerospace systems.</p>
    <p>My goal is to bridge the gap between theoretical control guarantees and practical learning-based methods.</p>
  </section>
  <section class="home-research__interests">
    <h2>Research interests</h2>
    <dl>
      <div><dt>Optimization</dt><dd>Convex optimization, SCP, convergence analysis</dd></div>
      <div><dt>Control theory</dt><dd>Model predictive control</dd></div>
      <div><dt>Learning</dt><dd>Deep learning, safe RL, imitation learning</dd></div>
      <div><dt>Aerospace systems</dt><dd>Guidance, navigation, and control</dd></div>
    </dl>
  </section>
</div>

<div class="section-heading mt-5">
  <h2>Recent Projects</h2>
  <a class="text-link" href="{{ '/projects/' | relative_url }}">View all projects <span aria-hidden="true">→</span></a>
</div>

<div class="projects">
  <div class="row row-cols-1 row-cols-md-2 row-cols-xl-3 project-grid">
    {% assign sorted_projects = site.projects | sort: 'importance' %}
    {% for project in sorted_projects limit: 3 %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
</div>

<div class="section-heading mt-5">
  <h2>Contact</h2>
</div>

- **Email:** hjunlee525@gmail.com
- **Address:** Inha Aerospace Campus, 36 Gaetbeol-ro, Yeonsu-gu, Incheon 21999, Republic of Korea

---
