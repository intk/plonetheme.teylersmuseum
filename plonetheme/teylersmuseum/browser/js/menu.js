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

  /* FASTCLICK */
  $(function() {
    FastClick.attach(document.body);
  });

  /* HIDDEN STRUCTS */
  $("header h5.hiddenStructure").html('');
  $("#portal-personaltools-wrapper p.hiddenStructure").html('');

  /* OVERLAY */
  var overlay = document.querySelector('#nav_menu');

  if (overlay != undefined) {
    transEndEventNames = {
      'WebkitTransition': 'webkitTransitionEnd',
      'MozTransition': 'transitionend',
      'OTransition': 'oTransitionEnd',
      'msTransition': 'MSTransitionEnd',
      'transition': 'transitionend'
    },
    transEndEventName = transEndEventNames[Modernizr.prefixed('transition')],
    support = {
      transitions: Modernizr.csstransitions
    };
  }

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





