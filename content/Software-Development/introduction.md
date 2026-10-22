---
title: Pengujian 101
excerpt: development mode [testing only]...
date: 2024-01-01
isLocked: false
question: ''
hintSystemLog: ''
---

## testing first


| Setting           | Value           |
| ----------------- | --------------- |
| Install command   | `bun install`   |
| Build command     | `bun run build` |
| Publish directory | `dist`          |

<div class="callout" data-type="alert">

Hello World!

</div>



<pre class="terminal"><span class="term-cmd"><span class="term-prompt">$</span> cp -r node_modules/@sveltia/cms/dist/chunks public/admin/</span>
<span class="term-out">status: OK...</span></pre>



***



```diff title="sigma.html"
- <script src="function.js"></script>
+ <script src="Theme.js"></script>
```





```html title="index.html"
<!doctype html>
<html lang="id">
  <head>
    <meta charset="utf-8" />
    <meta name="robots" content="noindex" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>CMS example</title>
  </head>
  <body>
    <script src="sveltia-cms.js"></script>
    <script src="editor-components.js"></script>
  </body>
</html>
```



***



<div class="embed-youtube"><iframe src="https://www.youtube.com/embed/mpxOdBQW818" loading="lazy" allowfullscreen></iframe></div>



***



<details class="fold">
<summary>apakah ini bekerja?</summary>

Tentu saja, seharusnya, setidaknya

</details>



***



<div class="math-block" data-tex-b64="eF4yICsgeV4yID0gel4yXHNxcnR7eCArIDF9"></div>





<div class="math-block" data-tex-b64="XGFscGhhLCBcYmV0YSwgXHRoZXRhLCBccGk="></div>





<div class="mermaid-block" data-src-b64="Zmxvd2NoYXJ0IExSOyBBW011bGFpXSAtLT4gQltQcm9zZXNdOyBCIC0tPiBDW1NlbGVzYWldOw=="></div>
