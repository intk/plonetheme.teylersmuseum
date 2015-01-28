/* ------------------------------------------------------------------------------
    S L I D E S H O W - E N H A N C E M E N T S
--------------------------------------------------------------------------------- */

// Load YouTube Frame API
(function(){ //Closure, to not leak to the scope
  var s = document.createElement("script");
  s.src = "http://www.youtube.com/iframe_api"; /* Load iFrame API*/
  var before = document.getElementsByTagName("script")[0];
  before.parentNode.insertBefore(s, before);
})();

// Pinterest
(function(){ //Closure, to not leak to the scope
  var s = document.createElement("script");
  s.src = "//assets.pinterest.com/js/pinit.js"; /* Load Pinterest */
  var before = document.getElementsByTagName("script")[0];
  before.parentNode.insertBefore(s, before);
})();

// Twitter
!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');

function isElementInViewport (el) {
    //special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }

    var rect = el.getBoundingClientRect();

    return (
        Math.abs(rect.top) <= $(el).height()
    );
}


/* Slideshow specific */

slickSlideshow.players = {}
slickSlideshow.playing = false;

slickSlideshow.onPlayerStateChange = function(iframeID) {
	return function(event) {
		if (event.data == 1) {
			$("#slideshow-controls").fadeOut();
			$(".wrap-prev, .wrap-next").css("opacity", 0);
			slickSlideshow.playing = true;
			
			setTimeout(function() {
				$(".slick-active.video-slide img.overlay-image").hide();
				$(".slick-active.video-slide iframe").show();
			}, 750);

		} else if (event.data == 2) {
			$("#slideshow-controls").fadeIn();
			$(".wrap-prev, .wrap-next").css("opacity", 1);
			slickSlideshow.playing = false;
		}

		/* Video ended 
		 * Got to next slide */
		else if (event.data == 0) {
			slickSlideshow.$obj.slickNext();
		}
	}
}

slickSlideshow.createYTEvent = function(iframeID, first_slide) {
	return function(event) {
		var player = slickSlideshow.players[iframeID];
		if (first_slide.hasClass('video-slide')) {
			var slide_iframeID = $(first_slide.find('iframe')[0]).attr('id');
			if (slide_iframeID == iframeID) {
				slickSlideshow.startFirstVideo(first_slide);
			}
		}
	}
}

slickSlideshow.pauseCurrentSlide = function() {
	var curr = slickSlideshow.$obj.slickCurrentSlide();
	var $slide = $(slickSlideshow.$obj.getSlick().$slides[curr]);
	if ($slide.hasClass("video-slide")) {
		var frameID = $($slide.find('iframe')[0]).attr("id");
		// Pause video
		var slide_player = slickSlideshow.players[frameID];
		if (slide_player != undefined) {
			slide_player.pauseVideo();
		}
	}
}

slickSlideshow.YT_ready = function() {
	if (slickSlideshow.$obj.getSlick() != undefined) { 
		var $first_slide = $(slickSlideshow.$obj.getSlick().$slides[0]);

		$(".actions-div").hide();

		$(".video-slide:not(.slick-cloned) iframe").each(function() {
			var iframeID = this.id;
			slickSlideshow.players[iframeID] = new YT.Player(iframeID, {
				events: {
					"onReady": slickSlideshow.createYTEvent(iframeID, $first_slide),
					"onStateChange": slickSlideshow.onPlayerStateChange(iframeID)
				}
			});
		});
	}
}

function onYouTubePlayerAPIReady() {
	if (slickSlideshow.$obj != undefined) { 
    	slickSlideshow.YT_ready();
	}
}

/* Responsive storytelling enhancement */

var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

_logger = {}
_logger.debug = false;

_logger.log = function(text) {
	if (_logger.debug) {
		console.log(text);
	}
}

slickSlideshow.change_height = function(img) {
	img.attr("style", "height:100%; width: auto;");
	var w = img.width();
	return w;
}

slickSlideshow.change_width = function(img) {
	img.attr("style", "width:100%; height: auto;");
	var h = img.height();
	return h;
}

slickSlideshow.resizeSlide = function() {
	h = slickSlideshow.$obj.height();
	w = slickSlideshow.$obj.width();

	$slick = slickSlideshow.$obj.getSlick();
	$slides = $($slick.$slides);

	$slides.each(function(index) {	
		if (slickSlideshow.view_type == 'double_view' || slickSlideshow.view_type == 'multiple_view') {
			var $imgs = $($(this).find('img'));
			$imgs.each(function(index) {
				var $img = $(this);
				$img.load(function() {
					var image_h = slickSlideshow.change_width($(this));
					if (image_h > h) {
						slickSlideshow.change_height($(this));
					}
				});
			});
		} else {
			var $img = $($(this).find('img')[0]);
			$img.load(function() {
				var image_h = slickSlideshow.change_width($(this));
				if (image_h > h) {
					slickSlideshow.change_height($(this));
				}
			});
		}
	});

	$(".slick-cloned").each(function(index) {
		if (slickSlideshow.view_type == 'double_view' || slickSlideshow.view_type == 'multiple_view') {
			var $imgs = $($(this).find('img'));
			$imgs.each(function(index) {
				var $img = $(this);
				$img.load(function() {
					var image_h = slickSlideshow.change_width($(this));
					if (image_h > h) {
						slickSlideshow.change_height($(this));
					}
				});
			});
		} else {
			var $img = $($(this).find('img')[0]);
			$img.load(function() {
				var image_h = slickSlideshow.change_width($(this));
				if (image_h > h) {
					slickSlideshow.change_height($(this));
				}
			});
		}
	});
}

slickSlideshow.resizeImages = function() {
	h = slickSlideshow.$obj.height();
	w = slickSlideshow.$obj.width();

	$slick = slickSlideshow.$obj.getSlick();
	$slides = $($slick.$slides);

	$(".slick-cloned").each(function(index) {
		if (slickSlideshow.view_type == "double_view" || slickSlideshow.view_type == 'multiple_view') {
			var $imgs = $($(this).find('img'));
			$imgs.each(function(index_imgs) {
				var $img = $(this);
				$img.load(function() {
					var image_h = slickSlideshow.change_width($(this));
					if (image_h > h) {
						slickSlideshow.change_height($(this));
					}
				});
			});
		} else {
			var $img = $($(this).find('img')[0]);
			$img.hide();
			$img.load(function() {
				var image_h = slickSlideshow.change_width($(this));
				if (image_h > h) {
					slickSlideshow.change_height($(this));
				}
				$img.show();
			});
		}
	});

	$slides.each(function(index) {	
		if (slickSlideshow.view_type == "double_view" || slickSlideshow.view_type == 'multiple_view') {
			var $imgs = $($(this).find('img'));
			$imgs.each(function(index_imgs) {
				var $img = $(this);
				$img.load(function() {
					var image_h = slickSlideshow.change_width($(this));
					if (image_h > h) {
						slickSlideshow.change_height($(this));
					}
				});
			});
		} else {
			var $img = $($(this).find('img')[0]);
			
			$img.hide();
			$img.load(function() {
				var image_h = slickSlideshow.change_width($(this));
				if (image_h > h) {
					slickSlideshow.change_height($(this));
				}
				$img.show();
			});
		}
	});
}

slickSlideshow.resizeImage = function(current) {
	var gap = slickSlideshow.gap;

	if (slickSlideshow.isCollection) {
		var h = $(".slideshow").height();
	} else if (!slickSlideshow.regular){
		var h = $(window).height() - 2;
	} else if (slickSlideshow.regular) {
		var h = $(".slideshow").height();
	}

	if (h - gap > 0) {
		slickSlideshow.$obj.attr("style", "height:"+(h-gap)+"px;");
	}
	
	if (slickSlideshow.resize) {
		h = slickSlideshow.$obj.height();
		w = slickSlideshow.$obj.width();

		$slick = slickSlideshow.$obj.getSlick();
		currentSlide = $slick.currentSlide;

		$slides = $slick.$slides;
		var total = $slides.length;


		if (slickSlideshow.view_type != "double_view") {
			if (currentSlide > 0 && currentSlide < $slides.length-1) {
				if (current) {
					$slides = $slides.slice(currentSlide-1, currentSlide+1);
				} else {
					$slides = [$slides[currentSlide-1], $slides[currentSlide+1]];
				}
			} else if (currentSlide == 0 && total > 1) {
				if (current) {
					$slides = [$slides[total-1], $slides[currentSlide], $slides[currentSlide+1]];
				} else {
					$slides = [$slides[total-1], $slides[currentSlide+1]];
				}
			} else if (currentSlide == total-1) {
				if (current) {
					$slides = [$slides[total-2], $slides[0]];
				}
			}
		}

		$($slides).each(function(index) {
			if (slickSlideshow.view_type == "double_view" || slickSlideshow.view_type == "multiple_view") {
				var $imgs = $($(this).find('img'));
				$imgs.each(function(index) {
					var $img = $(this);
					var image_h = slickSlideshow.change_width($(this));
					if (image_h > h) {
						slickSlideshow.change_height($(this));
					}
				});
			} else {
				if (!$(this).hasClass('video-slide')) {
					var $img = $($(this).find('img')[0]);
					var image_h = slickSlideshow.change_width($img);
					if (image_h > h) {
						slickSlideshow.change_height($img);
					}
				}
			}
		});
	}
}

slickSlideshow.addSlideInIndex = function(slides, index) {
	_logger.log("Add new bulk on index: "+index);
	for (var i = 0; i < slides.length; i++) {
		item = slides[i];
		slide_item = {
			'url': item.image_url,
			'obj_url': item.url,
			'object_id': item.object_id,
			'title': item.title,
			'description': item.description,
			'body': item.body,
			'schema': item.schema
		}
		slickSlideshow.slides.splice((index+i+1), 0, slide_item);
		
		if (slickSlideshow.double_view == false) { 
			slickSlideshow.$obj.slickAdd("<div data-title='"+slides[i].title+"' data-id='"+slides[i].object_id+"' data-description='"+slides[i].description+"' data-url='"+slides[i].url+"' data-body='"+slides[i].body+"'><div class='inner-bg'><img data-lazy='"+slides[i].image_url+"'/></div></div>", (index+i));
		} else if (slickSlideshow.view_type == "double_view") {
			slide_w_images = "<div data-title='"+slides[i].title+"' data-id='"+slides[i].object_id+"' data-description='"+slides[i].description+"' data-url='"+slides[i].url+"' data-body='"+slides[i].body+"'><div class='inner-bg'>";
			for (var j = 0; j < slides[i].images.length; j++) {
				slide_w_images += "<div class='double-container'><img data-lazy='"+slides[i].images[j]+"'/></div>";
			};
			slide_w_images += "</div></div>";
			slickSlideshow.$obj.slickAdd(slide_w_images, (index+i));
		}
	}

	slickSlideshow.resizeSlide();
}

slickSlideshow.addNavigationSlides = function() {
	slides = slickSlideshow.slides;
	
	for (var i = 0; i < slides.length; i++) {
		if (slickSlideshow.double_view == false) {
			slickSlideshow.$obj.append("<div data-title='"+slides[i].title+"' data-id='"+slides[i].object_id+"' data-description='"+slides[i].description+"' data-url='"+slides[i].obj_url+"' data-body='"+slides[i].body+"'><div class='inner-bg'><img data-lazy='"+slides[i].url+"'/></div></div>");
		} else if (slickSlideshow.view_type == "double_view") {
			slickSlideshow.$obj.addClass('double-view');
			slide_w_images = "<div data-title='"+slides[i].title+"' data-id='"+slides[i].object_id+"' data-description='"+slides[i].description+"' data-url='"+slides[i].obj_url+"' data-body='"+slides[i].body+"'>";
			for (var j = 0; j < slides[i].images.length; j++) {
				slide_w_images += "<div class='double-container'><div class='inner-bg'><img data-lazy='"+slides[i].images[j]+"'/></div></div>";
			};
			slide_w_images += "</div>";
			slickSlideshow.$obj.append(slide_w_images);
		} else if (slickSlideshow.view_type == "multiple_view") {
			slickSlideshow.$obj.addClass('multiple-view');
			slide_w_images = "<div class='inner-slideshow' data-title='"+slides[i].title+"' data-id='"+slides[i].object_id+"' data-description='"+slides[i].description+"' data-url='"+slides[i].obj_url+"' data-body='"+slides[i].body+"'>";
			for (var j = 0; j < slides[i].images.length; j++) {
				slide_w_images += "<div><div class='inner-bg'><img data-lazy='"+slides[i].images[j]+"'/></div></div>";
			};
			slide_w_images += "</div>";
			slickSlideshow.$obj.append(slide_w_images);
		}
	}

	if (slickSlideshow.view_type == "multiple_view") {
		$(".inner-slideshow").each(function(data) {
			$(this).slick({
				accessibility: false,
				pauseOnHover: true,
				draggable: false,
				dots: false,
				infinite: true,
				speed: 0,
				autoplaySpeed: 500,
				slidesToShow: 1,
				arrows: false,
				lazyLoad: 'progressive',
				adaptiveHeight: true
			});
		});
	}
 }

slickSlideshow.getNavigationContent = function(query, object_id) {
	var request_url = "get_nav_objects";
	var URL;

	location_query_split = window.location.href.split('?');
	current_url = location_query_split[0];
	
	if (object_id != "") {
		location_url_split = current_url.split("/");
		location_url_split[location_url_split.length-1] = object_id;
		current_url = location_url_split.join('/');
	}

	// Set request URL
	URL = current_url + "/" + request_url + query;

	slickSlideshow.request_url = URL;
	slickSlideshow.query = query;
	
	$.getJSON(URL, function(data) {
		if (data != undefined) {
			
			object_to_go = data.object_idx;
			
			slickSlideshow.double_view = data.has_list_images;
			slickSlideshow.total = data.total;
			slickSlideshow.total_items = data.total_items;
			slickSlideshow.view_type = data.view_type;
			slickSlideshow.slideCount = data.index_obj;

			_logger.log(slickSlideshow.total_items);

			$.each(data.list, function(index, item) {
				slide_item = {
					'url': item.image_url,
					'obj_url': item.url,
					'object_id': item.object_id,
					'title': item.title,
					'description': item.description,
					'body': item.body,
					'schema': item.schema
				}

				if (slickSlideshow.double_view) {
					slide_item.images = item.images;
				}
				slickSlideshow.slides.push(slide_item);
			});
			
			slickSlideshow.addNavigationSlides();
			
			if (slickSlideshow.reseted) {
				var push_url = slickSlideshow.slides[0].obj_url + slickSlideshow.query;
				history.pushState(null, null, push_url);
			}

			slickSlideshow.initSlick(object_to_go);

			var $slides = slickSlideshow.$obj.getSlick().$slides;
			var currentSlide = 0;
			$currentSlideObj = $($slides[currentSlide]);
			var description = $currentSlideObj.attr('data-description');
			var title = $currentSlideObj.attr('data-title');
			
			if (title.length > 45) {
				title = title.substring(0, 44);
				title = title + "...";
			}

			var title_and_description = title + description;
			if (title_and_description.length > 85) {
				var offset = title_and_description.length - 85;
				title = title.substring(0, title.length-offset-1);
				title = title + "...";
			}

			$("#slideshow-controls #slide-count").html((slickSlideshow.slideCount) + "/" + slickSlideshow.total_items);
			$("#slideshow-controls #slide-description").html(title + ", " + description);
			$(".slideshowWrapper").addClass("slick-init");
		}
	});

}

slickSlideshow.updateFacebook = function(url) {
	$(".fb-like").attr("data-href", url);
	FB.XFBML.parse();
}

slickSlideshow.updateTwitter = function(url, document_title) {
	$(".twitter-row").html('');
	var structure = '<a href="https://twitter.com/share" class="twitter-share-button" data-url="'+url+'" data-text="'+document_title+'">Tweet</a>';
	$(".twitter-row").html(structure);
	$.getScript("http://platform.twitter.com/widgets.js");
}

slickSlideshow.updatePinterest = function(current) {
	// TODO
	var $slide = $(slickSlideshow.$obj.getSlick().$slides[current])
	var $img = $($slide.find('img')[0])

	var url = $img.attr('data-lazy');
	if (url == undefined) {
		var url = $img.attr('src');
	}
	var pinterest_href = $("#pinterest-btn").attr("href");
	var pinterest_url = pinterest_href + url;
	$("#pinterest-btn").attr("href", pinterest_url);
}

slickSlideshow.updateSocialButtons = function(current, document_title) {
	var browser_url = window.location.href;
	slickSlideshow.updatePinterest(current);
	slickSlideshow.updateFacebook(browser_url);
	slickSlideshow.updateTwitter(browser_url, document_title);
}

slickSlideshow.findHashSlide = function(location_hash)  {

	var hash = location_hash.split("#")[1]

	var slides = slickSlideshow.slides;
	for (var i = 0; i < slides.length; i++) {
		console.log(slides[i].relative_path)
		if (slides[i].relative_path == hash) {
			return i;
		}
	};

	return 0;
}

slickSlideshow.findHashCollectionSlide = function(location_hash) {
	/*var hash = location_hash.split("#")[1]
	
	var $slides = 

	for (var i = 0; i < $slides.length; i++) {
		console.log($slides[i].attr("data-url"))
		if ($slides[i].attr("data-url") == hash) {
			return i;
		}
	};*/

	return 0;
}

slickSlideshow.initSlick = function(object_idx) {
	
	if (slickSlideshow.regular) {

		var initialSlide = 0;

		if (window.location.hash != "") {
			initialSlide = slickSlideshow.findHashSlide(window.location.hash);
		}

		slickSlideshow.$obj.slick({
			accessibility: true,
			dots: false,
			infinite: true,
			speed: 500,
			slidesToShow: 1,
			initialSlide: initialSlide,
			adaptiveHeight: true,
			focusOnSelect: false,
			onAfterChange: slickSlideshow.afterChange,
			onBeforeChange: slickSlideshow.beforeChange,
			appendArrows: $(".slideshowWrapper"),
			nextArrow: "<div class='wrap-next'><button type='button' class='slick-next'></button></div>",
			prevArrow: "<div class='wrap-prev'><button type='button' class='slick-prev'></button></div>"
		});

		$(".slideshowWrapper").addClass("slick-init");
		//slickSlideshow.updateSocialButtons(0);

		slickSlideshow.resizeWindow();
		slickSlideshow.resizeImages();

		$(window).resize(function() {
			slickSlideshow.resizeWindow();
			slickSlideshow.resizeImage(true);
		});

	} else {
		slickSlideshow.$obj.slick({
			accessibility: true,
			dots: false,
			infinite: true,
			speed: 500,
			slidesToShow: 1,
			initialSlide: object_idx,
			lazyLoad: 'progressive',
			adaptiveHeight: true,
			focusOnSelect: false,
			onAfterChange: slickSlideshow.afterChange,
			onBeforeChange: slickSlideshow.beforeChange,
			appendArrows: $(".slideshowWrapper"),
			nextArrow: "<div class='wrap-next'><button type='button' class='slick-next'></button></div>",
			prevArrow: "<div class='wrap-prev'><button type='button' class='slick-prev'></button></div>"
		});

		if (slickSlideshow.view_type == "multiple_view") {
			$(".play-btn").removeClass('paused');
			$(".play-btn").addClass('playing');
			$(".actions-div .play-btn i").removeClass("fa-play");
	      	$(".actions-div .play-btn i").addClass("fa-pause");
		}

		var h = $(window).height() - 2;
		var gap = slickSlideshow.gap;

		slickSlideshow.$obj.attr("style", "height:"+(h-gap)+"px;");

		//slickSlideshow.updateSocialButtons(0);

		slickSlideshow.resizeImages();

		if (slickSlideshow.view_type == "multiple_view") {
			var $currSlide = $(slickSlideshow.$obj.getSlick().$slides[0]);
			setTimeout(function(){ $currSlide.slickPlay() }, 1000);
		}

		$("#slideshow-controls").show();

		$(window).resize(function() {
			slickSlideshow.resizeImage(true);
		});
	}
}


slickSlideshow.setLoadingProperties = function() {
	slickSlideshow.bulk = 30;
	slickSlideshow.lastItem = 0;
	slickSlideshow.forward = true;
	slickSlideshow.dangerous_entries = 1;
	slickSlideshow.dangerous_item = slickSlideshow.bulk;
	slickSlideshow.buffer = 5;
	slickSlideshow.total = false;
	slickSlideshow.reseted = false;
	slickSlideshow.regular = false;
	slickSlideshow.isCollection = false;
	slickSlideshow.double_view = false;
	slickSlideshow.multiple_view = false;
	slickSlideshow.view_type = "regular";
	slickSlideshow.total_items = 0;
	slickSlideshow.slideCount = 1;
	slickSlideshow.gap = 160;
	slickSlideshow.resize = true;
	slickSlideshow.moved = false;
	slickSlideshow.editingMode = false;
}

slickSlideshow.resizeWindow = function() {
	var w = $(window).width();
	var ratio = 16/9;
	var h = w / ratio;

	$("#slickslideshow").css("height", h+"px");
}

slickSlideshow.startVideoFromSlide = function(slide) {
	if (!slickSlideshow.editingMode) {
		var iframeID = $(slide.find('iframe')[0]).attr('id');
		var player = slickSlideshow.players[iframeID];
		if (player != undefined) {
			player.playVideo();
		}
	}
}

slickSlideshow.startFirstVideo = function(slide) {
	if (!slickSlideshow.editingMode) {
		var iframeID = $(slide.find('iframe')[0]).attr('id');
		var player = slickSlideshow.players[iframeID];
		
		if (player != undefined) {
			player.playVideo();
		}
	}
}

slickSlideshow.initCollection = function() {
	slickSlideshow.$obj = $($('.slick-slideshow')[0]);
	$("#slickslideshow").toggleClass("fullscreen");
	slickSlideshow.setLoadingProperties();
	
	/* Check editing mode */
	if ($("body").hasClass('userrole-authenticated')) {
		slickSlideshow.editingMode = true;
	}

	slickSlideshow.isCollection = true;

	/*var initialSlide = 0;

	if (window.location.hash != "") {
		initialSlide = slickSlideshow.findHashCollectionSlide(window.location.hash);
	}*/

	slickSlideshow.$obj.slick({
		accessibility: true,
		dots: false,
		infinite: true,
		slidesToShow: 1,
		initialSlide: 0,
		speed: 500,
		adaptiveHeight: true,
		focusOnSelect: false,
		onAfterChange: slickSlideshow.afterChange,
		onBeforeChange: slickSlideshow.beforeChange,
		appendArrows: $(".slideshowWrapper"),
		nextArrow: "<div class='wrap-next'><button type='button' class='slick-next'></button></div>",
		prevArrow: "<div class='wrap-prev'><button type='button' class='slick-prev'></button></div>"
	});

	$(".slideshowWrapper").addClass("slick-init");

	slickSlideshow.total_items = slickSlideshow.$obj.getSlick().$slides.length;
	$("#slideshow-controls #slide-count").html((slickSlideshow.slideCount) + "/" + slickSlideshow.total_items);
	$("#slideshow-controls #slide-description").html($(slickSlideshow.$obj.getSlick().$slides[0]).attr("data-description"));

	slickSlideshow.resizeWindow();
	slickSlideshow.resizeImages();

	$(window).resize(function() {
		slickSlideshow.resizeWindow();
		slickSlideshow.resizeImage(true);
	});

	$(window).scroll(function() {
		var isvisible = isElementInViewport($("#slickslideshow"));
		
		if (!isvisible) {
			if (slickSlideshow.playing) {
				slickSlideshow.pauseCurrentSlide();
			}
		}
	});

}

slickSlideshow.init = function() {
	var query = location.search;

	$slick_slideshow = $($('.slick-slideshow')[0]);

	/* Collection slideshow */
	if ($slick_slideshow != undefined) {
		if ($slick_slideshow.hasClass('collection')) {
			slickSlideshow.initCollection();
			return;
		}
	}

	/* Single content slideshow */
	if ($slick_slideshow.hasClass("regular")) {
		_logger.log("==== INIT Regular slideshow ====");
		slickSlideshow.$obj = $($('.slick-slideshow')[0]);
		slickSlideshow.$contentListingObj = $($('.slick-slideshow a')[0]);
		slickSlideshow.$contentListingObj.remove();
		slickSlideshow.getDetails();
		slickSlideshow.setLoadingProperties();

		/* Check editing mode */
		if ($("body").hasClass('userrole-authenticated')) {
			slickSlideshow.editingMode = true;
		}

		slickSlideshow.regular = true;
		slickSlideshow.double_view = false;
		slickSlideshow.getContentListing("regular");
		
		$("#slickslideshow").toggleClass("fullscreen");

		
		return;
	}

	/* Storytelling slideshow */
	if (query != "" || query == "") {
		_logger.log("==== INIT Loading feature ====");
		slickSlideshow.$obj = $($('.slick-slideshow')[0]);
		slickSlideshow.$contentListingObj = $($('.slick-slideshow a')[0]);
		slickSlideshow.$contentListingObj.remove();
		slickSlideshow.$container = $($(".slideshowContent")[0]);
		slickSlideshow.getDetails();
		slickSlideshow.setLoadingProperties();
		
		/* Check editing mode */
		if ($("body").hasClass('userrole-authenticated')) {
			slickSlideshow.editingMode = true;
		}

		var gap = 0;
	    var h = $(window).height() - 2;
	    slickSlideshow.gap = gap;  
	    $("#slickslideshow").toggleClass("fullscreen");
	    $("header").toggleClass("fullscreen");
	    slickSlideshow.resize = false;

	    slickSlideshow.$obj.attr("style", "height:"+(h-gap)+"px;");
		slickSlideshow.getContentListing("");
	}
}

slickSlideshow.addBulkElements = function(index) {
	var request_url = "get_next_objects";
	var URL;

	location_query_split = window.location.href.split('?');
	current_url = location_query_split[0];

	// Set request URL
	var add_object = slickSlideshow.slides[index];
	if (slickSlideshow.query != "") {
		URL = current_url + "/" + request_url + slickSlideshow.query + "&object_id="+add_object.object_id;
	} else {
		URL = current_url + "/" + request_url + "?object_id="+add_object.object_id;
	}
	_logger.log("[Slideshow bulk] Get next bulk for object_id: "+add_object.object_id)
	
	// Request
	$.getJSON(URL, function(data) {
		if (data.list != undefined) {
			slickSlideshow.total = data.total;
			slickSlideshow.addSlideInIndex(data.list, index);
		}
	});
}

slickSlideshow.resetSlideshow = function(item) {
	var slide_count = slickSlideshow.slideCount;
	slickSlideshow.$obj.html('');
	slickSlideshow.$obj.unslick();
	object_id = slickSlideshow.slides[item].object_id;
	slickSlideshow.slides.length = 0;
	slickSlideshow.slides = [];
	slickSlideshow.setLoadingProperties();
	slickSlideshow.reseted = true;
	slickSlideshow.slideCount = slide_count;
	slickSlideshow.getContentListing(object_id);
}

slickSlideshow.updateSlideshowLoading = function(current) {
	var reset = false;

	if (slickSlideshow.dangerous_item != undefined && slickSlideshow.total == false) {
		dangerous_zone_start = slickSlideshow.dangerous_item - slickSlideshow.buffer;
		dangerous_zone_end = slickSlideshow.dangerous_item + slickSlideshow.buffer;
		
		_logger.log("[Slideshow loading] Current slide: "+current);
		_logger.log("[Slideshow loading] Dangerous zone start: "+dangerous_zone_start);

		if (current >= dangerous_zone_start && current <= dangerous_zone_end) {
			if (slickSlideshow.forward) {
				slickSlideshow.addBulkElements(slickSlideshow.dangerous_item);
				slickSlideshow.dangerous_entries += 1;
				slickSlideshow.dangerous_item = slickSlideshow.bulk*slickSlideshow.dangerous_entries;
			} else {
				reset = true;
				slickSlideshow.reseted = true;
				slickSlideshow.resetSlideshow(dangerous_zone_end);
			}
		}
	}

	return reset;
}

slickSlideshow.updateSchema = function(schema) {
	_logger.log("[Update schema] try to update");
	$(".object-fieldset").html('');

	var html = ""

	for (var i = 0; i < schema.length; i++) {
		html += "<div class='col-lg-5 col-md-5 col-sm-5 col-xs-12 object-label' style='padding-left:0px;'><span>"+schema[i].title+"</span></div><div class='col-lg-7 col-md-7 col-sm-7 col-xs-12 object-value'><p>"+schema[i].value+"</p></div>";
	}
	
	var no_lt = html.replace(/&lt;/g, "<");
	var res = no_lt.replace(/&gt;/g, ">");
	
	$(".object-fieldset").html(res);
}


slickSlideshow.updateSchemaCollection = function(currentSlide) {
	var URL = "";
	var request_url = "get_fields";
	var $slide_object = $(slickSlideshow.$obj.getSlick().$slides[currentSlide]);
	var data_url = $slide_object.attr('data-url');

	URL = data_url + "/" + request_url;

	$.getJSON(URL, function(data) {
		if (data.schema != undefined) {
			slickSlideshow.updateSchema(data.schema);
		}
	});
}

slickSlideshow.beforeChange = function(event) {
	currentSlide = event.currentSlide;
	var $currSlider = $(event.$slides[currentSlide]);

	if (slickSlideshow.view_type == "multiple_view") {
		$(".play-btn").removeClass('playing');
		$(".play-btn").addClass('paused');
		$(".actions-div .play-btn i").removeClass("fa-pause");
      	$(".actions-div .play-btn i").addClass("fa-play");
		$currSlider.slickPause();
	}

	if ($currSlider.hasClass("video-slide")) {
		var frameID = $($currSlider.find('iframe')[0]).attr("id");
		// Pause video
		var slide_player = slickSlideshow.players[frameID];
		if (slide_player != undefined) {
			slide_player.pauseVideo();
		}
	}
}

slickSlideshow.updateDOMTitle = function(body, title) {
	/* Update title */

	var document_title = document.title.split('—');
	document_title[0] = title;

	document.title = document_title.join('—');
	var jsBody = $($.parseHTML(body));
	var htmlBody = $.parseHTML(jsBody.text());

	// Change title
	$("#content h1.documentFirstHeading").html(title);
	$("#body-text").html('');
	$("#body-text").html(htmlBody);
}

slickSlideshow.updateSlideDetails = function(curr, currentSlide, title, description) {
	var $currentSlideObj = currentSlide;

	$("#content div.documentDescription.description").html(description);

	// Set length of description
	if (title == undefined) {
		title = "";
	}

	if  (description == undefined) {
		description = "";
	}
	
	if (title.length > 45) {
		title = title.substring(0, 44);
		title = title + "...";
	}

	var title_and_description = title + description;
	if (title_and_description.length > 85) {
		var offset = title_and_description.length - 85;
		title = title.substring(0, title.length-offset-1);
		title = title + "...";
	}

	/* **** */
	// Update description bar
	/* **** */

	$("#slideshow-controls #slide-count").html((slickSlideshow.slideCount) + "/" + slickSlideshow.total_items);
	if (description != "") {
		if ($currentSlideObj.hasClass("video-slide")) {
			$("#slideshow-controls #slide-description").html(description);
		} else {
			$("#slideshow-controls #slide-description").html(title + ", " + description);
		}
	} else {
		if ($currentSlideObj.hasClass("video-slide")) {
			$("#slideshow-controls #slide-description").html('');
		} else {
			$("#slideshow-controls #slide-description").html(title);
		}
	}

	// Update schema of object
	if (slickSlideshow.isCollection != true) {
		var schema = slickSlideshow.slides[curr].schema;
		slickSlideshow.updateSchema(schema);
	} else {
		if (slickSlideshow.regular == false) {
			slickSlideshow.updateSchemaCollection(curr);
		}
	}

}

slickSlideshow.updateDOMProperties = function(curr, currentSlide, title, description, body) {
	slickSlideshow.updateDOMTitle(body, title);
	slickSlideshow.updateSlideDetails(curr, currentSlide, title, description);
}

slickSlideshow.contentAJAXrefresh = function(curr, currentObject) {
	var $currentSlideObj = currentObject;

	if (slickSlideshow.isCollection) {
		var description = $currentSlideObj.attr('data-description');
		var title = $currentSlideObj.attr('data-title');
		var body = $currentSlideObj.attr('data-body');
	} else {
		var push_url = $currentSlideObj.attr('data-url') + slickSlideshow.query;
		history.pushState(null, null, push_url);
		var description = $currentSlideObj.attr('data-description');
		var title = $currentSlideObj.attr('data-title');
		var body = $currentSlideObj.attr('data-body');
		slickSlideshow.updateSocialButtons(0, title);
	}

	slickSlideshow.updateDOMProperties(curr, $currentSlideObj, title, description, body);
	
	if ($currentSlideObj.hasClass('video-slide')) {
		slickSlideshow.startVideoFromSlide($currentSlideObj);
	}
}

slickSlideshow.updateSlideCount = function(currentSlide) {

	var $slides = slickSlideshow.$obj.getSlick().$slides;
	var on_site_total = $slides.length-1;

	if (currentSlide == on_site_total && slickSlideshow.lastItem == 0) {
		slickSlideshow.slideCount -= 1;
		slickSlideshow.forward = false;
		slickSlideshow.lastItem = currentSlide;
	} else if (currentSlide == 0 && slickSlideshow.lastItem == on_site_total) {
		slickSlideshow.slideCount += 1;
		slickSlideshow.forward = true;
		slickSlideshow.lastItem = currentSlide;
	} else if (currentSlide < slickSlideshow.lastItem) {
		slickSlideshow.slideCount -= 1;
		slickSlideshow.forward = false;
		slickSlideshow.lastItem = currentSlide;
	} else {
		slickSlideshow.slideCount += 1;
		slickSlideshow.forward = true;
		slickSlideshow.lastItem = currentSlide;
	}

	if (slickSlideshow.slideCount <= 0) {
		slickSlideshow.slideCount = slickSlideshow.total_items;
	} else if (slickSlideshow.slideCount >= slickSlideshow.total_items+1) {
		slickSlideshow.slideCount = 1;
	}
	
	if (slickSlideshow.forward) {
		slickSlideshow.moved = true;
		if (!isMobile.any() && $("#slickslideshow").hasClass("fullscreen")) {
			$(".wrap-next").css("opacity", 1);
			$("#portal-header-wrapper, #slideshow-controls, body.portaltype-portlet-page .documentDescription, body.template-content_view .documentDescription, body.template-content_view .documentFirstHeading").fadeOut();
			$(".wrap-prev").css("opacity", 0);
    	} else if (!isMobile.any() && !$("#slickslideshow").hasClass("fullscreen")) {
    		$("body.portaltype-portlet-page .documentDescription, body.template-content_view .documentDescription, body.template-content_view .documentFirstHeading").fadeOut();
    	}
	} else {
		slickSlideshow.moved = true;
		if (!isMobile.any() && $("#slickslideshow").hasClass("fullscreen")) {
			$(".wrap-prev").css("opacity", 1);
			$("#portal-header-wrapper, #slideshow-controls, body.portaltype-portlet-page .documentDescription, body.template-content_view .documentDescription, body.template-content_view .documentFirstHeading").fadeOut();
			$(".wrap-next").css("opacity", 0);
    	} else if (!isMobile.any() && !$("#slickslideshow").hasClass("fullscreen")) {
    		$("body.portaltype-portlet-page .documentDescription, body.template-content_view .documentDescription, body.template-content_view .documentFirstHeading").fadeOut();
    	}
	}
}

slickSlideshow.updateSlideURLFragment = function(slide) {
	if (!slickSlideshow.isCollection) {
		var url = slide.relative_path;
		window.location.hash = url;
	}
}

slickSlideshow.updateSlideCollectionURL = function(slide) {
	/*var url = slide.attr("data-url");
	var real_url = url.split('/NewTeylers/')[1];
	window.location.hash = '/'+real_url;*/
}

slickSlideshow.afterChange = function(event) {

	//slickSlideshow.resizeImage(false);
	
	var currentSlide = slickSlideshow.$obj.getSlick().currentSlide;
	var $slides = slickSlideshow.$obj.getSlick().$slides;

	if (currentSlide == slickSlideshow.lastItem) {
		return;
	}

	/* *********** */
	/* TO BE FIXED */
	/* *********** */
	//$(".video-slide img.overlay-image").hide();

	/* ****************** */
	/* Update slide count */
	/* ****************** */
	slickSlideshow.updateSlideCount(currentSlide);

	/* ******************************** */
	/* Update slideshow Loading feature */
	/* ******************************** */
	var reset = slickSlideshow.updateSlideshowLoading(currentSlide);

	/* ******************* */
	/* Regular slideshow   * 
	/* ******************* */
	if (slickSlideshow.regular) {
		var slide = slickSlideshow.slides[currentSlide];
		var description = slide.description;
		$("#slideshow-controls #slide-count").html((slickSlideshow.slideCount) + "/" + slickSlideshow.total_items);
		$("#slideshow-controls #slide-description").html(description);
		slickSlideshow.updateSlideURLFragment(slide);
	}

	/* ******************* */
	/* Special slideshow    * 
	/* ******************* */
	if (reset == false && slickSlideshow.regular == false) {

		// --- Update object details
		$currentSlideObj = $($slides[currentSlide]);

		if ($currentSlideObj.hasClass('video-slide')) {
			$(".actions-div").hide();
		} else {
			$(".actions-div").show();
		}

		slickSlideshow.contentAJAXrefresh(currentSlide, $currentSlideObj);

		// Multiple View
		if (slickSlideshow.view_type == "multiple_view") {
			$(".play-btn").removeClass('paused');
			$(".play-btn").addClass('playing');
			$(".actions-div .play-btn i").removeClass("fa-play");
      		$(".actions-div .play-btn i").addClass("fa-pause");
			setTimeout(function(){ $currentSlideObj.slickPlay() }, 1000);
		}
	} 
}

slickSlideshow.getContentListing = function(object_number) {
	var URL;	
	var query = location.search;
	

	if (object_number != "regular") {
		slickSlideshow.getNavigationContent(query, object_number);
	} else if (object_number == "regular") {
		_logger.log('[Content listing : regular]')
		var URL, querystring;
		if (slickSlideshow.url.indexOf("?") != -1) {
			querystring = slickSlideshow.url.slice(slickSlideshow.url.indexOf("?") + 1);
			slickSlideshow.url = slickSlideshow.url.slice(0, slickSlideshow.url.indexOf("?"));
		} else {
			querystring = "";
		}

		// Make it non-recursive
		slickSlideshow.recursive = false;
		querystring = "";

		if (slickSlideshow.recursive) {
			if (querystring == "") {
				URL = slickSlideshow.url + '/slideshowListing';
			} else {
				URL = slickSlideshow.url + '/slideshowListing' + '?' + querystring;
			}
		} else {
			if (querystring == "") {
				URL = slickSlideshow.url + '/slideshowListing?recursive=false';
			} else {
				URL = slickSlideshow.url + '/slideshowListing' + '?' + querystring + "&recursive=false";
			}
		}
		
		$.getJSON(URL, function(data) {
			var data_len = $(data).length;

			$.each(data, function(index, item) {
				if (index == data_len - 1) {
					slickSlideshow.getSlideDetails(item, true)
				} else {
					slickSlideshow.getSlideDetails(item, false)
				}
			});
		});
	}
}

slickSlideshow.getSlideDetails = function(item, last) {
	var URL = "";
	var embed = "";
	var isVideo = false;

	URL = item.url + '/get_slideshow_item';

	var slide_item = {
		'url': item.url,
		'UID': item.UID,
		'relative_path': item.relative_path
	}

	slickSlideshow.slides.push(slide_item);

	$.getJSON(URL, function(data) {
		if (data.media.type == "Youtube") {
			embed = slickSlideshow.getYoutubeEmbed(data.media);
			isVideo = true;
		} 

		slide_item.video = isVideo;
		slide_item.embed = embed;
		slide_item.description = data.description;

		if (last) {
			slickSlideshow.addSlides();res
		}
	});
}

slickSlideshow.addSlides = function() {
	for (var i = 0; i < slickSlideshow.slides.length; i++) {
		slickSlideshow.$obj.append("<div><div class='inner-bg'><img src='"+slickSlideshow.slides[i].url+"/@@images/image/large'/></div></div>");
	}

	slickSlideshow.initSlick();

	slickSlideshow.total_items = slickSlideshow.$obj.getSlick().$slides.length;
	$("#slideshow-controls #slide-count").html((slickSlideshow.slideCount) + "/" + slickSlideshow.total_items);
}
