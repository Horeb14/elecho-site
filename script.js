'use strict';

/* 
   1. DONNÉES DES PLATS */
const plats = [
  {
    nom:    "Ablo + poisson",
    origine:"SUD BÉNIN",
    prix:   2000,
    cat:    "plats",
    badge:  "POPULAIRE",
    img:    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600"
  },
  {
    nom:    "Poisson braisé",
    origine:"MONO",
    prix:   3500,
    cat:    "plats",
    badge:  "CHEF",
    img:    "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600"
  },
  {
    nom:    "Gboman (crincrin)",
    origine:"SUD BÉNIN",
    prix:   2500,
    cat:    "plats",
    badge:  null,
    img:    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600"
  },
  {
    nom:    "Dakouin",
    origine:"COUFFO",
    prix:   1800,
    cat:    "plats",
    badge:  "MAISON",
    img:    "https://images.unsplash.com/photo-1547592180-85f173990554?w=600"
  },
  {
    nom:    "Atassi",
    origine:"SUD BÉNIN",
    prix:   1500,
    cat:    "plats",
    badge:  null,
    img:    "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=600"
  },
  {
    nom:    "Akassa nature",
    origine:"MONO",
    prix:   1000,
    cat:    "entrées",
    badge:  null,
    img:    "https://images.unsplash.com/photo-1574484284002-952d92456975?w=600"
  },
  {
    nom:    "Tchoukoutou",
    origine:"SUD BÉNIN",
    prix:   800,
    cat:    "boissons",
    badge:  "MAISON",
    img:    "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600"
  },
  {
    nom:    "Sodabi artisanal",
    origine:"MONO",
    prix:   1200,
    cat:    "boissons",
    badge:  null,
    img:    "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=600"
  },
  {
    nom:    "Wagashi grillé",
    origine:"SUD BÉNIN",
    prix:   1500,
    cat:    "entrées",
    badge:  null,
    img:    "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600"
  }
];


/* 
   2. GÉNÉRATION DE LA GRILLE MENU */

/**
 * Formate un prix en FCFA avec séparateur de milliers.
 * Ex : 2000 → "2 000"
 */
function formatPrix(prix) {
  return prix.toLocaleString('fr-FR');
}

/**
 * Construit le HTML d'une carte plat.
 * @param {Object} plat
 * @param {number} index – utilisé pour l'animation en cascade
 * @returns {string} HTML de la carte
 */
function creerCarteHTML(plat, index) {
  const badgeHTML = plat.badge
    ? `<span class="plat-badge" aria-label="Label : ${plat.badge}">${plat.badge}</span>`
    : '';

  return `
    <article
      class="plat-card reveal"
      role="listitem"
      data-cat="${plat.cat}"
      style="animation-delay: ${index * 0.07}s"
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

/**
 * Injecte toutes les cartes dans #grille-plats.
 */
function initialiserGrille() {
  const grille = document.getElementById('grille-plats');
  if (!grille) return;

  grille.innerHTML = plats
    .map((plat, i) => creerCarteHTML(plat, i))
    .join('');
}


/* 
   3. FILTRES MENU
 */

/**
 * Active le filtre cliqué et masque/affiche les cartes
 * correspondantes avec une animation fluide.
 */
function initialiserFiltres() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const grille     = document.getElementById('grille-plats');

  if (!filterBtns.length || !grille) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filtre = btn.dataset.filter;

      /* Mettre à jour l'état des boutons */
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      /* Filtrer les cartes */
      const cartes = grille.querySelectorAll('.plat-card');
      cartes.forEach((carte, i) => {
        const catCarte = carte.dataset.cat;
        const visible  = filtre === 'tous' || catCarte === filtre;

        if (visible) {
          carte.classList.remove('hidden');
          /* Ré-animer en cascade à l'apparition */
          carte.style.animationDelay = `${i * 0.06}s`;
          carte.style.animation = 'none';
          /* Force reflow pour relancer l'animation */
          void carte.offsetHeight;
          carte.style.animation = '';
        } else {
          carte.classList.add('hidden');
        }
      });
    });
  });
}


/*
   4. NAVBAR AU SCROLL */

/**
 * Ajoute la classe .scrolled à la navbar dès que
 * l'utilisateur scrolle de plus de 60px.
 */
function initialiserNavbarScroll() {
  const navbar    = document.getElementById('navbar');
  const THRESHOLD = 60;

  if (!navbar) return;

  const toggle = () => {
    navbar.classList.toggle('scrolled', window.scrollY > THRESHOLD);
  };

  /* État initial (si la page se charge déjà scrollée) */
  toggle();

  window.addEventListener('scroll', toggle, { passive: true });
}


/* 
   5. BURGER MENU MOBILE*/

/**
 * Gère l'ouverture/fermeture du tiroir de navigation mobile.
 * Bloque le scroll du body quand le menu est ouvert.
 */
function initialiserBurger() {
  const toggle   = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (!toggle || !navLinks) return;

  const ouvrirMenu = () => {
    toggle.classList.add('open');
    navLinks.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Fermer le menu');
    document.body.style.overflow = 'hidden';
  };

  const fermerMenu = () => {
    toggle.classList.remove('open');
    navLinks.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Ouvrir le menu');
    document.body.style.overflow = '';
  };

  toggle.addEventListener('click', () => {
    const estOuvert = toggle.classList.contains('open');
    estOuvert ? fermerMenu() : ouvrirMenu();
  });

  /* Fermer si clic en dehors du tiroir */
  document.addEventListener('click', (e) => {
    if (
      navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !toggle.contains(e.target)
    ) {
      fermerMenu();
    }
  });

  /* Fermer avec la touche Échap */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      fermerMenu();
      toggle.focus();
    }
  });

  /* Exposer fermerMenu pour les liens (voir section 6) */
  return fermerMenu;
}


/* 
   6. FERMETURE DU TIROIR AU CLIC SUR UN LIEN NAV */

/**
 * Ferme automatiquement le menu mobile quand
 * l'utilisateur clique sur un lien d'ancre.
 * @param {Function} fermerMenu
 */
function initialiserFermetureParLiens(fermerMenu) {
  if (typeof fermerMenu !== 'function') return;

  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(lien => {
    lien.addEventListener('click', fermerMenu);
  });
}


/* 
   7. SMOOTH SCROLL (polyfill natif + offset navbar)*/

/**
 * Gère le scroll vers les ancres en tenant compte
 * de la hauteur fixe de la navbar.
 */
function initialiserSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(lien => {
    lien.addEventListener('click', (e) => {
      const cible = document.querySelector(lien.getAttribute('href'));
      if (!cible) return;

      e.preventDefault();

      const navH   = parseInt(
        getComputedStyle(document.documentElement)
          .getPropertyValue('--nav-h'), 10
      ) || 72;

      const top = cible.getBoundingClientRect().top + window.scrollY - navH;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}


/* 
   8. INTERSECTION OBSERVER — révélation au scroll*/

/**
 * Observe les éléments .reveal et leur ajoute
 * la classe .visible quand ils entrent dans le viewport.
 */
function initialiserReveal() {
  /* Respect du paramètre système "prefers-reduced-motion" */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('visible');
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  /* Observer tous les éléments .reveal présents ou ajoutés */
  const observerTous = () => {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
      observer.observe(el);
    });
  };

  observerTous();

  /* MutationObserver pour observer les cartes injectées dynamiquement */
  const mutObs = new MutationObserver(observerTous);
  const grille = document.getElementById('grille-plats');
  if (grille) {
    mutObs.observe(grille, { childList: true });
  }
}


/* 
   INIT — point d'entrée unique */
document.addEventListener('DOMContentLoaded', () => {
  initialiserGrille();
  initialiserFiltres();
  initialiserNavbarScroll();

  const fermerMenu = initialiserBurger();
  initialiserFermetureParLiens(fermerMenu);

  initialiserSmoothScroll();
  initialiserReveal();
});