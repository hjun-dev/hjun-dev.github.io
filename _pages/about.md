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
  enabled: false
  scrollable: false # adds a vertical scroll bar if there are more than 3 new posts items
  limit: 3 # leave blank to include all the blog posts
---

**Hello! I am Hyeongjun Lee.**
 
My research focuses on optimal control theory, deep learning and reinforcement learning applications for aerospace systems.
My goal is to bridge the gap between theoretical control guarantees and practical learning-based methods.

### **Research Interests**
* **Optimization** (Convex Optimization, SCP, Convergence Analysis)
* **Control Theory** (MPC)
* **Deep Learning**
* **Reinforcement Learning** (Safe RL, Imitation learning)
* **Aerospace Systems** (Guidance, Navigation, and Control)

### **Recent Projects**
<div class="projects">
  <div class="row row-cols-1 row-cols-md-3">
    {% for project in site.projects limit:3 %}
    <div class="col mb-4">
      <div class="card h-100 hoverable">
        {% if project.img %}
        <a href="{{ project.url | relative_url }}">
          <img src="{{ project.img | relative_url }}" class="card-img-top" alt="{{ project.title }}" style="object-fit: cover; height: 150px;">
        </a>
        {% endif %}
        <div class="card-body">
          <h5 class="card-title"><a href="{{ project.url | relative_url }}">{{ project.title }}</a></h5>
          <p class="card-text" style="font-size: 0.9rem;">{{ project.description }}</p>
        </div>
      </div>
    </div>
    {% endfor %}
  </div>
</div>

### **Contact**

* **Email:** 12200617@inha.edu
* **Address:** Inha Aerospace Campus, 36 Gaetbeol-ro, Yeonsu-gu, Incheon 21999, Republic of Korea

---