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
  }

  $("#portal-languageselector").prependTo("#nav_menu");
  $("#portal-languageselector").show(100);
  
  /* FASTCLICK */
  $(function() {
    FastClick.attach(document.body);
  });

  $(function() {
    $(".share-btn").popover({ trigger: "focus", html: true, animation:false,
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
        }, 300);
    });
  });

  if (slickSlideshow.$obj != undefined) {
    slickSlideshow.$obj.mousemove(slideMouseMove);
    $("iframe").mouseover(slideMouseMove);

    $(".portlet-gap, #row-items, body.template-content_view #parent-fieldname-text, .object-fields").mouseenter(function() {
      if ($("#slickslideshow").hasClass("fullscreen")) {
        $("#slideshow-controls").fadeOut();
        $(".wrap-prev, .wrap-next").css("opacity", 0);
      }
    });
  }

  /* Ignores initial popstate */
  if (slickSlideshow.$obj != undefined) {
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
      }, 3000);
    }
  }

  

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
    var currentSlide = slickSlideshow.$obj.slickCurrentSlide();
    var $slide = $(slickSlideshow.$obj.getSlick().$slides[currentSlide]);
    var $playBtn = $(this);

    if ($playBtn.hasClass('playing')) {
      $slide.slickPause();
      $playBtn.removeClass('playing');
      $playBtn.addClass('paused');
      $(".actions-div .play-btn i").removeClass("fa-pause");
      $(".actions-div .play-btn i").addClass("fa-play");
    } else {
      $slide.slickPlay();
      $playBtn.removeClass('paused');
      $playBtn.addClass('playing');
      $(".actions-div .play-btn i").removeClass("fa-play");
      $(".actions-div .play-btn i").addClass("fa-pause");
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
    } else {
      $(".actions-div .expand-btn i").removeClass("fa-expand");
      $(".actions-div .expand-btn i").addClass("fa-compress");
    }

    slickSlideshow.$obj.attr("style", "height:"+(h-gap)+"px;");
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