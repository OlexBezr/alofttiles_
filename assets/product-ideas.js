document.addEventListener("DOMContentLoaded", function() {
  jQuery('.product-ideas').slick({
    dots: false,
    infinite: false,
    arrows: true,
    slidesToShow: 3,
    slidesToScroll: 3,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 900,
        settings: {
          arrows: false,
          slidesToShow: 1,
          slidesToScroll: 1,
          adaptiveHeight: true,
          centerMode: true,
          centerPadding: '60px',
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          dots: true,
          centerMode: true,
          centerPadding: '20px',
        }
      }
    ]
  });
})
