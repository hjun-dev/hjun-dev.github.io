---
layout: page
permalink: /publications/
title: Publications
description: Publications organized by category and date.
nav: true
nav_order: 2
---

{% capture international_journals_publications %}
{% bibliography -f papers -q @article[keywords~=intl_journal] %}
{% endcapture %}
{% capture international_conferences_publications %}
{% bibliography -f papers -q @inproceedings[keywords~=intl_conf] %}
{% endcapture %}
{% capture korean_journals_publications %}
{% bibliography -f papers -q @article[keywords~=korean_journal] %}
{% endcapture %}
{% capture korean_conferences_publications %}
{% bibliography -f papers -q @inproceedings[keywords~=korean_conf] %}
{% endcapture %}

{% if international_journals_publications contains '<li' %}

<section class="publication-section" aria-labelledby="publications-international-journals">
  <div class="section-heading">
    <div>
      <p class="eyebrow">Journal articles</p>
      <h2 id="publications-international-journals">International Journals</h2>
    </div>
  </div>
  <div class="publications">
    {{ international_journals_publications }}
  </div>
</section>
{% endif %}

{% if international_conferences_publications contains '<li' %}

<section class="publication-section" aria-labelledby="publications-international-conferences">
  <div class="section-heading">
    <div>
      <p class="eyebrow">Conference papers</p>
      <h2 id="publications-international-conferences">International Conferences</h2>
    </div>
  </div>
  <div class="publications">
    {{ international_conferences_publications }}
  </div>
</section>
{% endif %}

{% if korean_journals_publications contains '<li' %}

<section class="publication-section" aria-labelledby="publications-korean-journals">
  <div class="section-heading">
    <div>
      <p class="eyebrow">Domestic journals</p>
      <h2 id="publications-korean-journals">Korean Journals</h2>
    </div>
  </div>
  <div class="publications">
    {{ korean_journals_publications }}
  </div>
</section>
{% endif %}

{% if korean_conferences_publications contains '<li' %}

<section class="publication-section" aria-labelledby="publications-korean-conferences">
  <div class="section-heading">
    <div>
      <p class="eyebrow">Domestic conferences</p>
      <h2 id="publications-korean-conferences">Korean Conferences</h2>
    </div>
  </div>
  <div class="publications">
    {{ korean_conferences_publications }}
  </div>
</section>
{% endif %}
