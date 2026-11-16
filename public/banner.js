(() => {
  const KEY = 'optional-advertising-consent-v1';
  const slots = [...document.querySelectorAll('[data-optional-banner]')];
  let choice;
  try { choice = localStorage.getItem(KEY); } catch (_) {}
  const render = () => slots.forEach(slot => {
    const frame = slot.querySelector('iframe');
    if (slot.adObserver) slot.adObserver.disconnect();
    slot.querySelector('[data-ad-choice]').hidden = choice === 'accepted';
    slot.querySelector('[data-ad-settings]').hidden = choice !== 'accepted';
    slot.querySelector('[data-ad-frame]').hidden = choice !== 'accepted';
    if (choice !== 'accepted') frame.removeAttribute('src');
    else {
      const observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting) && choice === 'accepted') {
          frame.src = frame.dataset.src;
          observer.disconnect();
        }
      }, { rootMargin: '150px' });
      slot.adObserver = observer;
      observer.observe(frame);
    }
  });
  slots.forEach(slot => {
    slot.querySelector('[data-ad-accept]').onclick = () => {
      choice = 'accepted';
      try { localStorage.setItem(KEY, choice); } catch (_) {}
      render();
    };
    slot.querySelector('[data-ad-reject]').onclick = () => {
      choice = 'declined';
      try { localStorage.setItem(KEY, choice); } catch (_) {}
      render();
    };
    slot.querySelector('[data-ad-settings]').onclick = () => {
      choice = null;
      try { localStorage.removeItem(KEY); } catch (_) {}
      render();
    };
  });
  render();
})();
