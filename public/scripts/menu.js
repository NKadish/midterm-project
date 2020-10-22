$(document).ready(function() {
  $('.added-popup').hide();
  $('.addToCart').click(function(event) {
    event.preventDefault();
    let $menuItemId = $(this).val();
    let $quantity = ($(this).parent().find('.quantity')).val();
    let addedMsg = '';
    addedMsg += '<b> Added to the cart! </b>'
    $('.added-popup').hide();
    $('.added-popup').empty();
    ($(this).parent().find('.added-popup')).append(addedMsg);
    ($(this).parent().find('.added-popup')).slideDown('slow');
    $.ajax({
      url: '/menu',
      method: 'POST',
      data: {$menuItemId, $quantity}
    });
    ($(this).parent().find('.quantity')).val(1);
  });

});
