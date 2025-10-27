var $ = jQuery.noConflict();
jQuery(function () {
	isElementExist(".menu-drop", initSmartMenu);
	isElementExist(".header", initHeaderOffset);
	isElementExist(".header", initScrollClass);
	jcfInit();
	initAOS();
});

//-------- -------- -------- --------
//-------- js custom start
//-------- -------- -------- --------

// Helper if element exist then call function
function isElementExist(selector, callback, ...rest) {
	const elem = document.querySelector(selector);
	if (elem) {
		try {
			callback(...rest);
		} catch (e) {
			console.error(e);
		}
	}
}

function initAOS() {
	// Documentation here: https://github.com/michalsnik/aos/tree/v2
	const CONFIG = {
		easing: "ease-out-quart",
		offset: 0,
		duration: 600,
		once: true,
	};

	let delayCounter = 0;
	const DELAY_STEP = 400; // can be any number (milliseconds)

	const $aosBlocks = $("[data-aos]");

	if (!$aosBlocks) return;

	const inViewportBlocks = $aosBlocks.filter((_, el) => isElemVisible(el));

	if (inViewportBlocks.length) {
		// Apply sequenced animation delay for all blocks in viewport on load
		inViewportBlocks.each((_, el) => {
			const delayInSeconds = delayCounter ? delayCounter / 1000 : 0;

			$(el).css("transition-delay", `${delayInSeconds}s`);

			delayCounter += DELAY_STEP;
		});
	}

	AOS.init(CONFIG);

	function isElemVisible(el) {
		const { top, bottom } = el.getBoundingClientRect();
		const vHeight = window.innerHeight || document.documentElement.clientHeight;

		return (top > 0 || bottom > 0) && top < vHeight;
	}
}

// initialize custom form elements (checkbox, radio, select) https://github.com/w3co/jcf
function jcfInit() {
	var customSelect = jQuery("select");
	var customCheckbox = jQuery('input[type="checkbox"]');
	var customRadio = jQuery('input[type="radio"]');

	customSelect.each(function () {
		$(this).find("option").first().addClass("placeholder");
	});

	// all option see https://github.com/w3co/jcf
	jcf.setOptions("Select", {
		wrapNative: false,
		wrapNativeOnMobile: false,
		fakeDropInBody: false,
		maxVisibleItems: 6,
	});

	jcf.setOptions("Checkbox", {});

	jcf.setOptions("Radio", {});

	// init only after option
	jcf.replace(customSelect);
	jcf.replace(customCheckbox);
	jcf.replace(customRadio);
}

// smart menu init
function initSmartMenu() {
	jQuery(".menu").smartmenus({
		collapsibleBehavior: "accordion",
		hideTimeout: 0,
		showTimeout: 0,
	});

	// changed date attribute to a class (need to reverse last item menu)
	jQuery(".menu").children().last().addClass("menu-sm-reverse");

	jQuery("body").mobileNav({
		menuActiveClass: "menu-active",
		menuOpener: ".menu-opener",
		hideOnClickOutside: true,
		menuDrop: ".menu-drop",
	}),
		"ontouchstart" in document.documentElement ||
			jQuery(window).on("resize orientationchange", function () {
				jQuery("body").removeClass("menu-active"), $.SmartMenus.hideAll();
			});
}

function initHeaderOffset() {
	const container = document.querySelector(".offset-header");
	const header = document.querySelector(".header");
	if (!container || !header) return;

	let headerHeight;

	function adjustHeightOffset() {
		headerHeight = header.offsetHeight;
		container.style.paddingTop = `${headerHeight}px`;
		document.documentElement.style.setProperty(
			"--offset-header",
			`${headerHeight}px`
		);
	}

	const adjustDebounced = debounce(() => {
		if (headerHeight !== header.offsetHeight) {
			adjustHeightOffset();
		}
	}, 300);

	adjustHeightOffset();
	window.addEventListener("resize", adjustDebounced, { passive: true });
}

function initScrollClass() {
	const header = document.querySelector(".header");
	const stickedHeight = 200;

	if (!header) return;

	let lastScrollTop = 0;

	if (window.scrollY <= stickedHeight) {
		header.classList.remove("_sticked");
	}

	window.addEventListener(
		"scroll",
		() => {
			const scrollTop = window.scrollY;

			if (!document.body.classList.contains("nav-active")) {
				if (scrollTop > stickedHeight) {
					header.classList.add("_sticked");
				} else {
					header.classList.remove("_sticked", "_showed");
				}

				if (header.classList.contains("_sticked")) {
					if (scrollTop < lastScrollTop) {
						header.classList.add("_showed");
					} else {
						header.classList.remove("_showed");
					}
				}
			}

			lastScrollTop = scrollTop;
		},
		{ passive: true }
	);
}

//-------- -------- -------- --------
//-------- js custom end
//-------- -------- -------- --------

//-------- -------- -------- --------
//-------- included js libs start
//-------- -------- -------- --------

// custom helper function for debounce - how to work see https://codepen.io/Hyubert/pen/abZmXjm
//= vendors/debounce.js

// library smartmenus (if you dont have menu in the project - just remove)
//= vendors/smartmenus.js

// jcf library select, radio, checkbox modules
//= vendors/jcf.js

// aos library for animations on scroll
//= vendors/aos.min.js

//-------- -------- -------- --------
//-------- included js libs end
//-------- -------- -------- --------
