---
layout: archive
title: "Sitemap"
permalink: /sitemap/
author_profile: false
---

A list of all the pages found on the site. For you robots out there is an [XML version]({{ "sitemap.xml" | relative_url }}) available for digesting as well.

<h2>Pages</h2>
{% for post in site.pages %}
  {% include archive-single.html %}
{% endfor %}

