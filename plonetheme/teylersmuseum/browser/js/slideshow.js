/* ------------------------------------------------------------------------------
    S L I D E S H O W - E N H A N C E M E N T S
--------------------------------------------------------------------------------- */

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
	} else {
		var h = $(window).height();
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
				var $img = $($(this).find('img')[0]);
				var image_h = slickSlideshow.change_width($img);
				if (image_h > h) {
					slickSlideshow.change_height($img);
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

slickSlideshow.initSlick = function(object_idx) {
	
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

	var h = $(window).height();
	var gap = slickSlideshow.gap;

	slickSlideshow.$obj.attr("style", "height:"+(h-gap)+"px;");
	
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
}

slickSlideshow.initCollection = function() {
	slickSlideshow.$obj = $($('.slick-slideshow')[0]);
	$("#slickslideshow").toggleClass("fullscreen");
	slickSlideshow.setLoadingProperties();
	slickSlideshow.isCollection = true;

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

	slickSlideshow.total_items = slickSlideshow.$obj.getSlick().$slides.length;
	slickSlideshow.resizeImages();
	$(window).resize(function() {
		slickSlideshow.resizeImage(true);
	});
}

slickSlideshow.init = function() {
	var query = location.search;

	$slick_slideshow = $($('.slick-slideshow')[0]);

	if ($slick_slideshow != undefined) {
		if ($slick_slideshow.hasClass('collection')) {
			slickSlideshow.initCollection();
			return;
		}
	}

	if (query != "" || query == "") {
		_logger.log("==== INIT Loading feature ====");
		slickSlideshow.$obj = $($('.slick-slideshow')[0]);
		slickSlideshow.$contentListingObj = $($('.slick-slideshow a')[0]);
		slickSlideshow.$contentListingObj.remove();
		slickSlideshow.$container = $($(".slideshowContent")[0]);
		slickSlideshow.getDetails();
		slickSlideshow.setLoadingProperties();
		
		var gap = 0;
	    var h = $(window).height();

	    slickSlideshow.gap = gap;  
	    $("#slickslideshow").toggleClass("fullscreen");
	    $("header").toggleClass("fullscreen");
	    slickSlideshow.resize = false;
	    slickSlideshow.$obj.attr("style", "height:"+(h-gap)+"px;");

		slickSlideshow.getContentListing("");
	} else {
		/* Temporary. Needs to be deleted */
		_logger.log("==== INIT Regular slideshow ====");
		slickSlideshow.$obj = $($('.slick-slideshow')[0]);
		slickSlideshow.$contentListingObj = $($('.slick-slideshow a')[0]);
		slickSlideshow.$contentListingObj.remove();
		slickSlideshow.$container = $($(".slideshowContent")[0]);
		slickSlideshow.getDetails();
		slickSlideshow.regular = true;
		slickSlideshow.double_view = false;
		slickSlideshow.initSlick();
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

slickSlideshow.beforeChange = function(event) {
	if (slickSlideshow.view_type == "multiple_view") {
		currentSlide = event.currentSlide;
		var $currSlider = $(event.$slides[currentSlide]);
		$(".play-btn").removeClass('playing');
		$(".play-btn").addClass('paused');
		$(".actions-div .play-btn i").removeClass("fa-pause");
      	$(".actions-div .play-btn i").addClass("fa-play");
		$currSlider.slickPause();
	}
}

slickSlideshow.afterChange = function(event) {

	slickSlideshow.resizeImage(false);
	
	var currentSlide = slickSlideshow.$obj.getSlick().currentSlide;

	if (currentSlide == slickSlideshow.lastItem) {
		return;
	}

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
			$("#portal-header-wrapper, #slideshow-controls, body.portaltype-portlet-page .documentDescription").fadeOut();
			$(".wrap-prev").css("opacity", 0);
    	} else if (!isMobile.any() && !$("#slickslideshow").hasClass("fullscreen")) {
    		$("body.portaltype-portlet-page .documentDescription").fadeOut();
    	}
	} else {
		slickSlideshow.moved = true;
		if (!isMobile.any() && $("#slickslideshow").hasClass("fullscreen")) {
			$(".wrap-prev").css("opacity", 1);
			$("#portal-header-wrapper, #slideshow-controls, body.portaltype-portlet-page .documentDescription").fadeOut();
			$(".wrap-next").css("opacity", 0);
    	} else if (!isMobile.any() && !$("#slickslideshow").hasClass("fullscreen")) {
    		$("body.portaltype-portlet-page .documentDescription").fadeOut();
    	}
	}

	var reset = slickSlideshow.updateSlideshowLoading(currentSlide);

	if (reset == false && slickSlideshow.regular == false) {
		// --- Update object details
		$currentSlideObj = $($slides[currentSlide]);

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
		}

		var document_title = document.title.split('—');
		document_title[0] = title;

		document.title = document_title.join('—');
		var jsBody = $($.parseHTML(body));
		var htmlBody = $.parseHTML(jsBody.text());

		// Change title
		$("#content h1.documentFirstHeading").html(title);
		$("#content div.documentDescription.description").html(description);
			
		$("#body-text").html('');
		$("#body-text").html(htmlBody);

		// Update schema of object
		if (slickSlideshow.isCollection != true) {
			var schema = slickSlideshow.slides[currentSlide].schema;
			slickSlideshow.updateSchema(schema);
		}

		// Set length of description
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

		// Update description bar
		$("#slideshow-controls #slide-count").html((slickSlideshow.slideCount) + "/" + slickSlideshow.total_items);
		$("#slideshow-controls #slide-description").html(title + ", " + description);

		// Multiple View
		if (slickSlideshow.view_type == "multiple_view") {
			$(".play-btn").removeClass('paused');
			$(".play-btn").addClass('playing');
			$(".actions-div .play-btn i").removeClass("fa-play");
      		$(".actions-div .play-btn i").addClass("fa-pause");
			setTimeout(function(){ $currentSlideObj.slickPlay() }, 1000);
		}

	} else {
		// Do nothing
	}
	// --- //
}

slickSlideshow.getContentListing = function(object_number) {
	var URL;	
	var query = location.search;

	if (query != "" || query == "") {
		slickSlideshow.getNavigationContent(query, object_number);
	} else {
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

$(document).ready(function() {
	$("#get_more_info").click(function() {
		$(".container.object-container").toggle();
		$("#body-text").toggle();
	});

	var query = location.search;

	if (slickSlideshow.$obj != undefined && query == "") {
		if (slickSlideshow.regular) {
		    _logger.log("[Slideshow options] check for options.");
		    
		    location_query_split = window.location.href.split('?');
			current_url = location_query_split[0];

		    var new_link = current_url + "/get_slideshow_options";

		    $.getJSON(new_link, function(data) {
		      if (data != null) {
		        if (data.changes) {
		          if (data.type == "double") {
		          	slickSlideshow.$obj.slickSetOption('arrows', false, true);
		            slickSlideshow.$obj.slickSetOption('slidesToShow', data.slidesToShow, true);
		            slickSlideshow.$obj.addClass('coins');
		          } else if (data.type == "multiple") {
		            slickSlideshow.$obj.slickSetOption('autoplay', data.autoplay, true);
		            slickSlideshow.$obj.slickSetOption('autoplaySpeed', data.autoplaySpeed, true);
		          }
		        }
		      }
		    });
		}
  	}
});










































/*slickSlideshow = {}

slickSlideshow.slides = []
slickSlideshow.debug = true

slickSlideshow.log = function(text) {
	if (slickSlideshow.debug) {
		console.log(text);
	}
}

slickSlideshow.getDetails = function() {
	slickSlideshow.url = slickSlideshow.$contentListingObj.attr('href');
	slickSlideshow.recursive = !slickSlideshow.$contentListingObj.parent().hasClass('disableRecursive');
	if (slickSlideshow.$obj.hasClass("audio")) {
		slickSlideshow.isAudioSlideshow = true;
		slickSlideshow.audioduration = slickSlideshow.$obj.attr("data-audio-duration");
		$(".audio-control-interface").show();
	}
}

slickSlideshow.getYoutubeEmbed = function (media) {
  var embed = '<iframe width="100%" height="100%" src="'+media.url+'" class="embed-responsive-item" frameborder="0" allowfullscreen></iframe>';
  return embed;
}

slickSlideshow.addAudioPlayer = function() {
	slickSlideshow.$obj.audioSlideshow({
		slickSlideshow: slickSlideshow
	});
}

slickSlideshow.addSlides = function() {
	var partial_duration = slickSlideshow.audioduration / slickSlideshow.slides.length;
	for (var i = 0; i < slickSlideshow.slides.length; i++) {
		if (slickSlideshow.isAudioSlideshow) {
			if (slickSlideshow.slides[i].video) {
			} else {
				var slide_time = i * partial_duration;
				var data_thumbnail = slickSlideshow.slides[i].url + "/image_collection";
				slickSlideshow.$obj.slickAdd("<div><img src='"+slickSlideshow.slides[i].url+"' data-thumbnail='"+data_thumbnail+"' data-slide-time='"+slide_time+"'/></div>");
			}
		} else {
			if (slickSlideshow.slides[i].video) {
				slickSlideshow.$obj.slickAdd("<div>"+slickSlideshow.slides[i].embed+"</div>");
			} else {
				slickSlideshow.$obj.slickAdd("<div><img src='"+slickSlideshow.slides[i].url+"' data-slide-time='0'/></div>");
			}
		}
	};

	slickSlideshow.addAudioPlayer();
}

slickSlideshow.getSlideDetails = function(item, last) {
	var URL = "";
	var embed = "";
	var isVideo = false;

	URL = item.url + '/get_media_show_item';

	var slide_item = {
		'url': item.url,
		'UID': item.UID
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
			slickSlideshow.addSlides();
			slickSlideshow.$obj.slickGoTo(0);
		}
	});
}

slickSlideshow.getContentListing = function() {
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
			URL = slickSlideshow.url + '/mediaShowListing';
		} else {
			URL = slickSlideshow.url + '/mediaShowListing' + '?' + querystring;
		}
	} else {
		if (querystring == "") {
			URL = slickSlideshow.url + '/mediaShowListing?recursive=false';
		} else {
			URL = slickSlideshow.url + '/mediaShowListing' + '?' + querystring + "&recursive=false";
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

slickSlideshow.addDescription = function(slideNumber) {
	var slide = slickSlideshow.slides[slideNumber];
	var total = slickSlideshow.slides.length;
	var numberOfSlides = (slideNumber+1)+"/"+total;
	$(".slideshowDetails .slideshow-description").html("<p>"+slide.description+"</p>");
	$(".slideshowDetails .slideshow-slides").html("<p>"+numberOfSlides+"</p>");
}

slickSlideshow.afterChange = function(event) {
	var currentSlide = event.currentSlide;
	slickSlideshow.addDescription(currentSlide);
}

slickSlideshow.initSlick = function() {
	slickSlideshow.$obj.slick({
		accessibility: true,
		dots: false,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		adaptiveHeight: true,
		focusOnSelect: true,
		onAfterChange: slickSlideshow.afterChange,
		appendArrows: $(".slideshowWrapper"),
		nextArrow: "<button type='button' class='slick-next'><img src='++resource++plonetheme.bootstrapModern.css/arr-right.svg'/></button>",
		prevArrow: "<button type='button' class='slick-prev'><img src='++resource++plonetheme.bootstrapModern.css/arr-left.svg'/></button>"
	});
}

slickSlideshow.init = function() {
	slickSlideshow.log("==== INIT ====");
	slickSlideshow.$obj = $($('.slick-slideshow')[0]);
	slickSlideshow.$contentListingObj = $($('.slick-slideshow a')[0]);
	slickSlideshow.$contentListingObj.remove();
	slickSlideshow.$container = $($(".slideshowContent")[0]);
	slickSlideshow.getDetails();
	slickSlideshow.initSlick();
	slickSlideshow.getContentListing();
}

$(document).ready(function() {
	if ($('.slick-slideshow').length) {
		slickSlideshow.init();
	}
});
*/

