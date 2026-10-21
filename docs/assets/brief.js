(function () {
  var d = document, body = d.body, key = 'brief:' + (body.dataset.date || 'x');
  var bar = d.querySelector('.progress i'), top = d.querySelector('.totop');
  var state = {};
  try { state = JSON.parse(localStorage.getItem(key) || '{}'); } catch (e) {}
  var boxes = [].slice.call(d.querySelectorAll('.card input[type=checkbox]'));
  var counter = d.querySelector('[data-count]');
  function save() { try { localStorage.setItem(key, JSON.stringify(state)); } catch (e) {} }
  function count() {
    var done = boxes.filter(function (b) { return b.checked; }).length;
    if (counter) counter.textContent = done + ' / ' + boxes.length + ' read';
  }
  boxes.forEach(function (b) {
    var id = b.closest('.card').dataset.id;
    if (state[id]) { b.checked = true; b.closest('.card').classList.add('read'); }
    b.addEventListener('change', function () {
      var card = b.closest('.card');
      d.querySelectorAll('.card[data-id="' + id + '"]').forEach(function (c) {
        c.classList.toggle('read', b.checked);
        var o = c.querySelector('input'); if (o) o.checked = b.checked;
      });
      if (b.checked) state[id] = 1; else delete state[id];
      save(); count();
    });
  });
  count();

  var modes = d.querySelectorAll('.seg button');
  function setMode(m) {
    body.classList.remove('f-worth', 'f-must');
    if (m !== 'all') body.classList.add('f-' + m);
    modes.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.mode === m ? 'true' : 'false'); });
    try { localStorage.setItem('brief:mode', m); } catch (e) {}
  }
  modes.forEach(function (b) { b.addEventListener('click', function () { setMode(b.dataset.mode); }); });
  var saved = 'all'; try { saved = localStorage.getItem('brief:mode') || 'all'; } catch (e) {}
  if (modes.length) setMode(saved);

  d.addEventListener('click', function (e) {
    var m = e.target.closest ? e.target.closest('.media[data-vid]') : null;
    if (!m || m.classList.contains('playing')) return;
    e.preventDefault();
    var f = d.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + m.dataset.vid + '?autoplay=1&rel=0';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.setAttribute('allowfullscreen', ''); f.title = 'Video player';
    m.innerHTML = ''; m.appendChild(f); m.classList.add('playing');
  });

  var tb = d.querySelector('[data-theme-toggle]');
  function paintTheme() { if (tb) tb.textContent = d.documentElement.dataset.theme === 'dark' ? 'Light mode' : 'Dark mode'; }
  if (tb) {
    paintTheme();
    tb.addEventListener('click', function () {
      var t = d.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      d.documentElement.dataset.theme = t;
      try { localStorage.setItem('brief:theme', t); } catch (e) {}
      paintTheme();
    });
  }

  var links = [].slice.call(d.querySelectorAll('.toc a'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          links.forEach(function (l) { l.classList.toggle('on', l.getAttribute('href') === '#' + e.target.id); });
          var on = d.querySelector('.toc a.on'); if (on && on.scrollIntoView) on.scrollIntoView({ block: 'nearest', inline: 'center' });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    d.querySelectorAll('section.sec').forEach(function (s) { io.observe(s); });
  }
  window.addEventListener('scroll', function () {
    var h = d.documentElement, p = h.scrollTop / ((h.scrollHeight - h.clientHeight) || 1);
    if (bar) bar.style.width = (p * 100) + '%';
    if (top) top.classList.toggle('show', h.scrollTop > 900);
  }, { passive: true });
  if (top) top.addEventListener('click', function () { window.scrollTo({ top: 0 }); });
})();
