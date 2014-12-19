/* SVG SUPPORT */
function supportsSvg() {
    return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Shape", "1.1");
}

$(document).ready(function() {
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


  

  /* FASTCLICK */
  $(function() {
    FastClick.attach(document.body);
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
});





