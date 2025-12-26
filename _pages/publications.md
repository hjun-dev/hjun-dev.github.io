---
layout: page
permalink: /publications/
title: Publications
description: Publications organized by category and date.
nav: true
nav_order: 2
bibliography: false
---

<h2>International Journals</h2>
<div class="publications">
{% bibliography -f papers -q @article{keywords=/^intl_j$/} %}
</div>

<h2>International Conferences</h2>
<div class="publications">
{% bibliography -f papers -q @inproceedings{keywords=/^intl_c$/} %}
</div>

<h2>Korean Journals</h2>
<div class="publications">
{% bibliography -f papers -q @article{keywords=/^korean_j$/} %}
</div>

<h2>Korean Conferences</h2>
<div class="publications">
{% bibliography -f papers -q @inproceedings{keywords=/^korean_c$/} %}
</div>
