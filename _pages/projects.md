---
layout: page
title: Projects
permalink: /projects/
description: Research and student projects.
nav: true
nav_order: 3
display_categories: []
horizontal: false
---

<style>
  .projects .row { display: flex; flex-wrap: wrap; gap: 1rem; }
  .projects .row > .col { flex: 0 0 calc(25% - 0.75rem); width: calc(25% - 0.75rem); box-sizing: border-box; }
  @media (max-width: 767px) {
    .projects .row > .col { flex: 0 0 calc(50% - 0.5rem); width: calc(50% - 0.5rem); }
  }
  .projects .card-title { font-size: 1.15rem; line-height: 1.35; margin-bottom: 0.5rem; }
</style>

<!-- pages/projects.md -->
<div class="projects">
{% if site.enable_project_categories and page.display_categories %}
  <!-- Display categorized projects -->
  {% for category in page.display_categories %}
  <a id="{{ category }}" href=".#{{ category }}">
    <h2 class="category">{{ category }}</h2>
  </a>
  {% assign categorized_projects = site.projects | where: "category", category %}
  {% assign sorted_projects = categorized_projects | sort: "importance" %}
  {% if page.horizontal %}
  <div class="container">
    <div class="row row-cols-1 row-cols-md-2">
    {% for project in sorted_projects %}
      {% include projects_horizontal.liquid %}
    {% endfor %}
    </div>
  </div>
  {% else %}
  <div class="row row-cols-1 row-cols-md-3">
    {% for project in sorted_projects %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
  {% endif %}
  {% endfor %}

{% else %}

<!-- Display projects without categories: FYP alone on its row, then SURF cards two per row -->

{% assign sorted_projects = site.projects | sort: "importance" %}
{% assign fyp_card = sorted_projects | first %}
{% assign surf_cards = sorted_projects | shift %}

<div style="max-width: 1150px; margin-inline: auto;">
  <div class="row row-cols-2 row-cols-md-4">
    {% assign project = fyp_card %}
    {% include projects.liquid %}
  </div>
  <div class="row row-cols-2 row-cols-md-4">
    {% for project in surf_cards %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
</div>
{% endif %}
</div>
