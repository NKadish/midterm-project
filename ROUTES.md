# Main Page
- GET / (GET request for main page)

- GET /login (USER AUTHENTICATION LOGIN ROUTE)

# Register Page
- GET /register (GET request for register page)
- POST /register (POST request to register new user)

# Menu Page
- GET /menu (GET request for menu page)
- GET /menu/:id (GET request for specific item from menu)
- POST /menu (POST requests to add items to cart from menu)

# Checkout Page
- GET /checkout (GET request for checkout page)
- POST /checkout (POST request to confirm order, adds to current order)
- PUT /checkout (PUT request to remove items from order)

# Orders Page
- GET /orders (GET request for orders page)
- GET /orders/:id (GET Request for specific order)
