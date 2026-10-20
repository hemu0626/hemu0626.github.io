---
layout: about
title: About
permalink: /
subtitle: Assistant Professor · Suzhou, China

profile:
  align: right
  image: prof_pic.jpg
  image_circular: false # crops the image to make it circular

selected_papers: true # includes a list of papers marked as "selected={true}"
social: true # includes social icons at the bottom of the page

announcements:
  enabled: true # includes a list of news items
  scrollable: true # adds a vertical scroll bar if there are more than 3 news items
  limit: 5 # leave blank to include all the news in the `_news` folder

latest_posts:
  enabled: true
  scrollable: true # adds a vertical scroll bar if there are more than 3 new posts items
  limit: 3 # leave blank to include all the blog posts
---

I am an Assistant Professor at Xi'an Jiaotong-Liverpool University (XJTLU), Suzhou, China. My research interests include statistics, survival analysis, and One Health.

I am always seeking motivated and interested undergraduate and graduate students to join my research team. We are currently looking for data analysts and research assistants to help us process and understand vast amounts of information. Skills in R (ggplot2, survival analysis, etc.) are essential for these positions. This is an excellent opportunity for individuals interested in health research who wish to gain valuable experience in data analysis and scientific inquiry. See the announcements below or email me directly.

<div class="home-pelican">
  <iframe src="/assets/img/pelican-deepseek-bike.html" title="A pelican riding a bicycle, carrying a DeepSeek whale" loading="lazy" scrolling="no"></iframe>
</div>

<style>
  .home-pelican {
    margin: 2.5rem 0 1rem;
    opacity: 0;
    transition: opacity 0.25s ease;
  }
  .home-pelican iframe {
    display: block;
    width: 100%;
    aspect-ratio: 1000 / 560;
    overflow: hidden;
    border: 0;
    border-radius: 18px;
    background: #0b1622;
  }
</style>

<script>
  // The about layout puts page content above News and Selected Publications,
  // so move the animation to the end of the article after the page is parsed.
  (function () {
    function place() {
      var block = document.querySelector(".home-pelican");
      if (!block) return;
      var pubs = document.querySelector(".post .publications");
      if (pubs && pubs.parentNode) {
        pubs.parentNode.insertBefore(block, pubs.nextSibling);
      }
      block.style.opacity = "1";
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", place);
    } else {
      place();
    }
  })();
</script>
