const initDesktopMenu = () => {
	const menuDesktop = document.querySelector('.menu-desktop');
	const megaMenuLinks = menuDesktop.querySelectorAll('.has-children');
	const documentBody = document.querySelector('body');
	if (megaMenuLinks) {
		for (const item of megaMenuLinks) {
			item.addEventListener('mouseover', () => {
				window.mainHoverDelay = setTimeout(() => {
					let current_item = item;
					if (!item.classList.contains('active')) {
						for (let item of megaMenuLinks) item.classList.remove('active');
						item.classList.add('active');
						documentBody.classList.add('mega-open');
					}
					for (let item of megaMenuLinks) {
						if (item === current_item) continue;
					}
					clearTimeout(window.hoverDelay);
				}, 250);
			});
			item.addEventListener('mouseout', () => {
				clearTimeout(window.mainHoverDelay);
				clearTimeout(window.hoverDelay);
				window.hoverDelay = setTimeout(() => {
					item.classList.remove('active');
					documentBody.classList.remove('mega-open');
				}, 250);
			});
		}
		document.addEventListener('mouseleave', () => {
			clearTimeout(window.leaveDelay);
			window.leaveDelay = setTimeout(() => {
				for (let item of megaMenuLinks) item.classList.remove('active');
				documentBody.classList.remove('mega-open');
			}, 250);
		});
		document.addEventListener('mouseenter', () => {
			clearTimeout(window.leaveDelay);
		});
	}
};
document.addEventListener('DOMContentLoaded', initDesktopMenu);
