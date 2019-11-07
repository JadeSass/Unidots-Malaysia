(function($) {

	"use strict";

	var App = {

		win: $(window),
		ww: window.innerWidth,
		wh: window.innerHeight,
		r_click_protect: false,

		init: function() {
			//App.adjust_header();
			App.header();
			App.trigger();
			App.heros();
			App.gallery();
			App.disable_r_click();
			App.play_video();
			App.shortcodes();

			App.win.on('load', function() {
				$('body').waitForImages({
					finished: function() {
						setTimeout(function() {
							$('.fade').addClass('hide');
						}, 3000);
					},
					waitForAll: true
				});
			});

			App.win.on('resize', function() {
				App.ww = window.innerWidth;
				App.wh = window.innerHeight;

				//App.adjust_header();
				App.heros();

				$('.gallery_preview .frame').css('height', (App.wh - 160) + 'px');
				$('.gallery_preview img').css({
					'margin-top': ($('.gallery_preview .frame').height() - $('.gallery_preview img').height()) / 2
				});
			});
		},


		adjust_header: function() {
			if (App.ww > 1024) {
			var logo_top = ($('.header_logo').offset().top + $('.header_logo').height()) + 50,
					footer_top = $('.header_footer').offset().top - 50;

				$('.header_menu_wrapper').css('max-height', footer_top - logo_top);

				$('.mobile_nav').hide();
				$('.header_menu').show();
				$('.header_trigger').hide().removeClass('active');
				$('.site_content').removeClass('show_layer');
			} else {
				$('.header_menu').hide();
				$('.header_trigger').show();
			}

		},

		header: function() {
			$('.menu li:has(ul)').find('a:first').addClass('parent');
			$('.menu li:has(ul)').children('ul').hide();

			$('.menu li:has(ul)').find('a').off('click');
			$('.menu li:has(ul)').find('a').on('click', function() {
				var parent = $(this).parent(),
					submenu = $(this).next('ul');

				if (submenu.is(':visible'))
					parent.find('ul').slideUp(300);

				if (submenu.is(':hidden')) {
					parent.siblings().find('ul').slideUp(300);
					submenu.slideDown(300);
				}

				if (parent.children('ul').length == 0) return true;
				else return false;
			});
		},
		trigger: function() {
			$('.header_trigger').on('click', function() {
				$(this).toggleClass('active');
				$('.site_content').toggleClass('show_layer');
				$('.mobile_nav').html($('.header_menu').html());
				$('.mobile_nav').slideToggle(300);

				App.adjust_header();
				App.header();
			});
		},


		heros: function() {
			if (App.ww > 1024) {
				$('.hero').css('height', App.wh + 'px');
			} else {
				$('.hero').css('height', (App.wh - ($('.header').height())) + 'px');
			}
		},


		gallery: function() {
			$('.gallery_link').on('click', function(e) {
				var img = $(this).attr('href'),
					title = $(this).data('title'),
					current = $('.gallery_link').index($(this)),
					total = $('.gallery_link').length,
					frame_height = App.wh - 160;

				var meta = '<div class="meta">';
				meta += '<span class="title">' + title + '</span>';
				meta += '<div class="close"><span></span></div>';
				meta += '</div>';

				var frame = '<div class="frame" style="height:' + frame_height + 'px">';
				frame += '<img src="' + img + '">';
				frame += '</div>';

				var nav = '<div class="nav">';
				nav += '<div class="prev"><span></span></div>';
				nav += '<div class="next"><span></span></div>';
				nav += '</div>';

				$.magnificPopup.open({
					items: {
						src: '<div class="gallery_preview">' + meta + frame + nav + '</div>',
						type: 'inline'
					}
				});

				$('.gallery_preview img').css({
					'margin-top': ($('.gallery_preview .frame').height() - $('.gallery_preview img').height()) / 2
				});

				$('.gallery_preview .close').on('click', function() {
					$.magnificPopup.instance.close();
				});

				if (current == 0) {
					$('.gallery_preview .nav .prev').addClass('disabled');
				}

				if (current == total - 1) {
					$('.gallery_preview .nav .next').addClass('disabled');
				}

				$('.gallery_preview .nav .next').on('click', function() {
					if (current < total - 1) {
						current++;

						var i = $('.gallery_link').eq(current);
						img = i.attr('href');
						title = i.data('title');

						$('.gallery_preview .meta .title').text(title);
						$('.gallery_preview .frame img').attr('src', img);

						$('.gallery_preview img').css({
							'margin-top': ($('.gallery_preview .frame').height() - $('.gallery_preview img').height()) / 2
						});

						if (current == total - 1) {
							$(this).addClass('disabled');
						}

						if (!current == 0) {
							$('.gallery_preview .nav .prev').removeClass('disabled');
						}
					}
				});

				$('.gallery_preview .nav .prev').on('click', function() {
					if (current > 0) {
						current--;

						var i = $('.gallery_link').eq(current);
						img = i.attr('href');
						title = i.data('title');

						$('.gallery_preview .meta .title').text(title);
						$('.gallery_preview .frame img').attr('src', img);

						$('.gallery_preview img').css({
							'margin-top': ($('.gallery_preview .frame').height() - $('.gallery_preview img').height()) / 2
						});

						if (current == 0) {
							$(this).addClass('disabled');
						}

						if (current < total) {
							$('.gallery_preview .nav .next').removeClass('disabled');
						}
					}
				});

				e.preventDefault();
			});
		},


		disable_r_click: function() {
			if (App.r_click_protect == true) {
				$(document).ready(function() {
					$("body").on("contextmenu", function() {
						$('.drclick').addClass('visible').on('click', function() {
							$(this).removeClass('visible');
						});
						return false;
					});
				});
			}
		},


		play_video: function() {
			$('.video_content .play').on('click', function() {
				var source = $(this).data('video'),
					video = '',
					parent = $(this).parent();

				if (source.indexOf('.mp4') != -1) {
					video = '<div class="video"><video autoplay controls><source src="' + source + ' type="video/mp4"></video></div>';

					parent.append(video).queue(function(e) {
						$('.video_content .play').addClass('hide');
					});
				} else if (source.indexOf('youtube.com') != -1) {
					var code = source.substring(source.lastIndexOf('=') + 1),
						url = 'https://www.youtube.com/embed/' + code;

					video = '<iframe src="' + url + '?showinfo=0&controls=1&rel=0&autoplay=1" frameborder="0"></iframe>';

					parent.append(video).queue(function(e) {
						$('.video_content .play').addClass('hide');
					});
				} else if (source.indexOf('vimeo.com') != -1) {
					var code = source.substring(source.lastIndexOf('/') + 1),
						url = 'https://player.vimeo.com/video/' + code;

					video = '<iframe src="' + url + '?autoplay=1&byline=0&portrait=0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';

					parent.append(video).queue(function(e) {
						$('.video_content .play').addClass('hide');
					});
				}
			});
		},


		shortcodes: function() {
			// background images
			$('[data-bg]').each(function() {
				var bg = $(this).data('bg');

				$(this).css({
					'background-image': 'url(' + bg + ')',
					'background-size': 'cover',
					'background-position': 'center center',
					'background-repeat': 'no-repeat'
				});
			});

			$('[data-bg-color]').each(function() {
				var bg = $(this).data('bg-color');

				$(this).css('background-color', bg);
			});

			// owl slider
			$('.slider').each(function() {
				var slider = $(this),
					dots = slider.data('dots') == true ? 1 : 0,
					arrows = slider.data('arrows') == true ? 1 : 0,
					items = typeof(slider.data('items')) !== "undefined" ? parseInt(slider.data('items'), 10) : 1,
					margin = typeof(slider.data('margin')) !== "undefined" ? parseInt(slider.data('margin'), 10) : 0;

				slider.owlCarousel({
					autoplay: true,
					smartSpeed: 1500,
					animateOut: 'fadeOut',
					 animateIn: 'fadeIn',
					mouseDrag: false,
					items: items,
					loop: true,
					nav: arrows,
					dots: dots,
					margin: margin,
					navText: ['', '']
				});
			});

			$('.slider').on('translate.owl.carousel', function(event) {
    $(this).find(".item").fadeOut(800);
});

 $('.slider').on('translated.owl.carousel', function(event) {
$(this).find(".item").fadeIn(800);

});


		}

	}

	App.init();

})(jQuery);

AOS.init();

// You can also pass an optional settings object
// below listed default settings
AOS.init({
  // Global settings:
  disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
  startEvent: 'DOMContentLoaded', // name of the event dispatched on the document, that AOS should initialize on
  initClassName: 'aos-init', // class applied after initialization
  animatedClassName: 'aos-animate', // class applied on animation
  useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
  disableMutationObserver: false, // disables automatic mutations' detections (advanced)
  debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
  throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)


  // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
  offset: 120, // offset (in px) from the original trigger point
  delay: 0, // values from 0 to 3000, with step 50ms
  duration: 400, // values from 0 to 3000, with step 50ms
  easing: 'ease', // default easing for AOS animations
  once: false, // whether animation should happen only once - while scrolling down
  mirror: false, // whether elements should animate out while scrolling past them
  anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation

});
