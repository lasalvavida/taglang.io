---
title: Hello World!
date: 2016-10-05 0:00.00
---

# {{ $page.frontmatter.title }}

**{{ new Date($page.frontmatter.date).toDateString() }}**


Cliched as it may be, I am very happy to finally have this blog up and running. There are many improvements I'd like to make to this framework eventually, but it is good enough now that I am comfortable enough to finally start using it.

Currently, this will mostly be used to track my progress on my Master's thesis. That thesis is on implementing video fusion with unaligned camera sources on FPGAs using SURF (Speeded-up Robust Features) to find key points and align the image feeds.

As a secondary goal to that, I am interested in the web as a teaching tool. There are a ton of great and helpful resources available to help learn about image processing, however most of them are static pages. The good ones have lots of pictures and code snippets, but they're still just documents.

As I cover topics on this blog, I will be including interactive javascript examples to help visualize and explore image processing techniques. To that end, I've begun work on an open-source library called
[VisionJS](https://github.com/lasalvavida/visionjs)".
The name may change, but the idea will stay the same. VisionJS will be the backbone of these interactive scripts.

I hope you find this blog useful for whatever your ends may be.

-Rob

<BlogPostNav/>
