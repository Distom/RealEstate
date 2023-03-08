'use strict'

const swiper = new Swiper('.swiper', {
	// Optional parameters
	//direction: 'vertical',
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	}
});

addScrollInto();
window.onresize = function () {
	addScrollInto();
}

function addScrollInto() {
	let width = document.documentElement.clientWidth;
	let position = width < 1200 ? 'start' : 'center';

	let menuLinks = document.querySelectorAll('.menu__link');
	menuLinks.forEach(link => {
		link.onclick = function (event) {
			let href = this.getAttribute('href');
			if (!href || href == '#') return;

			let target = document.querySelector(href);
			if (!target) return;
			target.scrollIntoView({ behavior: 'smooth', block: position });
			event.preventDefault();
		}
	});
}


let tabsElem = document.querySelector('.tabs-deals-block');
let tabLinks = document.querySelectorAll('.tabs-deals-block__link');
let isSwitchingTabs = false;
let transitionTime = 300;

tabLinks.forEach(link => {
	link.onclick = switchTabs;
});

async function switchTabs(event) {
	event.preventDefault();
	let link = this;

	if (isSwitchingTabs) return;

	let prevSelectedLink = tabsElem.querySelector('.tabs-deals-block__link_selected');
	if (prevSelectedLink == link) return;

	isSwitchingTabs = true;
	prevSelectedLink.classList.remove('tabs-deals-block__link_selected');
	link.classList.add('tabs-deals-block__link_selected');

	await hideTab();
	await showTab();

	isSwitchingTabs = false;

	async function showTab() {
		let tabName = link.dataset.tabName;
		let selectedTab = tabsElem.querySelector(`.tabs-deals-block__illustrations[data-tab-body='${tabName}']`);

		selectedTab.style.opacity = 0;
		selectedTab.hidden = false;

		await render();
		selectedTab.style.transition = `opacity ${transitionTime / 1000}s`;
		await render();
		selectedTab.style.opacity = '';

		await render(transitionTime);
		selectedTab.style.transition = '';
	}

	async function hideTab() {
		let prevSelectedTab = tabsElem.querySelector('.tabs-deals-block__illustrations:not([hidden])');
		prevSelectedTab.style.transition = `opacity ${transitionTime / 1000}s`;
		prevSelectedTab.style.opacity = 0;

		await render(transitionTime);

		prevSelectedTab.hidden = true;
		prevSelectedTab.style.transition = '';
		prevSelectedTab.style.opacity = '';
	}
}

function render(time) {
	if (!time) return new Promise(resolve => requestAnimationFrame(resolve));
	return new Promise(resolve => setTimeout(() => resolve(), time));
}

