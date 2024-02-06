var $ = jQuery.noConflict();
jQuery(function() {
	isElementExist(".menu-drop", initSmartMenu);
	isElementExist(".header", initHeaderOffset);
	isElementExist(".header", initScrollClass);
	jcfInit();
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
		} catch(e) {
			console.log(e);
		}
	}
}

// initialize custom form elements (checkbox, radio, select) https://github.com/w3co/jcf
function jcfInit() {
	var customSelect = jQuery('select');
	var customCheckbox = jQuery('input[type="checkbox"]');
	var customRadio = jQuery('input[type="radio"]');

	customSelect.each(function () {
		$(this).find('option').first().addClass("placeholder")
	})

	// all option see https://github.com/w3co/jcf
	jcf.setOptions('Select', {
		wrapNative: false,
		wrapNativeOnMobile: false,
		fakeDropInBody: false,
		maxVisibleItems: 6
	});

	jcf.setOptions('Checkbox', {});

	jcf.setOptions('Radio', {});

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
		adjustHeightOffset();
	}, 250);

	function adjustHeightOffset() {
		headerHeight = header.outerHeight();
		container.css("padding-top", headerHeight);
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
		var windowTop = $window.scrollTop();

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

//-------- -------- -------- --------
//-------- included js libs end
//-------- -------- -------- --------
