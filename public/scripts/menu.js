$(document).ready(function() {
  console.log('helloworld')
  $('.addToCart').click(function(event) {
    event.preventDefault();
    let $menuItemId = $(this).val();
    console.log($menuItemId);
    let $quantity = ($(this).parent().find('.quantity')).val();
    console.log($quantity);
    $.ajax({
      url: '/menu',
      method: 'POST',
      data: {$menuItemId, $quantity}
    });
    ($(this).parent().find('.quantity')).val(1);
  });
});
