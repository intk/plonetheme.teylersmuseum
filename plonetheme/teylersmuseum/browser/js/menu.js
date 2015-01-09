/* SVG SUPPORT */
function supportsSvg() {
    return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Shape", "1.1");
}

$(document).ready(function() {
  
  /* FASTCLICK */
  $(function() {
    FastClick.attach(document.body);
  });

  if (slickSlideshow.$obj != undefined) {
    slickSlideshow.$obj.mousemove(function() {
      if ($("#slickslideshow").hasClass("fullscreen")) {
        $("#portal-header-wrapper").fadeIn();
        $("#slideshow-controls").fadeIn();
        $(".wrap-prev").fadeIn();
        $(".wrap-next").fadeIn();
      }
    });

  }

  /* Ignores initial popstate */
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
  }, 1000);

  $("#portal-languageselector").prependTo("#nav_menu");
  $("#portal-languageselector").show(100);

  $(".info-btn").click(function() {
    if ($(".container.object-container").is(":visible")) {

      $('html, body').animate({
        scrollTop: $("#slickslideshow").offset().top
      }, 600, function() {
        $("body").css("overflow-y", "hidden");
        $(".actions-div .info-btn i").removeClass("fa-times");
        $(".actions-div .info-btn i").addClass("fa-info-circle");
        $(".portaltype-object #parent-fieldname-text").hide();
        $(".container.object-container").hide();
        $(".portaltype-object #portal-footer-wrapper").hide();
      });

    } else {
      $('html, body').animate({
        scrollTop: $("#slideshow-controls").offset().top
      }, 600);

      $("body").css("overflow-y", "visible");
      $(".actions-div .info-btn i").removeClass("fa-info-circle");
      $(".actions-div .info-btn i").addClass("fa-times");
      $(".portaltype-object #parent-fieldname-text").show();
      $(".container.object-container").show();
      $(".portaltype-object #portal-footer-wrapper").show();
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
  var menu = document.querySelector('.bt-menu-trigger');
  
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







