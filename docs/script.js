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

  /* ------------------------------------------
     Mermaid Diagram Interactive Popup & Navigation
     ------------------------------------------ */
  const diagramContainers = document.querySelectorAll('.diagram-container');
  const modal = document.getElementById('diagram-modal');
  const modalOverlay = document.getElementById('diagram-modal-overlay');
  const modalCloseBtn = document.getElementById('modal-close');
  const modalTitle = document.getElementById('diagram-modal-title');
  const modalViewport = document.getElementById('diagram-modal-viewport');
  const modalSvgWrapper = document.getElementById('diagram-modal-svg-wrapper');
  const modalZoomInBtn = document.getElementById('modal-zoom-in');
  const modalZoomOutBtn = document.getElementById('modal-zoom-out');
  const modalZoomResetBtn = document.getElementById('modal-zoom-reset');
  const modalZoomLevelText = document.getElementById('modal-zoom-level');

  let scale = 1;
  let initialFitScale = 1;
  let translateX = 0;
  let translateY = 0;
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let initialTx = 0;
  let initialTy = 0;

  function updateTransform() {
    if (!modalSvgWrapper) return;
    modalSvgWrapper.style.transform = `translate(calc(-50% + ${translateX}px), calc(-50% + ${translateY}px)) scale(${scale})`;
    if (modalZoomLevelText) modalZoomLevelText.textContent = `${Math.round(scale * 100)}%`;
  }

  function resetView() {
    scale = initialFitScale;
    translateX = 0;
    translateY = 0;
    updateTransform();
  }

  function setScale(newScale, clientX, clientY) {
    const minScale = 0.2;
    const maxScale = 5;
    const clampedScale = Math.min(Math.max(newScale, minScale), maxScale);
    if (clampedScale === scale) return;

    if (clientX !== undefined && clientY !== undefined && modalViewport) {
      const rect = modalViewport.getBoundingClientRect();
      const mouseX = clientX - (rect.left + rect.width / 2);
      const mouseY = clientY - (rect.top + rect.height / 2);

      const ratio = clampedScale / scale;
      translateX = mouseX - (mouseX - translateX) * ratio;
      translateY = mouseY - (mouseY - translateY) * ratio;
    }

    scale = clampedScale;
    updateTransform();
  }

  function openModal(container) {
    if (!modal || !modalSvgWrapper) return;

    const svgEl = container.querySelector('svg');
    if (!svgEl) return;

    // Get title label from diagram container if available
    const labelEl = container.querySelector('.diagram-label');
    if (modalTitle) {
      modalTitle.textContent = labelEl ? labelEl.textContent.trim() : 'Interactive Diagram View';
    }

    // Determine intrinsic SVG dimensions from viewBox or bounding rect
    let vbWidth = 800;
    let vbHeight = 600;

    const viewBoxAttr = svgEl.getAttribute('viewBox');
    if (viewBoxAttr) {
      const parts = viewBoxAttr.trim().split(/[\s,]+/);
      if (parts.length === 4) {
        vbWidth = parseFloat(parts[2]) || 800;
        vbHeight = parseFloat(parts[3]) || 600;
      }
    } else {
      const rect = svgEl.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        vbWidth = rect.width;
        vbHeight = rect.height;
      }
    }

    // Clear previous SVG and clone current
    modalSvgWrapper.innerHTML = '';
    const clonedSvg = svgEl.cloneNode(true);

    // Apply explicit dimensions to SVG so flex/absolute wrapper doesn't collapse it to 0
    clonedSvg.setAttribute('width', vbWidth);
    clonedSvg.setAttribute('height', vbHeight);
    clonedSvg.style.width = vbWidth + 'px';
    clonedSvg.style.height = vbHeight + 'px';
    clonedSvg.style.maxWidth = 'none';
    clonedSvg.style.maxHeight = 'none';
    clonedSvg.style.display = 'block';

    modalSvgWrapper.appendChild(clonedSvg);

    // Make modal active to measure viewport
    modal.classList.add('is-active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    // Calculate auto-fit scale for the modal viewport
    let fitScale = 1;
    if (modalViewport) {
      const vpWidth = modalViewport.clientWidth || window.innerWidth * 0.9;
      const vpHeight = modalViewport.clientHeight || window.innerHeight * 0.8;
      const padding = 60;
      const scaleX = (vpWidth - padding) / vbWidth;
      const scaleY = (vpHeight - padding) / vbHeight;
      fitScale = Math.min(scaleX, scaleY);
      // Bound initial fit scale reasonably
      fitScale = Math.min(Math.max(fitScale, 0.4), 2.0);
    }

    initialFitScale = fitScale;
    scale = fitScale;
    translateX = 0;
    translateY = 0;
    updateTransform();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (modalSvgWrapper) modalSvgWrapper.innerHTML = '';
  }

  diagramContainers.forEach((container) => {
    container.addEventListener('click', () => {
      openModal(container);
    });
  });

  if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

  if (modalZoomInBtn) {
    modalZoomInBtn.addEventListener('click', () => setScale(scale * 1.25));
  }
  if (modalZoomOutBtn) {
    modalZoomOutBtn.addEventListener('click', () => setScale(scale / 1.25));
  }
  if (modalZoomResetBtn) {
    modalZoomResetBtn.addEventListener('click', resetView);
  }

  // Mouse Wheel Zooming
  if (modalViewport) {
    modalViewport.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
      setScale(scale * zoomFactor, e.clientX, e.clientY);
    }, { passive: false });

    // Drag Panning - Mouse Events
    modalViewport.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return; // Left click only
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      initialTx = translateX;
      initialTy = translateY;
      modalViewport.classList.add('is-dragging');
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      translateX = initialTx + dx;
      translateY = initialTy + dy;
      updateTransform();
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        modalViewport.classList.remove('is-dragging');
      }
    });

    // Touch Panning & Pinch Support
    let touchStartDist = 0;
    let initialScaleOnTouch = 1;

    modalViewport.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        initialTx = translateX;
        initialTy = translateY;
      } else if (e.touches.length === 2) {
        isDragging = false;
        touchStartDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        initialScaleOnTouch = scale;
      }
    }, { passive: true });

    modalViewport.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches.length === 1) {
        const dx = e.touches[0].clientX - startX;
        const dy = e.touches[0].clientY - startY;
        translateX = initialTx + dx;
        translateY = initialTy + dy;
        updateTransform();
      } else if (e.touches.length === 2 && touchStartDist > 0) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const centerTouchX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const centerTouchY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        setScale(initialScaleOnTouch * (dist / touchStartDist), centerTouchX, centerTouchY);
      }
    }, { passive: true });

    modalViewport.addEventListener('touchend', () => {
      isDragging = false;
      touchStartDist = 0;
    });
  }

  // Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (!modal || !modal.classList.contains('is-active')) return;

    if (e.key === 'Escape') {
      closeModal();
    } else if (e.key === '+' || e.key === '=') {
      setScale(scale * 1.25);
    } else if (e.key === '-' || e.key === '_') {
      setScale(scale / 1.25);
    } else if (e.key === 'r' || e.key === 'R' || e.key === '0') {
      resetView();
    } else if (e.key === 'ArrowLeft') {
      translateX += 40;
      updateTransform();
    } else if (e.key === 'ArrowRight') {
      translateX -= 40;
      updateTransform();
    } else if (e.key === 'ArrowUp') {
      translateY += 40;
      updateTransform();
    } else if (e.key === 'ArrowDown') {
      translateY -= 40;
      updateTransform();
    }
  });
});
