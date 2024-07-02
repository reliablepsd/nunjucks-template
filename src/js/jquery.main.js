var $ = jQuery.noConflict();
jQuery(function () {
	isElementExist(".menu-drop", initSmartMenu);
	isElementExist(".header", initHeaderOffset);
	isElementExist(".header", initScrollClass);
	jcfInit();
});

jQuery(window).on("load", () => {
	initAOS();
});

//-------- -------- -------- --------
//-------- js custom start
//-------- -------- -------- --------

// Helper if element exist then call function
function isElementExist(_el, _cb) {
	var elem = document.querySelector(_el);

	if (document.body.contains(elem)) {
		try {
			_cb();
		} catch (e) {
			console.log(e);
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
		$(this).find('option').first().addClass("placeholder")
	})

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
		showTimeout: 0
	});

	// changed date attribute to a class (need to reverse last item menu)
	jQuery('.menu').children().last().addClass('menu-sm-reverse');

	jQuery("body").mobileNav({
		menuActiveClass: "menu-active",
		menuOpener: ".menu-opener",
		hideOnClickOutside: true,
		menuDrop: ".menu-drop"
	}), "ontouchstart" in document.documentElement || jQuery(window).on("resize orientationchange", function() {
		jQuery("body").removeClass("menu-active"), $.SmartMenus.hideAll();
	});
}

function initHeaderOffset() {
	let container = jQuery(".offset-header");
	let header = jQuery(".header");
	let adjustDebounced = debounce(function () {
		if(headerHeight != header.outerHeight()){
			adjustHeightOffset();
		}
	}, 250);

	let headerHeight;

	function adjustHeightOffset() {
		headerHeight = header.outerHeight();
		container.css("padding-top", headerHeight);
		document.documentElement.style.setProperty("--offset-header", `${headerHeight}px`);
	}

	adjustHeightOffset();

	jQuery(window).on("resize", adjustDebounced);
}

function initScrollClass() {
	var $window = jQuery(window);
	var lastScrollTop = 0;
	var $header = jQuery('.header');


	if ($window.scrollTop() <= 0) {
		$header.removeClass('_sticked');
	}

	$window.scroll(function () {
		let windowTop = $window.scrollTop();

		if (!jQuery('body').hasClass("nav-active")) {

			if (windowTop > 1) {
				$header.addClass('_sticked');
			} else {
				$header.removeClass('_sticked');
				$header.removeClass('_showed');
			}

			if ($header.hasClass('_sticked')) {
				if (windowTop < lastScrollTop) {
					$header.addClass('_showed');
				} else {
					$header.removeClass('_showed');
				}
			}

		}

		lastScrollTop = windowTop;

	});
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
