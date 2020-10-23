$(document).ready(function() {
  console.log('helloworld')
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
