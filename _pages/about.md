---
layout: about
title: About
permalink: /
subtitle: M.S. in Dept. of Aerospace Engineering, Inha University
profile:
  image: leepic.jpg
selected_papers: false
social: true
contact_email: hjunlee525@gmail.com
contact_address: Inha Aerospace Campus, 36 Gaetbeol-ro, Yeonsu-gu, Incheon 21999, Republic of Korea
announcements:
  enabled: false
latest_posts:
  enabled: true
  limit: 2
---

<div class="home-research">
  <section class="home-research__focus" aria-labelledby="research-focus">
    <h2 id="research-focus">Research focus</h2>
    <p>My research focuses on optimal control theory, deep learning and reinforcement learning applications for aerospace systems.</p>
    <p>My goal is to bridge the gap between theoretical control guarantees and practical learning-based methods.</p>
  </section>
  <section class="home-research__interests" aria-labelledby="research-interests">
    <h2 id="research-interests">Research interests</h2>
    <dl>
      <div><dt>Optimization</dt><dd>Convex optimization, SCP, convergence analysis</dd></div>
      <div><dt>Control theory</dt><dd>Model predictive control</dd></div>
      <div><dt>Learning</dt><dd>Deep learning, safe RL, imitation learning</dd></div>
      <div><dt>Aerospace systems</dt><dd>Guidance, navigation, and control</dd></div>
    </dl>
  </section>
</div>

<section class="home-module home-projects" aria-labelledby="home-projects-title">
  <div class="section-heading">
    <h2 id="home-projects-title">Recent projects</h2>
    <a class="text-link" href="{{ '/projects/' | relative_url }}">View all projects <span aria-hidden="true">→</span></a>
  </div>
  <div class="projects">
    <div class="row row-cols-1 row-cols-md-2 row-cols-xl-3 project-grid">
      {% assign sorted_projects = site.projects | sort: 'importance' %}
      {% for project in sorted_projects limit: 3 %}
        {% include projects.liquid heading_level=3 %}
      {% endfor %}
    </div>
  </div>
</section>
