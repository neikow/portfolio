export const EU_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Georgia', 'Times New Roman', serif; font-size: 11pt; color: #2c2c2c; background: #fff; }
  .page { max-width: 210mm; margin: 0 auto; padding: 18mm 20mm; min-height: 297mm; }
  .header { border-bottom: 3px solid #1a3a5c; padding-bottom: 12px; margin-bottom: 18px; }
  .name { font-size: 26pt; font-weight: bold; color: #1a3a5c; letter-spacing: -0.5px; }
  .tagline { font-size: 12pt; color: #666; margin-top: 3px; }
  .contact { font-size: 9pt; color: #555; margin-top: 8px; }
  .content h1 { font-size: 12pt; text-transform: uppercase; letter-spacing: 1.5px; color: #1a3a5c; border-bottom: 1px solid #dce3ec; padding-bottom: 4px; margin: 20px 0 8px; }
  .content h2 { font-size: 11pt; font-weight: bold; color: #2c2c2c; margin: 12px 0 3px; }
  .content h3 { font-size: 10.5pt; font-weight: bold; color: #1a3a5c; margin: 10px 0 3px; }
  .content p { margin: 3px 0 7px; line-height: 1.55; }
  .content ul { padding-left: 16px; margin: 3px 0 8px; }
  .content li { margin: 2px 0; line-height: 1.45; }
  .content strong { color: #1a3a5c; }
  .content em { font-style: italic; color: #555; }
  .content hr { border: none; border-top: 1px solid #e0e0e0; margin: 14px 0; }
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="name">Vitaly Lysen</div>
    <div class="tagline">Full-Stack Software Engineer</div>
    <div class="contact">vitaly@lysen.dev &nbsp;·&nbsp; lysen.dev &nbsp;·&nbsp; linkedin.com/in/vlysen &nbsp;·&nbsp; github.com/neikow &nbsp;·&nbsp; Marseille, France</div>
  </div>
  <div class="content">{{content}}</div>
</div>
</body>
</html>`

export const US_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @page { size: letter; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Arial', 'Helvetica', sans-serif; font-size: 10.5pt; color: #000; background: #fff; }
  .page { max-width: 215.9mm; margin: 0 auto; padding: 17mm 19mm; min-height: 279.4mm; }
  .header { text-align: center; margin-bottom: 10px; border-bottom: 2px solid #000; padding-bottom: 8px; }
  .name { font-size: 17pt; font-weight: bold; text-transform: uppercase; letter-spacing: 2.5px; }
  .contact { font-size: 9pt; margin-top: 4px; color: #333; }
  .content h1 { font-size: 10.5pt; font-weight: bold; text-transform: uppercase; border-bottom: 1.5px solid #000; padding-bottom: 2px; margin: 16px 0 7px; letter-spacing: 1px; }
  .content h2 { font-size: 10.5pt; font-weight: bold; margin: 10px 0 2px; }
  .content h3 { font-size: 10.5pt; font-weight: bold; margin: 9px 0 2px; }
  .content p { margin: 2px 0 6px; line-height: 1.4; }
  .content ul { padding-left: 14px; margin: 2px 0 6px; }
  .content li { margin: 1px 0; line-height: 1.4; }
  .content strong { font-weight: bold; }
  .content em { font-style: italic; }
  .content hr { border: none; border-top: 1px solid #ccc; margin: 10px 0; }
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="name">Vitaly Lysen</div>
    <div class="contact">vitaly@lysen.dev &nbsp;|&nbsp; lysen.dev &nbsp;|&nbsp; github.com/neikow &nbsp;|&nbsp; linkedin.com/in/vlysen</div>
  </div>
  <div class="content">{{content}}</div>
</div>
</body>
</html>`
