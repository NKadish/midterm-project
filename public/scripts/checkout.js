$(document).ready(function() {
  $('.removeFromCart').click(function(event) {
    event.preventDefault();
    let $cartId = $(this).val();
    $.ajax({
      url: '/checkout',
      method: 'POST',
      data: {$cartId},
    });
    location.reload();
  });
});
