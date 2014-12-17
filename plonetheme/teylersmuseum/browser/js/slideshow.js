/* ------------------------------------------------------------------------------
    S L I D E S H O W - E N H A N C E M E N T S
--------------------------------------------------------------------------------- */

/* Responsive storytelling enhancement */

_logger = {}
_logger.debug = true

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

slickSlideshow.resizeImages = function() {
	h = slickSlideshow.$obj.height();
	w = slickSlideshow.$obj.width();

	$slick = slickSlideshow.$obj.getSlick();
	currentSlide = slickSlideshow.$obj.slickCurrentSlide();

	$slides = $($slick.$slides);

	$slides.each(function(index) {	
		var $img = $($(this).find('img')[0]);
		
		$img.hide();
		$img.load(function() {
			var image_h = slickSlideshow.change_width($(this));
			if (image_h > h) {
				slickSlideshow.change_height($(this));
			}
			$img.show();
		});
	});
}

slickSlideshow.resizeImage = function() {
	var h = $(window).height();
	if (h - 280 > 0) {
		slickSlideshow.$obj.attr("style", "height:"+(h-280)+"px;");
	}
	
	h = slickSlideshow.$obj.height();
	w = slickSlideshow.$obj.width();

	$slick = slickSlideshow.$obj.getSlick();
	currentSlide = slickSlideshow.$obj.slickCurrentSlide();

	$slides = $($slick.$slides);

	$slides.each(function(index) {
		var $img = $($(this).find('img')[0]);
		var image_h = slickSlideshow.change_width($img);
		if (image_h > h) {
			slickSlideshow.change_height($img);
		}
	});
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
			slickSlideshow.$obj.slickAdd("<div data-title='"+slides[i].title+"' data-id='"+slides[i].object_id+"' data-description='"+slides[i].description+"' data-url='"+slides[i].url+"' data-body='"+slides[i].body+"'><img data-lazy='"+slides[i].image_url+"'/></div>", (index+i));
		} else if (slickSlideshow.view_type == "double_view") {
			slide_w_images = "<div data-title='"+slides[i].title+"' data-id='"+slides[i].object_id+"' data-description='"+slides[i].description+"' data-url='"+slides[i].url+"' data-body='"+slides[i].body+"'>";
			for (var j = 0; j < slides[i].images.length; j++) {
				slide_w_images += "<img data-lazy='"+slides[i].images[j]+"'/>";
			};
			slide_w_images += "</div>";
			slickSlideshow.$obj.slickAdd(slide_w_images, (index+i));
		}
	}
}

slickSlideshow.addNavigationSlides = function() {
	slides = slickSlideshow.slides;
	
	for (var i = 0; i < slides.length; i++) {
		if (slickSlideshow.double_view == false) {
			slickSlideshow.$obj.append("<div data-title='"+slides[i].title+"' data-id='"+slides[i].object_id+"' data-description='"+slides[i].description+"' data-url='"+slides[i].obj_url+"' data-body='"+slides[i].body+"'><img data-lazy='"+slides[i].url+"'/></div>");
		} else if (slickSlideshow.view_type == "double_view") {
			slickSlideshow.$obj.addClass('double-view');
			slide_w_images = "<div data-title='"+slides[i].title+"' data-id='"+slides[i].object_id+"' data-description='"+slides[i].description+"' data-url='"+slides[i].obj_url+"' data-body='"+slides[i].body+"'>";
			for (var j = 0; j < slides[i].images.length; j++) {
				slide_w_images += "<img data-lazy='"+slides[i].images[j]+"'/>";
			};
			slide_w_images += "</div>";
			slickSlideshow.$obj.append(slide_w_images);
		} else if (slickSlideshow.view_type == "multiple_view") {
			slickSlideshow.$obj.addClass('multiple-view');
			slide_w_images = "<div class='inner-slideshow' data-title='"+slides[i].title+"' data-id='"+slides[i].object_id+"' data-description='"+slides[i].description+"' data-url='"+slides[i].obj_url+"' data-body='"+slides[i].body+"'>";
			for (var j = 0; j < slides[i].images.length; j++) {
				slide_w_images += "<div><img data-lazy='"+slides[i].images[j]+"'/></div>";
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
			
			double_view = data.has_list_images;
			slickSlideshow.double_view = double_view;

			total_collection = data.total;
			slickSlideshow.total = total_collection;
			slickSlideshow.view_type = data.view_type;

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

				if (double_view) {
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
			$("#slideshow-controls #slide-count").html((currentSlide+1) + "/" + $slides.length);
			$("#slideshow-controls #slide-description").html(title + ", " + description);
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
		nextArrow: "<button type='button' class='slick-next'></button>",
		prevArrow: "<button type='button' class='slick-prev'></button>"
	});

	if (slickSlideshow.view_type == "multiple_view") {
		var $currSlide = $(slickSlideshow.$obj.getSlick().$slides[0]);
		$currSlide.slickPlay();
	}

	var h = $(window).height();
	slickSlideshow.$obj.attr("style", "height:"+(h-280)+"px;");
	slickSlideshow.resizeImages();

	$("#slideshow-controls").show();

	$(window).resize(function() {
		slickSlideshow.resizeImage();
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
	slickSlideshow.double_view = false;
	slickSlideshow.multiple_view = false;
	slickSlideshow.view_type = "regular";
}

slickSlideshow.init = function() {
	var query = location.search;
	if (query != "" || query == "") {
		_logger.log("==== INIT Loading feature ====");
		slickSlideshow.$obj = $($('.slick-slideshow')[0]);
		slickSlideshow.$contentListingObj = $($('.slick-slideshow a')[0]);
		slickSlideshow.$contentListingObj.remove();
		slickSlideshow.$container = $($(".slideshowContent")[0]);
		slickSlideshow.getDetails();
		slickSlideshow.setLoadingProperties();
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
	slickSlideshow.$obj.html('');
	slickSlideshow.$obj.unslick();
	object_id = slickSlideshow.slides[item].object_id;
	slickSlideshow.slides.length = 0;
	slickSlideshow.slides = [];
	slickSlideshow.setLoadingProperties();
	slickSlideshow.reseted = true;
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

	for (key in schema) {
		html += "<div class='col-lg-5 col-md-5 col-sm-5 col-xs-12 object-label' style='padding-left:0px;'><span>"+key+"</span></div><div class='col-lg-7 col-md-7 col-sm-7 col-xs-12 object-value'><p>"+schema[key]+"</p></div>";
	}
	
	var no_lt = html.replace(/&lt;/g, "<");
	var res = no_lt.replace(/&gt;/g, ">");
	
	$(".object-fieldset").html(res);
}

slickSlideshow.beforeChange = function(event) {
	if (slickSlideshow.view_type == "multiple_view") {
		currentSlide = event.currentSlide;
		var $currSlider = $(event.$slides[currentSlide]);
		$currSlider.slickPause();
	}
}

slickSlideshow.afterChange = function(event) {

	currentSlide = slickSlideshow.$obj.slickCurrentSlide();
	if (currentSlide < slickSlideshow.lastItem) {
		slickSlideshow.forward = false;
		slickSlideshow.lastItem = currentSlide;
	} else {
		slickSlideshow.forward = true;
		slickSlideshow.lastItem = currentSlide;
	}

	var reset = slickSlideshow.updateSlideshowLoading(currentSlide);

	var $slides = slickSlideshow.$obj.getSlick().$slides;

	if (reset == false && slickSlideshow.regular == false) {
		// --- Update object details
		$currentSlideObj = $($slides[currentSlide]);

		var push_url = $currentSlideObj.attr('data-url') + slickSlideshow.query;
		
		history.pushState(null, null, push_url);
		var description = $currentSlideObj.attr('data-description');
		var title = $currentSlideObj.attr('data-title');
		var body = $currentSlideObj.attr('data-body');

		var document_title = document.title.split('—');
		document_title[0] = title;

		document.title = document_title.join('—');
		var jsBody = $($.parseHTML(body));
		var htmlBody = $.parseHTML(jsBody.text());

		$("#content h1.documentFirstHeading").html(title);
		$("#content div.documentDescription.description").html(description);
		$("#body-text").html(htmlBody);

		var schema = slickSlideshow.slides[currentSlide].schema;
		slickSlideshow.updateSchema(schema);

		$("#slideshow-controls #slide-count").html((currentSlide+1) + "/" + $slides.length);
		$("#slideshow-controls #slide-description").html(title + ", " + description);

		if (slickSlideshow.view_type == "multiple_view") {
			$currentSlideObj.slickPlay();
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

