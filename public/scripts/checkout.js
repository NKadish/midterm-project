$(document).ready(function() {
  console.log('helloworld')
  $('.removeFromCart').click(function(event) {
    event.preventDefault();
    let $cartId = $(this).val();
    console.log($cartId);
    $.ajax({
      url: '/checkout',
      method: 'POST',
      data: {$cartId},
    });
    location.reload();
  });
});
