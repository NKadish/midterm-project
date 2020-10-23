# WcDonalds restaurant pickup app! 

This app gives the user a way to order items from their favorite fast food chain, WcDonalds, to be picked up. 

Once an order is placed the restaurant gets a text with what is in the order, and the user gets a text with how long until their estimated pickup time. Once the order is ready the user gets another text informing them that their item is ready. This project makes use of Twilio in order to impliment the texting functionality.  

IMPORTANT TO NOTE: this app will not really work on other computers due to not having a .env file, and because the twilio version is free, it can't properly send out texts. 

## Final Product

!["Menu Page"](https://github.com/NKadish/midterm-project/blob/master/docs/menu.png?raw=true)
!["Orders Page"](https://github.com/NKadish/midterm-project/blob/master/docs/orders.png?raw=true)
!["Checkout Page"](https://github.com/NKadish/midterm-project/blob/master/docs/checkout.png?raw=true)

## Dependencies

- Bcrypt
- Body-parser
- Chalk
- Cookie-session
- Dotenv
- EJS
- Express
- Morgan
- Node 5.10.x or above
- Postgres
- Twilio



## Getting Started

- Install dependencies: `npm i`
- Fix to binaries for sass: `npm rebuild node-sass`
- Reset database: `npm run db:reset`
  - Check the db folder to see what gets created and seeded in the SDB
- Run the server: `npm run local`
  - Note: nodemon is used, so you should not have to restart your server
- Visit `http://localhost:8080/`
