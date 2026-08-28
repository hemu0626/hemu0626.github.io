---
layout: page
title: Psychometrical Methods (SURF 2022)
description: Summer Undergraduate Research Fellowship 2022
importance: 6
category: work
related_publications: false
---

{% assign poster_pdf = site.static_files | where: "path", "/assets/surf/2022-psychometrics.pdf" | first %}
{% assign poster_png = site.static_files | where: "path", "/assets/surf/2022-psychometrics.png" | first %}
{% assign poster_jpg = site.static_files | where: "path", "/assets/surf/2022-psychometrics.jpg" | first %}
{% if poster_pdf %}<p><a href="/assets/surf/2022-psychometrics.pdf">Download poster (PDF)</a></p>{% endif %}
{% if poster_png %}<p><img src="/assets/surf/2022-psychometrics.png" alt="SURF 2022 poster"></p>{% endif %}
{% if poster_jpg %}<p><img src="/assets/surf/2022-psychometrics.jpg" alt="SURF 2022 poster"></p>{% endif %}
