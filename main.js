(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById('year').textContent = new Date().getFullYear();

  // Close the mobile menu after choosing a link
  document.querySelectorAll('#navMenu .nav-link, #navMenu .btn').forEach(function (link) {
    link.addEventListener('click', function () {
      var menu = document.getElementById('navMenu');
      if (menu.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(menu).hide();
    });
  });

  /* ---------- Marquee: duplicate the list so the loop is seamless ---------- */
  var track = document.getElementById('marquee');
  if (track && !reduceMotion) {
    Array.prototype.slice.call(track.children).forEach(function (li) {
      track.appendChild(li.cloneNode(true));
    });
  }

  /* ---------- Monitor: turn it off and on again ---------- */
  var screen = document.getElementById('screen');
  var term = document.getElementById('term');
  var power = document.getElementById('power');
  var note = document.getElementById('monitorNote');

  var script = [
    '> check network', 'router online, bandwidth looks fine',
    '> check erp', 'all modules running',
    '> check cctv', 'cameras recording',
    '> check phones', 'extensions ringing',
    '> check printers', 'printing. yes, really.',
    '> status', 'all systems normal. have a good day.'
  ];

  var run = 0;      // token used to cancel an in-progress boot
  var timer = null;

  function addCursor(parent) {
    var c = document.createElement('span');
    c.className = 'term-cursor';
    c.setAttribute('aria-hidden', 'true');
    parent.appendChild(c);
    return c;
  }

  function boot() {
    var my = ++run;
    term.innerHTML = '';
    var cursor;

    if (reduceMotion) {
      script.forEach(function (s) {
        var d = document.createElement('div');
        d.className = 'term-line' + (s.charAt(0) === '>' ? ' cmd' : '');
        d.textContent = s;
        term.appendChild(d);
      });
      return;
    }

    var i = 0;
    function nextLine() {
      if (my !== run) return;
      if (i >= script.length) { cursor = cursor || addCursor(term.lastChild); return; }
      var s = script[i++];
      var d = document.createElement('div');
      d.className = 'term-line' + (s.charAt(0) === '>' ? ' cmd' : '');
      term.appendChild(d);
      if (cursor) cursor.remove();
      cursor = addCursor(d);
      var n = 0;
      (function type() {
        if (my !== run) return;
        if (n < s.length) {
          cursor.insertAdjacentText('beforebegin', s.charAt(n++));
          timer = setTimeout(type, s.charAt(0) === '>' ? 55 : 22);
        } else {
          timer = setTimeout(nextLine, s.charAt(0) === '>' ? 260 : 380);
        }
      })();
    }
    nextLine();
  }

  function setPower(on) {
    power.setAttribute('aria-pressed', String(on));
    power.setAttribute('aria-label', on ? 'Turn the screen off' : 'Turn the screen on');
    screen.classList.toggle('is-off', !on);
    if (on) {
      note.textContent = 'Back online. Told you it works.';
      setTimeout(boot, 450);
    } else {
      run++; clearTimeout(timer);
      note.textContent = 'Now turn it on again.';
    }
  }

  power.addEventListener('click', function () {
    setPower(power.getAttribute('aria-pressed') !== 'true');
  });
  setTimeout(boot, 500);

  /* ---------- Ticket form: build an email ---------- */
  var form = document.getElementById('ticketForm');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.elements.name.value.trim();
    var type = form.elements.type.value;
    var msg = form.elements.message.value.trim();
    var subject = 'Ticket: ' + type + ' (from ' + name + ')';
    var body = msg + '\n\n' + name;
    window.location.href = 'mailto:fahad_hossen@yahoo.com?subject=' +
      encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  });
})();
