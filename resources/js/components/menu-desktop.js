const initDesktopMenu = () => {
  const menuDesktop = document.querySelector('.menu-desktop');
  if (!menuDesktop) return;

  const megaMenuLinks = menuDesktop.querySelectorAll('.has-children');
  const documentBody = document.body;
  const megaMenuPanel = document.querySelector('.mega-menu');

  let openTimeout = null;
  let closeTimeout = null;

  const openMega = (item) => {
    clearTimeout(closeTimeout);
    openTimeout = setTimeout(() => {
      megaMenuLinks.forEach(link => link.classList.remove('active'));
      item.classList.add('active');
      documentBody.classList.add('mega-open', 'scroll-lock');
    }, 150);
  };

  const closeMega = () => {
    clearTimeout(openTimeout);
    closeTimeout = setTimeout(() => {
      megaMenuLinks.forEach(link => link.classList.remove('active'));
      documentBody.classList.remove('mega-open', 'scroll-lock');
    }, 200);
  };

  const isHoveringAnyTrigger = () =>
    Array.from(megaMenuLinks).some(link =>
      link.matches(':hover')
    );

  const isHoveringPanel = () =>
    megaMenuPanel && megaMenuPanel.matches(':hover');

  megaMenuLinks.forEach(item => {
    item.addEventListener('mouseenter', () => {
      openMega(item);
    });

    item.addEventListener('mouseleave', () => {
      requestAnimationFrame(() => {
        if (!isHoveringAnyTrigger() && !isHoveringPanel()) {
          closeMega();
        }
      });
    });
  });

  if (megaMenuPanel) {
    megaMenuPanel.addEventListener('mouseenter', () => {
      clearTimeout(closeTimeout);
    });

    megaMenuPanel.addEventListener('mouseleave', () => {
      requestAnimationFrame(() => {
        if (!isHoveringAnyTrigger()) {
          closeMega();
        }
      });
    });
  }
};

document.addEventListener('DOMContentLoaded', initDesktopMenu);


const setMenuDisplayHeight = () => {
	let siteHeaderHeight = 0;
	const windowHeight = window.innerHeight;
	const siteHeaderGroup = Array.from(document.querySelectorAll('.shopify-section-group-header-group'));
	if (siteHeaderGroup) {
		siteHeaderGroup.forEach(section => {
			siteHeaderHeight += section.offsetHeight;
		})
	}
	const brandMenuHeight = windowHeight - siteHeaderHeight - 100 + 'px';
	const brandMenuDisplay = document.querySelector('.menu-desktop__mega--brands');
	if (brandMenuDisplay) brandMenuDisplay.style.maxHeight = brandMenuHeight;
	if (window.innerWidth <= 1024 && brandMenuDisplay) brandMenuDisplay.style.minHeight = brandMenuHeight;
};

document.addEventListener('DOMContentLoaded', setMenuDisplayHeight);
window.addEventListener('resize', setMenuDisplayHeight);