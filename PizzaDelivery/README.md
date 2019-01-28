Node JS - Pizza Cart Project
This is my master class - Nodejs Rest Service

Sample service calls. /tokens -- login { "email": ? , "password" : ?}

/menus?menutype=pizza -- retrieve menu

/cart -- add to cart { "email" : ?, "itemcode" : "P10IGFCZ","count" : 2, "price" : 1199}

/checkout -- complete cart -- swith using stripe sandbox. { "name" : "Sim", "cardnbr" : 378282246310005,"expdate" : 102020,"cvv" : 443}

/tokens?id=tokenId -- logout

/menus [get] -- Retrieve menu -- menu is retrieve regardless of weather you are logged in or not. -- ?menutype=pizza

/users [post] -- create a user [get] -- get a user with email# and a valid token in header. [put] -- update user data and a valid token in header [delete] -- delete user data with email and a valid token in header [TODO: deal with hangover orders]

/tokens [post] -- create a token id with email and password [get] -- get token data with id . Need a valid token in header. [put] -- update token data. Need a valid token in header. [delete] -- delete token data with email . Need a valid token in header.

/cart (pizza cart for orders incurred within the token session) [post] -- create a cart order or add to cart order [get] -- get cart order based on token. Need a valid token in header.

/orders (Orders incurred) [get] -- get order based on user. Need a valid token in header.

/checkout (Checkout Order) [post] -- Create an order -- make payment based on cart.pay using Stripe, -- Add order to user profile to track user related orders, -- remove cart if order was successfully proccessed by Stripe, -- email notification using MailGun.
