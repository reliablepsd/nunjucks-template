var $ = jQuery.noConflict();
jQuery(function() {
	isElementExist(".nav-drop", initSmartMenu);
	initCustomForms();
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
function initCustomForms() {
	jcf.setOptions('Select', {
		maxVisibleItems: 5, // visible dropdown items before scroll appear
		wrapNative: false,
	});
	jcf.replaceAll();
}

// smart menu init
function initSmartMenu() {
	var distanceBetweenMenuAndNav = jQuery(".header-menu-wrapper").offset().top + jQuery(".header-menu-wrapper").innerHeight() - jQuery(".nav").offset().top - jQuery(".nav").innerHeight();
	jQuery(".header-menu").smartmenus({
		collapsibleBehavior: "accordion",
		mainMenuSubOffsetY: distanceBetweenMenuAndNav
	});

	// changed date attribute to a class (need to reverse last item menu)
	jQuery('.header-menu').children().last().addClass('nav-sm-reverse');

	jQuery("body").mobileNav({
		menuActiveClass: "nav-active",
		menuOpener: ".nav-opener",
		hideOnClickOutside: true,
		menuDrop: ".nav-drop"
	}), "ontouchstart" in document.documentElement ||
			jQuery(window).on("resize orientationchange", function() {
				jQuery("body").removeClass("nav-active"), $.SmartMenus.hideAll();
	});
}

//-------- -------- -------- --------
//-------- js custom end
//-------- -------- -------- --------

//-------- -------- -------- --------
//-------- included js libs start
//-------- -------- -------- --------

// custom helper function for debounce - how to work see https://codepen.io/Hyubert/pen/abZmXjm
// vendors/debounce.js

// library smartmenus (if you dont have menu in the project - just remove)
//= vendors/smartmenus.js

// jcf library select, radio, checkbox modules
//= vendors/jcf.js

//-------- -------- -------- --------
//-------- included js libs end
//-------- -------- -------- --------
