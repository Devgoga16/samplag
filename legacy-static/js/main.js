// Samplag S.A.C. · interacciones de la landing
(() => {
  const WA_NUMBER = '51994694597';
  const waLink = (text) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

  // Header con sombra al hacer scroll
  const header = document.getElementById('header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Menú móvil
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    burger.querySelector('use').setAttribute('href', open ? '#i-x' : '#i-menu');
  };
  burger.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  // Enlace activo según la sección visible
  const links = [...nav.querySelectorAll('a[href^="#"]:not(.btn)')];
  // Se observan todas las secciones para que ninguna quede marcada en bloques fuera del menú
  const sections = [...document.querySelectorAll('main section[id]')];
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${en.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => spy.observe(s));

  // Botones "Cotizar este servicio": preseleccionan el servicio y llevan al formulario
  const select = document.getElementById('servicio');
  document.querySelectorAll('[data-service]').forEach((btn) => {
    btn.addEventListener('click', () => {
      select.value = btn.dataset.service;
      document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => document.querySelector('#qform [name="nombre"]').focus({ preventScroll: true }), 600);
    });
  });

  // Formulario de cotización → WhatsApp con mensaje armado
  const form = document.getElementById('qform');
  const error = document.getElementById('qerror');
  const mail = document.getElementById('qmail');

  const buildMessage = (d) => 'Hola Samplag, quisiera solicitar una cotización.\n\n' + [
    `*Nombre:* ${d.nombre}`,
    d.empresa && `*Empresa:* ${d.empresa}`,
    `*Teléfono:* ${d.telefono}`,
    `*Distrito:* ${d.distrito}`,
    `*Servicio:* ${d.servicio}`,
    d.mensaje && `*Detalle:* ${d.mensaje}`,
  ].filter(Boolean).join('\n');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll('[required]').forEach((el) => {
      const bad = !el.value.trim();
      el.classList.toggle('is-invalid', bad);
      if (bad && ok) { el.focus(); ok = false; }
    });
    error.hidden = ok;
    if (!ok) return;
    const data = Object.fromEntries([...new FormData(form)].map(([k, v]) => [k, String(v).trim()]));
    window.open(waLink(buildMessage(data)), '_blank', 'noopener');
  });

  form.addEventListener('input', (e) => {
    if (e.target.classList.contains('is-invalid') && e.target.value.trim()) e.target.classList.remove('is-invalid');
    // Mantiene el mailto de respaldo con los datos que ya escribió el usuario
    const data = Object.fromEntries([...new FormData(form)].map(([k, v]) => [k, String(v).trim()]));
    const body = buildMessage(data).replace(/\*/g, '');
    mail.href = `mailto:ventas@samplag.com.pe?subject=${encodeURIComponent('Solicitud de cotización')}&body=${encodeURIComponent(body)}`;
  });

  // Grupos de botones con selección única (chips, segmentos, filtros, pestañas)
  const single = (buttons, onPick) => buttons.forEach((b) => b.addEventListener('click', () => {
    buttons.forEach((x) => {
      x.classList.toggle('is-active', x === b);
      x.setAttribute(x.getAttribute('role') === 'tab' ? 'aria-selected' : 'aria-checked', String(x === b));
    });
    onPick(b);
  }));

  // Tarjeta "¿Qué necesitas hoy?" del hero
  const quick = { service: 'Fumigación integral', client: 'empresa' };
  const quickGo = document.getElementById('quick-go');
  const updateQuick = () => {
    const who = quick.client === 'empresa' ? 'para mi empresa' : 'para mi hogar';
    quickGo.href = waLink(`Hola Samplag, quisiera una cotización de ${quick.service.toLowerCase()} ${who}.`);
  };
  single([...document.querySelectorAll('[data-quick]')], (b) => { quick.service = b.dataset.quick; updateQuick(); });
  single([...document.querySelectorAll('[data-client]')], (b) => { quick.client = b.dataset.client; updateQuick(); });
  updateQuick();

  // Filtro de servicios por categoría
  const cards = [...document.querySelectorAll('#services-grid .svc')];
  single([...document.querySelectorAll('[data-filter]')], (b) => {
    const f = b.dataset.filter;
    cards.forEach((c) => {
      const show = f === 'all' || c.dataset.cat === f;
      c.classList.toggle('is-hidden', !show);
      if (show) { c.classList.add('is-in'); c.style.transitionDelay = '0ms'; }
    });
  });

  // Selector "¿Qué plaga tienes?"
  const PESTS = {
    cucarachas: {
      tag: 'Insectos rastreros', title: 'Control de cucarachas', svc: 'Fumigación integral', risk: 3,
      desc: 'Se esconden en cocinas, desagües y grietas, y salen de noche. Contaminan alimentos y superficies, y se reproducen muy rápido.',
      signs: ['Las ves de noche al prender la luz', 'Excrementos como granitos negros en cajones', 'Olor desagradable en zonas cerradas'],
    },
    roedores: {
      tag: 'Roedores', title: 'Control de ratas y ratones', svc: 'Desratización', risk: 3,
      desc: 'Dañan mercadería, cables e instalaciones, y contaminan alimentos y superficies. Un programa de desratización con monitoreo evita que vuelvan.',
      signs: ['Excrementos alargados cerca de paredes', 'Bolsas, cajas o cables roídos', 'Ruidos en techos o falsos cielos rasos'],
    },
    voladores: {
      tag: 'Insectos voladores', title: 'Control de moscas y zancudos', svc: 'Fumigación integral', risk: 2,
      desc: 'Se concentran cerca de residuos, aguas estancadas y zonas de alimentos. Son molestos para clientes y trabajadores y pueden transmitir enfermedades.',
      signs: ['Presencia constante cerca de basura o alimentos', 'Agua acumulada en recipientes o canaletas', 'Larvas en sumideros o desagües'],
    },
    polillas: {
      tag: 'Insectos de almacén', title: 'Control de polillas', svc: 'Fumigación integral', risk: 1,
      desc: 'Atacan telas, alfombras, papeles y alimentos secos almacenados. El daño suele notarse cuando la infestación ya avanzó.',
      signs: ['Agujeros en ropa, cortinas o alfombras', 'Pequeños gusanos o capullos en esquinas', 'Polillas en despensas y almacenes'],
    },
    palomas: {
      tag: 'Aves', title: 'Control de palomas', svc: 'Control aviar', risk: 2,
      desc: 'Sus excrementos ensucian y deterioran techos, fachadas y equipos, y pueden afectar la higiene de tu local. El control aviar evita que se posen y aniden.',
      signs: ['Excrementos en cornisas, techos o ventanas', 'Nidos en canaletas o aires acondicionados', 'Aves posadas de forma permanente'],
    },
  };
  const panel = document.getElementById('pest-panel');
  const pestMain = panel.querySelector('.pest__main');
  const field = (k) => panel.querySelector(`[data-f="${k}"]`);
  const pestCta = document.getElementById('pest-cta');
  const riskLabel = ['', 'Riesgo bajo', 'Riesgo medio', 'Riesgo alto'];
  single([...document.querySelectorAll('[data-pest]')], (b) => {
    const p = PESTS[b.dataset.pest];
    field('tag').textContent = p.tag;
    field('title').textContent = p.title;
    field('desc').textContent = p.desc;
    field('signs').innerHTML = p.signs.map((s) => `<li>${s}</li>`).join('');
    field('svc').textContent = p.svc;
    field('risk').dataset.level = p.risk;
    field('risk').setAttribute('aria-label', riskLabel[p.risk]);
    pestCta.dataset.service = p.svc;
    pestMain.classList.remove('is-swapping');
    void pestMain.offsetWidth;
    pestMain.classList.add('is-swapping');
  });

  // Checklist sanitario
  const check = document.getElementById('check');
  const boxes = [...check.querySelectorAll('input[type="checkbox"]')];
  const bar = document.getElementById('check-bar');
  const msg = document.getElementById('check-msg');
  const checkGo = document.getElementById('check-go');
  const updateCheck = () => {
    const done = boxes.filter((b) => b.checked).length;
    const pending = boxes.filter((b) => !b.checked).map((b) => b.value);
    bar.style.width = `${(done / boxes.length) * 100}%`;
    bar.classList.toggle('is-ok', done === boxes.length);
    msg.innerHTML = done === boxes.length
      ? '<b>¡Todo al día!</b> Programa tu próximo mantenimiento con nosotros.'
      : `<b>${done} de ${boxes.length}</b> puntos al día. Te ayudamos con lo pendiente.`;
    checkGo.href = waLink(pending.length
      ? `Hola Samplag, revisé el checklist sanitario y necesito cotizar: ${pending.join(', ')}.`
      : 'Hola Samplag, quisiera programar el mantenimiento periódico de mi local.');
  };
  check.addEventListener('change', updateCheck);
  check.addEventListener('submit', (e) => e.preventDefault());
  updateCheck();

  // Aparición suave de bloques al hacer scroll
  const revealTargets = document.querySelectorAll('.svc, .sector, .step, .tip, .auth__card, .feats li, .faq details, .why__media, .biz__media, .sec-head, .rule, .pest, .check');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    revealTargets.forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${(i % 4) * 60}ms`;
      io.observe(el);
    });
  }

  document.getElementById('year').textContent = new Date().getFullYear();
})();
