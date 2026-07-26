/* ========================================
   Nauta System Design — Interactivity
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  /* ------------------------------------------
     Scroll-spy — highlight active sidebar link
     ------------------------------------------ */
  const navLinks = document.querySelectorAll('#sidebar nav a');
  const sections = document.querySelectorAll('section[id]');

  const spyOptions = {
    root: null,
    rootMargin: '-18% 0px -72% 0px',
    threshold: 0,
  };

  const scrollSpy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${id}`
          );
        });
      }
    });
  }, spyOptions);

  sections.forEach((s) => scrollSpy.observe(s));

  /* ------------------------------------------
     Fade-in on scroll
     ------------------------------------------ */
  const fadeEls = document.querySelectorAll('.fade-in');
  const fadeObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          fadeObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0, rootMargin: '50px 0px 0px 0px' }
  );
  fadeEls.forEach((el) => fadeObs.observe(el));

  // Reveal initial target if page loaded with URL hash
  if (window.location.hash) {
    const initialId = window.location.hash.slice(1);
    const initialTarget = document.getElementById(initialId);
    if (initialTarget) {
      const section = initialTarget.closest('.fade-in') || initialTarget;
      if (section.classList.contains('fade-in')) {
        section.classList.add('visible');
      }
    }
  }

  /* ------------------------------------------
     Mobile menu toggle
     ------------------------------------------ */
  const menuBtn = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  function closeMenu() {
    sidebar.classList.remove('open');
    overlay.classList.remove('visible');
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('visible');
    });
  }
  if (overlay) overlay.addEventListener('click', closeMenu);

  /* ------------------------------------------
     Smooth scroll for sidebar links
     ------------------------------------------ */
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        const section = target.closest('.fade-in') || target;
        if (section.classList.contains('fade-in')) {
          section.classList.add('visible');
        }
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, null, `#${id}`);
      }
      if (window.innerWidth <= 768) closeMenu();
    });
  });

  /* ------------------------------------------
     Pipeline stage click → scroll to stage card
     ------------------------------------------ */
  const pipelineStages = document.querySelectorAll('.pipeline-stage[data-target]');
  const stageCards = document.querySelectorAll('.stage-card');

  pipelineStages.forEach((stage) => {
    stage.addEventListener('click', () => {
      const targetId = stage.getAttribute('data-target');
      const targetCard = document.getElementById(targetId);

      if (targetCard) {
        // Remove active from all pipeline stages, add to clicked
        pipelineStages.forEach((s) => s.classList.remove('active'));
        stage.classList.add('active');

        // Remove active highlight from all stage cards, add to target
        stageCards.forEach((c) => c.classList.remove('stage-active'));
        targetCard.classList.add('stage-active');

        // Ensure the parent section is visible (fade-in)
        const parentSection = targetCard.closest('.fade-in');
        if (parentSection && !parentSection.classList.contains('visible')) {
          parentSection.classList.add('visible');
        }

        // Smooth scroll to the stage card
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ------------------------------------------
     Stage card scroll-spy — highlight pipeline
     stage as user scrolls through stage cards
     ------------------------------------------ */
  const stageSpyOptions = {
    root: null,
    rootMargin: '-25% 0px -65% 0px',
    threshold: 0,
  };

  const stageScrollSpy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const cardId = entry.target.id;
        pipelineStages.forEach((stage) => {
          const isMatch = stage.getAttribute('data-target') === cardId;
          stage.classList.toggle('active', isMatch);
        });

        // Also highlight the card
        stageCards.forEach((c) => c.classList.remove('stage-active'));
        entry.target.classList.add('stage-active');
      }
    });
  }, stageSpyOptions);

  stageCards.forEach((card) => stageScrollSpy.observe(card));
});
