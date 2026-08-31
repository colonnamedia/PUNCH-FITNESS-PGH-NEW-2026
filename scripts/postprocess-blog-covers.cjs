const fs = require('fs');
const path = require('path');

const coverCss = `
<style id="blog-title-cover-style">
.bpost-media.blog-title-panel,.blog-article-title-panel{display:flex;align-items:flex-end;min-height:220px;padding:24px;background:linear-gradient(135deg,#111 0%,#292929 70%,#b31217 140%);position:relative;overflow:hidden;box-sizing:border-box}
.bpost-media.blog-title-panel:before,.blog-article-title-panel:before{content:"PUNCH JOURNAL";position:absolute;top:20px;left:24px;font-size:11px;font-weight:900;letter-spacing:.18em;color:rgba(255,255,255,.55)}
.blog-cover-title{color:#fff;font-size:clamp(22px,2.2vw,31px);font-weight:900;line-height:1.03;letter-spacing:-.035em;text-transform:uppercase;max-width:95%;text-shadow:0 2px 12px rgba(0,0,0,.25)}
.blog-article-title-panel{min-height:300px;border-radius:14px;margin-bottom:28px;align-items:flex-end}
.blog-article-title-panel .blog-cover-title{font-size:clamp(30px,5vw,48px);max-width:90%}
</style>`;

function ensureCss(html){
  if (html.includes('id="blog-title-cover-style"')) return html;
  return html.replace('</head>', `${coverCss}\n</head>`);
}

function replaceCardImages(html){
  return html.replace(
    /<div class="bpost-media"><img src="[^"]*" alt="([^"]*)" loading="lazy"><\/div>/g,
    '<div class="bpost-media blog-title-panel"><div class="blog-cover-title">$1</div></div>'
  );
}

function replaceArticleHero(html){
  return html.replace(
    /<img src="[^"]*" alt="([^"]*)" style="width:100%;border-radius:14px;margin-bottom:28px">/g,
    '<div class="blog-article-title-panel"><div class="blog-cover-title">$1</div></div>'
  );
}

for (const file of ['dist/blog-events.html', 'dist/blog-events/index.html']) {
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, 'utf8');
  html = ensureCss(replaceCardImages(html));
  fs.writeFileSync(file, html);
}

const blogDir = 'dist/blog';
if (fs.existsSync(blogDir)) {
  for (const slug of fs.readdirSync(blogDir)) {
    const file = path.join(blogDir, slug, 'index.html');
    if (!fs.existsSync(file)) continue;
    let html = fs.readFileSync(file, 'utf8');
    html = ensureCss(replaceArticleHero(html));
    fs.writeFileSync(file, html);
  }
}

console.log('Applied text title covers to prerendered blog cards and article heroes.');
