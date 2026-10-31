'use strict';
const content = window.ECHO_CONTENT;
for (const video of document.querySelectorAll('video[data-loop-demo]')) {
  video.muted = true;
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    video.autoplay = true;
    video.play().catch(() => { /* Native controls remain available if autoplay is blocked. */ });
  }
}
for (const [label, url] of Object.entries(content.resources)) {
  const item = document.createElement(url ? 'a' : 'span');
  item.textContent = url ? label : label + ' · coming soon';
  if (url) { item.href = url; item.target = '_blank'; item.rel = 'noopener'; }
  document.querySelector('#resource-links').append(item);
}
const demoNames = { segmentation: 'Left Ventricular Segmentation' };
for (const [key, demo] of Object.entries(content.demos)) {
  const article = document.createElement('article');
  article.className = 'demo';
  const title = document.createElement('h3'); title.textContent = demoNames[key];
  const mediaGrid = document.createElement('div');
  mediaGrid.className = key === 'segmentation' ? 'segmentation-grid' : '';
  const items = demo.items || (key === 'segmentation' && !demo.src ? [{}, {}, {}] : [demo]);
  for (const item of items) {
  const stage = document.createElement('div'); stage.className = 'demo-media';
  const pending = () => { stage.replaceChildren(); const p = document.createElement('div'); p.className = 'media-pending'; p.textContent = 'Visualization coming soon'; stage.append(p); };
  if (item.src) {
    const isVideo = item.type === 'video';
    const media = document.createElement(isVideo ? 'video' : 'img');
    if (isVideo) {
      media.controls = true; media.loop = true; media.muted = true; media.playsInline = true; media.preload = 'metadata';
      media.autoplay = key === 'segmentation' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (item.poster) media.poster = item.poster;
      media.setAttribute('aria-label', `${item.title || demoNames[key]}: 2CH and 4CH original images and segmentation overlap`);
    }
    else { media.alt = demoNames[key]; media.loading = 'lazy'; }
    media.addEventListener('error', pending, { once: true });
    media.src = item.src; stage.append(media);
  } else pending();
  if (item.title) { const caption = document.createElement('p'); caption.className = 'case-caption'; caption.textContent = item.title; stage.append(caption); }
  mediaGrid.append(stage);
  }
  article.append(title, mediaGrid);
  if (key === 'segmentation') {
    const legend = document.createElement('p'); legend.className = 'video-legend';
    for (const [color, label] of [['#00b800', 'Ground truth'], ['#df2626', 'Prediction'], ['#d4bc00', 'Overlap']]) {
      const entry = document.createElement('span'); const swatch = document.createElement('i');
      swatch.style.backgroundColor = color; swatch.setAttribute('aria-hidden', 'true');
      entry.append(swatch, document.createTextNode(label)); legend.append(entry);
    }
    article.append(legend);
  }
  document.querySelector('#segmentation-gallery').append(article);
}
