'use strict';

/* ═══════════════════════════════════════════════════════════
   1. DONNÉES DES PLATS
═══════════════════════════════════════════════════════════ */
const plats = [
  {
    nom:    "Ablo + poisson",
    origine:"SUD BÉNIN",
    prix:   2000,
    cat:    "plats",
    badge:  "POPULAIRE",
    img:    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&auto=format&fit=crop",
    desc:   "Galettes de riz cuites à la vapeur, moelleuses et légèrement sucrées, servies avec du poisson frit et sauce pimentée.",
    ingredients: ["Farine de riz", "Poisson", "Piment", "Oignon", "Huile"]
  },
  {
    nom:    "Poisson braisé",
    origine:"MONO",
    prix:   3500,
    cat:    "plats",
    badge:  "CHEF",
    img:    "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop",
    desc:   "Poisson entier mariné aux épices locales et grillé au feu de bois, servi avec accompagnement.",
    ingredients: ["Poisson", "Épices", "Citron", "Ail", "Sel"]
  },
  {
    nom:    "Gboman (crincrin)",
    origine:"SUD BÉNIN",
    prix:   2500,
    cat:    "plats",
    badge:  null,
    img:    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop",
    desc:   "Sauce à base de feuilles de jute cuites avec poisson fumé et épices traditionnelles du Sud Bénin.",
    ingredients: ["Feuilles de jute", "Poisson fumé", "Piment", "Tomate", "Huile de palme"]
  },
  {
    nom:    "Dakouin",
    origine:"COUFFO",
    prix:   1800,
    cat:    "plats",
    badge:  "MAISON",
    img:    "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop",
    desc:   "Beignets de haricots croustillants, spécialité traditionnelle du Sud Bénin.",
    ingredients: ["Haricots", "Oignons", "Piment", "Sel", "Huile végétale"]
  },
  {
    nom:    "Atassi",
    origine:"SUD BÉNIN",
    prix:   1500,
    cat:    "plats",
    badge:  null,
    img:    "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=600&auto=format&fit=crop",
    desc:   "Mélange équilibré de riz et haricots, accompagné d'une friture tomate épicée.",
    ingredients: ["Riz", "Haricots", "Tomate", "Piment", "Huile"]
  },
  {
    nom:    "Akassa nature",
    origine:"MONO",
    prix:   1000,
    cat:    "entrées",
    badge:  null,
    img:    "https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&auto=format&fit=crop",
    desc:   "Pâte de maïs fermentée, douce et légèrement acidulée, base de nombreux plats du Sud Bénin.",
    ingredients: ["Maïs fermenté", "Eau", "Sel"]
  },
  {
    nom:    "Tchoukoutou",
    origine:"SUD BÉNIN",
    prix:   800,
    cat:    "boissons",
    badge:  "MAISON",
    img:    "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&auto=format&fit=crop",
    desc:   "Bière traditionnelle de mil brassée artisanalement selon les méthodes ancestrales.",
    ingredients: ["Mil", "Sorgho", "Eau"]
  },
  {
    nom:    "Sodabi artisanal",
    origine:"MONO",
    prix:   1200,
    cat:    "boissons",
    badge:  null,
    img:    "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=600&auto=format&fit=crop",
    desc:   "Eau-de-vie de palme distillée artisanalement, spiritueux traditionnel du Bénin.",
    ingredients: ["Vin de palme"]
  },
  {
    nom:    "Wagashi grillé",
    origine:"SUD BÉNIN",
    prix:   1500,
    cat:    "entrées",
    badge:  null,
    img:    "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&auto=format&fit=crop",
    desc:   "Fromage frais béninois grillé à la braise, légèrement fumé, servi chaud.",
    ingredients: ["Lait", "Sel", "Épices"]
  }
];


/* ═══════════════════════════════════════════════════════════
   2. PANIER
═══════════════════════════════════════════════════════════ */
let panier = {};

function getPanier() {
  return Object.entries(panier).map(([nom, qty]) => {
    const plat = plats.find(p => p.nom === nom);
    return { ...plat, qty };
  });
}

function totalPanier() {
  return Object.entries(panier).reduce((sum, [nom, qty]) => {
    const plat = plats.find(p => p.nom === nom);
    return sum + (plat ? plat.prix * qty : 0);
  }, 0);
}

function countPanier() {
  return Object.values(panier).reduce((s, q) => s + q, 0);
}

function ajouterAuPanier(nom) {
  panier[nom] = (panier[nom] || 0) + 1;
  mettreAJourPanier();
  fermerModal('modal-plat');
  ouvrirModal('modal-panier');
}

function modifierQty(nom, delta) {
  if (!panier[nom]) return;
  panier[nom] += delta;
  if (panier[nom] <= 0) delete panier[nom];
  mettreAJourPanier();
  renderPanier();
}

function mettreAJourPanier() {
  const count = countPanier();
  const btnFloat = document.getElementById('btn-panier');
  const badge    = document.getElementById('panier-count');

  if (btnFloat) {
    btnFloat.hidden = count === 0;
    btnFloat.setAttribute('aria-label', `Ouvrir le panier (${count} article${count > 1 ? 's' : ''})`);
  }
  if (badge) badge.textContent = count;

  renderPanier();
  mettreAJourLienWhatsApp();
}

function renderPanier() {
  const liste    = document.getElementById('panier-liste');
  const vide     = document.getElementById('panier-vide');
  const footer   = document.getElementById('panier-footer');
  const totalEl  = document.getElementById('panier-total');

  if (!liste) return;

  const items = getPanier();

  if (items.length === 0) {
    liste.innerHTML = '';
    if (vide)   vide.hidden   = false;
    if (footer) footer.style.display = 'none';
    return;
  }

  if (vide)   vide.hidden   = true;
  if (footer) footer.style.display = '';

  liste.innerHTML = items.map(item => `
    <div class="panier-item" data-nom="${item.nom}">
      <div class="panier-item-info">
        <p class="panier-item-nom">${item.nom}</p>
        <p class="panier-item-prix">${(item.prix * item.qty).toLocaleString('fr-FR')} FCFA</p>
      </div>
      <div class="panier-item-qty">
        <button class="qty-btn" onclick="modifierQty('${item.nom}', -1)" aria-label="Retirer un ${item.nom}">−</button>
        <span class="qty-val">${item.qty}</span>
        <button class="qty-btn" onclick="modifierQty('${item.nom}', 1)" aria-label="Ajouter un ${item.nom}">+</button>
      </div>
    </div>
  `).join('');

  if (totalEl) totalEl.textContent = totalPanier().toLocaleString('fr-FR') + ' FCFA';
}

function mettreAJourLienWhatsApp() {
  const btn = document.getElementById('btn-commander-whatsapp');
  if (!btn) return;

  const items = getPanier();
  if (items.length === 0) { btn.href = 'https://wa.me/22959055088'; return; }

  const lignes  = items.map(i => `• ${i.nom} x${i.qty} — ${(i.prix * i.qty).toLocaleString('fr-FR')} FCFA`).join('\n');
  const total   = totalPanier().toLocaleString('fr-FR');
  const message = `Bonjour Élécho 👋\nJe souhaite passer commande :\n\n${lignes}\n\n*Total : ${total} FCFA*\n\nMerci !`;

  btn.href = `https://wa.me/22959055088?text=${encodeURIComponent(message)}`;
}


/* ═══════════════════════════════════════════════════════════
   3. MODALS
═══════════════════════════════════════════════════════════ */
function ouvrirModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  const fermer = modal.querySelector('.modal-close');
  if (fermer) setTimeout(() => fermer.focus(), 50);
}

function fermerModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  if (!document.querySelector('.modal-overlay.open')) {
    document.body.style.overflow = '';
  }
}

function ouvrirModalPlat(plat) {
  document.getElementById('modal-plat-img').src        = plat.img;
  document.getElementById('modal-plat-img').alt        = plat.nom;
  document.getElementById('modal-plat-nom').textContent = plat.nom;
  document.getElementById('modal-plat-prix').textContent = plat.prix.toLocaleString('fr-FR') + ' F';
  document.getElementById('modal-plat-origine').textContent = plat.origine;
  document.getElementById('modal-plat-desc').textContent    = plat.desc || '';

  const ingrList = document.getElementById('modal-ingredients-list');
  ingrList.innerHTML = (plat.ingredients || [])
    .map(i => `<span class="ingredient-tag">${i}</span>`)
    .join('');

  const btnAjouter = document.getElementById('btn-ajouter-panier');
  btnAjouter.onclick = () => ajouterAuPanier(plat.nom);

  ouvrirModal('modal-plat');
}

function initialiserModals() {
  document.getElementById('modal-plat-close')?.addEventListener('click', () => fermerModal('modal-plat'));
  document.getElementById('modal-panier-close')?.addEventListener('click', () => fermerModal('modal-panier'));
  document.getElementById('btn-panier')?.addEventListener('click', () => ouvrirModal('modal-panier'));

  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', e => {
      if (e.target === modal) fermerModal(modal.id);
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(m => fermerModal(m.id));
    }
  });
}


/* ═══════════════════════════════════════════════════════════
   4. GÉNÉRATION GRILLE MENU
═══════════════════════════════════════════════════════════ */
function formatPrix(prix) {
  return prix.toLocaleString('fr-FR');
}

function creerCarteHTML(plat, index) {
  const badgeHTML = plat.badge
    ? `<span class="plat-badge" aria-label="Label : ${plat.badge}">${plat.badge}</span>`
    : '';

  return `
    <article
      class="plat-card reveal"
      role="listitem"
      data-cat="${plat.cat}"
      data-nom="${plat.nom}"
      style="animation-delay:${index * 0.07}s"
      tabindex="0"
      aria-label="Voir le détail de ${plat.nom}"
    >
      <div class="plat-img-wrap">
        <img
          class="plat-img"
          src="${plat.img}"
          alt="${plat.nom}, cuisine ${plat.origine}"
          loading="lazy"
          width="600"
          height="450"
        />
        ${badgeHTML}
      </div>
      <div class="plat-body">
        <div class="plat-header">
          <h3 class="plat-nom">${plat.nom}</h3>
          <span class="plat-prix" aria-label="${formatPrix(plat.prix)} francs CFA">
            ${formatPrix(plat.prix)}
          </span>
        </div>
        <p class="plat-origine">${plat.origine}</p>
      </div>
    </article>
  `;
}

function initialiserGrille() {
  const grille = document.getElementById('grille-plats');
  if (!grille) return;

  grille.innerHTML = plats.map((p, i) => creerCarteHTML(p, i)).join('');

  grille.addEventListener('click', e => {
    const card = e.target.closest('.plat-card');
    if (!card) return;
    const plat = plats.find(p => p.nom === card.dataset.nom);
    if (plat) ouvrirModalPlat(plat);
  });

  grille.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = e.target.closest('.plat-card');
      if (!card) return;
      e.preventDefault();
      const plat = plats.find(p => p.nom === card.dataset.nom);
      if (plat) ouvrirModalPlat(plat);
    }
  });
}


/* ═══════════════════════════════════════════════════════════
   5. FILTRES MENU
═══════════════════════════════════════════════════════════ */
let filtreActif = 'tous';
let rechercheActive = '';

function appliquerFiltres() {
  const grille   = document.getElementById('grille-plats');
  const noResult = document.getElementById('menuNoResult');
  if (!grille) return;

  const cartes = grille.querySelectorAll('.plat-card');
  let visible = 0;

  cartes.forEach((carte, i) => {
    const cat  = carte.dataset.cat;
    const nom  = carte.dataset.nom.toLowerCase();
    const okCat = filtreActif === 'tous' || cat === filtreActif;
    const okSearch = rechercheActive === '' || nom.includes(rechercheActive);

    if (okCat && okSearch) {
      carte.classList.remove('hidden');
      carte.style.animationDelay = `${i * 0.05}s`;
      void carte.offsetHeight;
      visible++;
    } else {
      carte.classList.add('hidden');
    }
  });

  if (noResult) noResult.hidden = visible > 0;
}

function initialiserFiltres() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filtreActif = btn.dataset.filter;
      filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      appliquerFiltres();
    });
  });
}


/* ═══════════════════════════════════════════════════════════
   6. RECHERCHE
═══════════════════════════════════════════════════════════ */
function initialiserRecherche() {
  const input = document.getElementById('searchInput');
  const clear = document.getElementById('searchClear');
  if (!input) return;

  input.addEventListener('input', () => {
    rechercheActive = input.value.trim().toLowerCase();
    if (clear) clear.hidden = rechercheActive === '';
    appliquerFiltres();
  });

  if (clear) {
    clear.addEventListener('click', () => {
      input.value = '';
      rechercheActive = '';
      clear.hidden = true;
      input.focus();
      appliquerFiltres();
    });
  }
}


/* ═══════════════════════════════════════════════════════════
   7. NAVBAR AU SCROLL
═══════════════════════════════════════════════════════════ */
function initialiserNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const toggle = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
}


/* ═══════════════════════════════════════════════════════════
   8. BURGER MENU MOBILE
═══════════════════════════════════════════════════════════ */
function initialiserBurger() {
  const toggle   = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (!toggle || !navLinks) return;

  const ouvrir  = () => { toggle.classList.add('open'); navLinks.classList.add('open'); toggle.setAttribute('aria-expanded','true'); toggle.setAttribute('aria-label','Fermer le menu'); document.body.style.overflow = 'hidden'; };
  const fermer  = () => { toggle.classList.remove('open'); navLinks.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); toggle.setAttribute('aria-label','Ouvrir le menu'); document.body.style.overflow = ''; };

  toggle.addEventListener('click', () => toggle.classList.contains('open') ? fermer() : ouvrir());

  document.addEventListener('click', e => {
    if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !toggle.contains(e.target)) fermer();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) { fermer(); toggle.focus(); }
  });

  document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', fermer));
}


/* ═══════════════════════════════════════════════════════════
   9. SMOOTH SCROLL
═══════════════════════════════════════════════════════════ */
function initialiserSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(lien => {
    lien.addEventListener('click', e => {
      const cible = document.querySelector(lien.getAttribute('href'));
      if (!cible) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 72;
      window.scrollTo({ top: cible.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
    });
  });
}


/* ═══════════════════════════════════════════════════════════
   10. INTERSECTION OBSERVER — révélation au scroll
═══════════════════════════════════════════════════════════ */
function initialiserReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }),
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  const observerTous = () => document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
  observerTous();

  const grille = document.getElementById('grille-plats');
  if (grille) new MutationObserver(observerTous).observe(grille, { childList: true });
}


/* ═══════════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initialiserGrille();
  initialiserFiltres();
  initialiserRecherche();
  initialiserModals();
  initialiserNavbarScroll();
  initialiserBurger();
  initialiserSmoothScroll();
  initialiserReveal();
  mettreAJourPanier();
});