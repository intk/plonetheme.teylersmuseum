/* ------------------------------------------------------------------------------
    S L I D E S H O W - E N H A N C E M E N T S
--------------------------------------------------------------------------------- */

slickSlideshow.addSlideInIndex = function(slides, index) {
	console.log("Add new bulk on index: "+index);
	for (var i = 0; i < slides.length; i++) {
		item = slides[i];
		slide_item = {
			'url': item.image_url,
			'obj_url': item.url,
			'object_id': item.object_id,
			'title': item.title,
			'description': item.description,
			'body': item.body
		}
		slickSlideshow.slides.splice((index+i+1), 0, slide_item);
		slickSlideshow.$obj.slickAdd("<div><img data-lazy='"+slides[i].image_url+"'/></div>", (index+i));
	}
}

slickSlideshow.addNavigationSlides = function() {
	for (var i = 0; i < slickSlideshow.slides.length; i++) {
		slickSlideshow.$obj.append("<div><img data-lazy='"+slickSlideshow.slides[i].url+"'/></div>");
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
			$.each(data.list, function(index, item) {
				slide_item = {
					'url': item.image_url,
					'obj_url': item.url,
					'object_id': item.object_id,
					'title': item.title,
					'description': item.description,
					'body': item.body
				}
				slickSlideshow.slides.push(slide_item);
			});
			slickSlideshow.addNavigationSlides();
			if (slickSlideshow.reseted) {
				var push_url = slickSlideshow.slides[0].obj_url + slickSlideshow.query;
				history.pushState(null, null, push_url);
			}
			slickSlideshow.initSlick(object_to_go);
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
		focusOnSelect: true,
		onAfterChange: slickSlideshow.afterChange,
		appendArrows: $(".slideshowWrapper"),
		nextArrow: "<button type='button' class='slick-next'></button>",
		prevArrow: "<button type='button' class='slick-prev'></button>"
	});
}


slickSlideshow.setLoadingProperties = function() {
	slickSlideshow.bulk = 30;
	slickSlideshow.lastItem = 0;
	slickSlideshow.forward = true;
	slickSlideshow.dangerous_entries = 1;
	slickSlideshow.dangerous_item = slickSlideshow.bulk;
	slickSlideshow.buffer = 5;
	slickSlideshow.reseted = false;
}

slickSlideshow.init = function() {
	var query = location.search;
	if (query != "") {
		slickSlideshow.log("==== INIT ====");
		slickSlideshow.$obj = $($('.slick-slideshow')[0]);
		slickSlideshow.$contentListingObj = $($('.slick-slideshow a')[0]);
		slickSlideshow.$contentListingObj.remove();
		slickSlideshow.$container = $($(".slideshowContent")[0]);
		slickSlideshow.getDetails();
		slickSlideshow.setLoadingProperties();
		slickSlideshow.getContentListing("");
	} else {
		slickSlideshow.log("==== INIT ====");
		slickSlideshow.$obj = $($('.slick-slideshow')[0]);
		slickSlideshow.$contentListingObj = $($('.slick-slideshow a')[0]);
		slickSlideshow.$contentListingObj.remove();
		slickSlideshow.$container = $($(".slideshowContent")[0]);
		slickSlideshow.getDetails();
		slickSlideshow.initSlick();
		slickSlideshow.getContentListing("");
	}
}

slickSlideshow.addBulkElements = function(index) {
	var request_url = "get_next_objects";
	var prev_url = "get_prev_objects";
	var URL;

	console.log("Request bulk of elements!")

	location_query_split = window.location.href.split('?');
	current_url = location_query_split[0];

	// Set request URL
	if (slickSlideshow.forward) { 
		var add_object = slickSlideshow.slides[index];
		URL = current_url + "/" + request_url + slickSlideshow.query + "&object_id="+add_object.object_id;
		console.log("Get next bulk for object_id: "+add_object.object_id)
	} else {
		var prev_object = slickSlideshow.slides[index+1];
		URL = current_url + "/" + prev_url + slickSlideshow.query + "&object_id="+prev_object.object_id;
		console.log("Get prev bulk for object_id: "+prev_object.object_id)
	}
	
	// Request
	$.getJSON(URL, function(data) {
		if (data.list != undefined) {
			console.log("BULK list found:");
			console.log(data.list);
			if (slickSlideshow.forward) {
				slickSlideshow.addSlideInIndex(data.list, index);
			} else {
				slickSlideshow.addSlideInIndex(data.list, index+1);
			}
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
	console.log("update slideshow loading");
	dangerous_zone_start = slickSlideshow.dangerous_item - slickSlideshow.buffer;
	dangerous_zone_end = slickSlideshow.dangerous_item + slickSlideshow.buffer;
	console.log("current slide:");
	console.log(current);
	console.log("dangerous zone start");
	console.log(dangerous_zone_start);

	var reset = false;
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
	return reset;
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

	if (reset == false) {
		// --- Update object details
		currentSlideObj = slickSlideshow.slides[currentSlide];
		var push_url = currentSlideObj.obj_url + slickSlideshow.query;
		
		history.pushState(null, null, push_url);
		var description = currentSlideObj.description;
		var title = currentSlideObj.title;
		var body = currentSlideObj.body;

		var document_title = document.title.split('—');
		document_title[0] = title;

		document.title = document_title.join('—');
		var jsBody = $($.parseHTML(body));
		var htmlBody = $.parseHTML(jsBody.text());

		$("#content h1.documentFirstHeading").html(title);
		$("#content div.documentDescription.description").html(description);
		$("#body-text").html(htmlBody);
	} else {
		
	}
	// --- //
}

slickSlideshow.getContentListing = function(object_number) {
	var URL;	
	var query = location.search;

	if (query != "") {
		// Slideshow aware of query
		slickSlideshow.getNavigationContent(query, object_number);
		// Slideshow aware of query
	} else {
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
	})
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

