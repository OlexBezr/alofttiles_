$(document).ready(function(){
   $('#ssw-avg-rate-profile-html').click( function(e) {
     e.preventDefault();
       $([document.documentElement, document.body]).animate({
          scrollTop: $(".product-tabbed-heades__header").offset().top - 300
      }, 1000, 'linear');
      $('.product-tabbed-heades__header').removeClass('current');
      $('.product-tabbed-tabs__tab').removeClass('current');
      $(".product-tabbed-heades__header[data-tab='tab-reviews']").addClass('current');
      $("#tab-reviews").addClass('current');
  })
  
  $('.sticky-product-button .temp-link').each(function() {
    var tab_id = $(this).attr('data-tab');
    if(!document.querySelector(".product-tabbed-heades__header[data-tab='"+tab_id+"']")) {
      $(this).css('display', 'none')
    }
  })
  $('.sticky-product-button .temp-link').click(function(e){
    e.preventDefault();
    var tab_id = $(this).attr('data-tab');
    $([document.documentElement, document.body]).animate({
        scrollTop: $(".product-tabbed-heades__header").offset().top - 300
    }, 1000, 'linear');
    $('.product-tabbed-heades__header').removeClass('current');
    $('.product-tabbed-tabs__tab').removeClass('current');

    $(".product-tabbed-heades__header[data-tab='"+tab_id+"']").addClass('current');
    $("#"+tab_id).addClass('current');
  })



  window.addEventListener('scroll', function () {
      let trigger = document.querySelector('.shopify-payment-button, .bundle_add_button'),
          sticky_button =  document.querySelector(".sticky-product-button-wrapper"),
          triggerPos = trigger.getBoundingClientRect()
      if(triggerPos.y < 0 && !$(sticky_button).hasClass('_open')) {
          $(sticky_button).addClass('_open')
      }else if(triggerPos.y > 0 && $(sticky_button).hasClass('_open')) {
          $(sticky_button).removeClass("_open");
      }
  })
  
})