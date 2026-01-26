const init_menu_mobile = () => {
	const megaMenuLinks = document.querySelectorAll('.menu-mobile__link--has-children');
	if (megaMenuLinks)
		for (const link of megaMenuLinks)
			link.addEventListener('click', e => {
				e.preventDefault();
				const parent = link.parentNode;
				parent.classList.add('active');
			});
	const megaMenuBackButtons = document.querySelectorAll('.button--back');
	if (megaMenuBackButtons)
		for (const button of megaMenuBackButtons)
			button.addEventListener('click', e => {
				e.preventDefault();
				if (megaMenuLinks) for (const link of megaMenuLinks) link.parentNode.classList.remove('active');
			});
	// const megaMenuChildTitles = document.querySelectorAll('.menu-child__title');
	// if (megaMenuChildTitles)
	// 	for (const title of megaMenuChildTitles)
	// 		title.addEventListener('click', e => {
	// 			e.preventDefault();
	// 			title.parentNode.classList.toggle('open');
	// 		});
};
document.addEventListener('DOMContentLoaded', init_menu_mobile);
