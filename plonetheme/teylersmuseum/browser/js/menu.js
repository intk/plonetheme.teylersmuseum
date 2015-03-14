/* SVG SUPPORT */
function supportsSvg() {
    return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Shape", "1.1");
}

function slideMouseMove() {
  if (slickSlideshow.$obj.getSlick() != undefined) {

    if ($("#slickslideshow").hasClass("fullscreen")) {
      $("#portal-header-wrapper").fadeIn();

      if (slickSlideshow.$obj.slickCurrentSlide() == 0) {
        $("body.portaltype-portlet-page .documentDescription, body.template-content_view .documentDescription, body.template-content_view .documentFirstHeading").fadeIn();
        
        if (slickSlideshow.playing != true) {
          $(".video-play-btn").css("opacity", 0.75);
        }
        if ($(".slideshowWrapper").hasClass("moved")) {
          $(".slideshowWrapper").removeClass("moved");
        }
      }

      if (slickSlideshow.playing != true) {
        $(".wrap-prev, .wrap-next").css("opacity", 1);
      }

      if (slickSlideshow.moved) {
        if (slickSlideshow.playing != true) {
          $("#slideshow-controls").fadeIn();
        }
      } else {
        if (slickSlideshow.$obj.slickCurrentSlide() == 0) {
          $("body.portaltype-portlet-page .documentDescription, body.template-content_view .documentDescription, body.template-content_view .documentFirstHeading").fadeIn();
          if ($(".slideshowWrapper").hasClass("moved")) {
            $(".slideshowWrapper").removeClass("moved");
          }
        }
      }
    }
  }
}

$(document).ready(function() {
  if ($("body.site-nl").length > 0) {
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/nl_NL/sdk.js#xfbml=1&appId=634764129875517&version=v2.0";
      fjs.parentNode.insertBefore(js, fjs);
    } (document, 'script', 'facebook-jssdk'));
  } else {
      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&appId=634764129875517&version=v2.0";
        fjs.parentNode.insertBefore(js, fjs);
      } (document, 'script', 'facebook-jssdk'));
  }

  if (isMobile.any()) {
    var window_w = $(window).width();
    $(".navmenu, .navbar-offcanvas").css("width", window_w);
    $("body").addClass("mobile");
  }

  $("#portal-languageselector").prependTo("#nav_menu");
  $("#portal-languageselector").show(100);

  /* Ignores initial popstate */
  /*if (slickSlideshow.$obj != undefined) {
    if (slickSlideshow.isCollection == false) {
      setTimeout(function () {
        window.addEventListener( 'popstate', function() {
            if (slickSlideshow.$obj != undefined) {
              if (slickSlideshow.forward) {
                slickSlideshow.$obj.slickPrev();
              } else {
                slickSlideshow.$obj.slickNext();
              }
            }
        }, false );
      }, 10000);
    }
  }*/
  
  /* FASTCLICK */
  $(function() {
    FastClick.attach(document.body);
  });

  $(function() {
    $(".share-btn").popover({ trigger: "click focus", html: true, animation:false,
      content: function() {
        return $('#share-settings').html()
      },
      title: function() {
        return $('#share-title').html();
      }
    }).on("mouseenter", function () {
        var _this = this;
        $(this).popover("show");
        $(".popover").on("mouseleave", function () {
            $(_this).popover('hide');
        });
    }).on("mouseleave", function () {
        var _this = this;
        setTimeout(function () {
            if (!$(".popover:hover").length) {
                $(_this).popover("hide");
            }
        }, 200);
    });
  });

  if (slickSlideshow.$obj != undefined) {
    slickSlideshow.$obj.mousemove(slideMouseMove);
    $("iframe").mouseover(slideMouseMove);

    $(".portlet-gap, #row-items, body.template-content_view #parent-fieldname-text, .object-fields").mouseenter(function() {
      if ($("#slickslideshow").hasClass("fullscreen")) {
        $("#slideshow-controls").fadeOut();
        $(".wrap-prev, .wrap-next").css("opacity", 0);
        $(".video-play-btn").css("opacity", 0);
      }
    });
  }

  $(".video-play-btn").click(function() {
    $(".slick-active.video-slide img.overlay-image").hide();
    $(".video-play-btn").hide();
  });

  $("#sort_on").on('change', function(e) {
    var optionSelected = $("option:selected", this);
    $("#form-widgets-sort_on").val(this.value);
  });

  $(".shop-btn, .buy-item").click(function() {
    var currentSlide = slickSlideshow.$obj.slickCurrentSlide();
    var slides = slickSlideshow.$obj.getSlick().$slides;
    var currentLocation = document.location.origin;
    
    if ($("body").hasClass("site-nl")) {
      var formPath = currentLocation + "/nl/bestel-afbeelding/view?url=";      
    } else {
      var formPath = currentLocation + "/en/order-image/view?url=";      
    }

    var $currentSlide = $(slides[currentSlide]);
    if ($currentSlide != undefined) {
      if ($currentSlide.attr("data-url") != undefined) {
        formPath += $currentSlide.attr("data-url");
        document.location.href = formPath;
      } else {
        formPath += document.location.href;
        document.location.href = formPath;
      }
    } else {
      formPath += document.location.href;
      document.location.href = formPath;
    }

  });
  

  $(".info-btn").click(function() {
    if ($(".container.object-container").is(":visible")) {

      $('html, body').animate({
        scrollTop: $("#slickslideshow").offset().top
      }, 600, function() {
        
        $(".actions-div .info-btn i").removeClass("fa-times");
        $(".actions-div .info-btn i").addClass("fa-info-circle");
        $(".portaltype-object #parent-fieldname-text").hide();
        $(".container.object-container").hide();
        $(".portaltype-object #portal-footer-wrapper").hide();

        if (slickSlideshow.isCollection) {
          $(".object-fields").hide();
        } else {
          $("body").css("overflow-y", "hidden");
        }

      });

    } else {
      $('html, body').animate({
        scrollTop: $("#slideshow-controls").offset().top
      }, 600);

      
      $(".actions-div .info-btn i").removeClass("fa-info-circle");
      $(".actions-div .info-btn i").addClass("fa-times");
      $(".portaltype-object #parent-fieldname-text").show();
      $(".container.object-container").show();
      $(".portaltype-object #portal-footer-wrapper").show();

      if (slickSlideshow.isCollection) {
        $(".object-fields").show();
      } else {
        $("body").css("overflow-y", "visible");
      }
    }
  });

  
  $(".play-btn").click(function() {
    if (!$("body").hasClass('template-instrument_view')) {
      var currentSlide = slickSlideshow.$obj.slickCurrentSlide();
      var $slide = $(slickSlideshow.$obj.getSlick().$slides[currentSlide]);
    } else {
      $slide = slickSlideshow.$obj;
    }

    var $playBtn = $(this);

    if ($playBtn.hasClass('playing')) {
      console.log("pause");
      $slide.slickPause();
      $playBtn.removeClass('playing');
      $playBtn.addClass('paused');
      $(".actions-div .play-btn i").removeClass("fa-pause");
      $(".actions-div .play-btn i").addClass("fa-play");
      $(".slideshow").removeClass('playing');
      $(".slideshow").addClass('paused');
    } else {
      console.log("play");
      $slide.slickPlay();
      $playBtn.removeClass('paused');
      $playBtn.addClass('playing');
      $(".actions-div .play-btn i").removeClass("fa-play");
      $(".actions-div .play-btn i").addClass("fa-pause");
      $(".slideshow").removeClass('paused');
      $(".slideshow").addClass('playing');
    }
  });


  $(".expand-btn").click(function() {
    var gap = 0;
    var h = $(window).height();

    slickSlideshow.gap = gap;  
    $("#slickslideshow").toggleClass("fullscreen");
    $("header").toggleClass("fullscreen");
    slickSlideshow.resize = false;

    if (!$("#slickslideshow").hasClass("fullscreen")) {
      gap = 160;
      slickSlideshow.gap = gap;
      slickSlideshow.resize = true;
      $(".actions-div .expand-btn i").removeClass("fa-compress");
      $(".actions-div .expand-btn i").addClass("fa-expand");
      slickSlideshow.resizeImage(true);
    } else {
      $(".actions-div .expand-btn i").removeClass("fa-expand");
      $(".actions-div .expand-btn i").addClass("fa-compress");
    }

    slickSlideshow.$obj.attr("style", "height:"+(h-gap)+"px;");
  });

  $(".zoom-btn").click(function() {
    if ($(".actions-div .zoom-btn i").hasClass("fa-search-plus")) {
      $(".actions-div .zoom-btn i").removeClass('fa-search-plus');
      $(".actions-div .zoom-btn i").addClass('fa-search-minus');

      /* Ask for full resolution image */
      var currentSlide = slickSlideshow.$obj.slickCurrentSlide();
      var $slide = $(slickSlideshow.$obj.getSlick().$slides[currentSlide]);

      var $img = $($slide.find('img')[0]);
      var img_src = $img.attr("src");

      var url = img_src.replace('@@images/image/large', '');

      var request_url = url + 'get_image_resolution';

      $.getJSON(request_url, function(data) {
        var h = data.h;
        var w = data.w;
        $(".slideshow").addClass('zoomed');
        $img.addClass("zoomed");
        $img.attr("style", "height: "+h+"px; width:"+w+"px;");
      });

    } else {
      $(".actions-div .zoom-btn i").removeClass("fa-search-minus");
      $(".actions-div .zoom-btn i").addClass("fa-search-plus");
    }
  });

  /* HIDDEN STRUCTS */
  $("header h5.hiddenStructure").html('');
  $("#portal-personaltools-wrapper p.hiddenStructure").html('');

  /* OVERLAY */
  var menu = document.querySelector('.menu_wrapper');
  
  function toggleOverlay() {
    if (menu != undefined) {
      if (classie.has(menu, 'open')) {
        classie.remove(menu, 'open');
        classie.add(menu, 'closed');
      } else {
        classie.remove(menu, 'closed');
        classie.add(menu, 'open');
        slickSlideshow.pauseCurrentSlide();
      }
    }
  }

  $(".menu_wrapper").click(function() {
    toggleOverlay();
  });

  if ($("#collection-filters .portletStaticText a").length > 0) {
    $("#collection-filters").show();
  }

  $("#collection-filters .portletStaticText a").each(function() {
    var elem = $(this);
    var link = $(this).attr("href");
    var link_alt = link + "/";
    var link_aggregator = link + "/aggregator";

    var URL = link + "/get_number_of_results";

    if (link == window.location.href || link_alt == window.location.href || link == window.location.href + "aggregator" || link == window.location.href + "/aggregator") {
      $(this).addClass("highlighted")
    }
  });



  $("#search-results-selector .navbar-nav a").each(function() {
    var $elem = $(this);
    var args = $elem.attr("href").replace(/.*?:\/\//g, "");
    var location = window.location.href;

    var search_query = location + args;
    $elem.attr("href", search_query);
  });
});