$(document).ready(function() {
  console.log('helloworld')
  $('.addToCart').click(function(event) {
    event.preventDefault();
    let $menuItemId = $(this).val();
    console.log($menuItemId);
    let $quantity = 1;
    $.ajax({
      url: '/menu',
      method: 'POST',
      data: {$menuItemId, $quantity}
    });
  });

});
