---
title: Blog
description: Update from my blog post
pagination:
  data: collections.posts
  size: 5
  reverse: true
testdata:
 - item1
 - item2
 - item3
 - item4
permalink: "blog/{% if pagination.pageNumber > 0 %}page-{{ pagination.pageNumber + 1 }}/{% endif %}index.html"
---
{%- for item in pagination.items %}<article><h2><a href="{{ item.url }}" aria-label="Article Title" class="postlist-link">{{ item.data.title }}</a></h2><p>{{ item.data.description }}</p><p>Publish by <a href="{{metadata.author.url}}" aria-label="Article Author">{{metadata.author.name}}</a> on <time datetime="{{ post.date | htmlDateString }}" aria-label="Article Published">{{ page.date | readableDate }}</time></p></article>{% endfor -%}<div class="pagination">{% if pagination.href.previous %}<a href="{{ pagination.href.previous }}" aria-label="Previous Blog List Article">← Previous</a>{% endif %}{% if pagination.href.next %}<a href="{{ pagination.href.next }}" aria-label="Next Blog List Article">Next →</a>{% endif %}</div>
