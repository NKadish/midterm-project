$(document).ready(function() {

  const loadMenu = function () {

  }


  const renderMenu = function(menu) {
    for (const food of menu) {
      const $output = createMenu(food);
      $('#menu-items').prepend($output);
    }
   };






});
