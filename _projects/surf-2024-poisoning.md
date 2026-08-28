---
layout: page
title: Survival Analysis in Poisoning (SURF 2024)
description: Summer Undergraduate Research Fellowship 2024
img: assets/img/surf-2024-thumb.jpg
importance: 4
category: work
related_publications: false
---

{% assign poster_pdf = site.static_files | where: "path", "/assets/surf/2024-poisoning.pdf" | first %}
{% assign poster_png = site.static_files | where: "path", "/assets/surf/2024-poisoning.png" | first %}
{% assign poster_jpg = site.static_files | where: "path", "/assets/surf/2024-poisoning.jpg" | first %}
{% if poster_pdf %}<p><a href="/assets/surf/2024-poisoning.pdf">Download poster (PDF)</a></p>{% endif %}
{% if poster_png %}<p><img src="/assets/surf/2024-poisoning.png" alt="SURF 2024 poster" style="width:70%;height:auto;"></p>{% endif %}
{% if poster_jpg %}<p><img src="/assets/surf/2024-poisoning.jpg" alt="SURF 2024 poster" style="width:70%;height:auto;"></p>{% endif %}
