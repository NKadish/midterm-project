$(document).ready(function() {

  const loadMenu = function () {
    $.ajax({
      url: "/menu",
      method: "GET"
    }) .then ((food) => {
      getAllMenu(food);
    })
  };

  loadMenu();

  // const renderMenu = function(menu) {
  //   for (const food of menu) {
  //     const $output = createMenu(food);
  //     $('#menu-items').prepend($output);
  //   }
  //  };

   const createFoodItem = function(item) {
     const $food = $(`<article

     `

     )
   }





});
