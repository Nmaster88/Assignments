How to use

Run index.js from the folder of the project through the terminal with the command: 
node index.js

We can do request using an appropiatte REST client from the address:
http://localhost:3000


Tokens controller
path:	/Tokens
+-------+-------------------------------------------------------+
|GET	|?id=[Id of token]					|
|	+-------------------------------------------------------+
|	|returns the user token info 				|
+-------+-------------------------------------------------------+
|POST	|{							|
|	|	"email":"[string]",				|
|	|	"password":"[string]"				|
|	|}							|
|	+-------------------------------------------------------+
|	|Creates a token for the user that lasts for one hour	|
+-------+-------------------------------------------------------+
|PUT	|{							|
|       |	"id":"[string]",				|
|	|	"extend":[boolean]				|
|	|}							|
|	+-------------------------------------------------------+
|	|This gives the possibility to extend the validity of 	|
|	|the actual token for plus one hour			|
+-------+-------------------------------------------------------+
|DELETE	|?id=[string]						|
|	+-------------------------------------------------------+
|	|deletes the user token					|
+-------+-------------------------------------------------------+
|VerifyToken |?id=[string]					|
|	     +--------------------------------------------------+
|	     |deletes the user token				|
+------------+--------------------------------------------------+

Users controller
path	/Users 
+-------+-------------------------------------------------------+
|GET	|?email=[string]					|
|	+-------------------------------------------------------+
|	|returns the user info but we need a valid token	|
+-------+-------------------------------------------------------+
|POST	|{							|
|	|	"name":"[string]",				|
|	|	"street":"[string]",				|
|	|	"email":"[string]",		(key)		|
|	|	"password":"[string]",				|
|	|	"tosAgreement":[boolean]			|
|	|}							|
+	+-------------------------------------------------------+
|	|Creates a user						|
+-------+-------------------------------------------------------+
|PUT	|{							|
|	|	"email":"[string]",				|
|	|	"name":"[string]", 		(opcional)	|
|	|	"street":"[string]", 		(opcional)	|
|	|	"password":"[string]"		(opcional)	|
|	|}							|
+	+-------------------------------------------------------+
|	|Edit of user fields, exluding email which is the key	|
+-------+-------------------------------------------------------+
|DELETE |?email=[string]					|
|	+-------------------------------------------------------+
|	|Deletes the specified user				|
+-------+-------------------------------------------------------+

Menus controller
path	/Menus
+-------+-------------------------------------------------------+
|GET	|?menutype=[string]					|
|	+-------------------------------------------------------+
|	|returns all the menu type info				|
+-------+-------------------------------------------------------+

Cart controller
path	/cart
+-------+-------------------------------------------------------+
|GET	|							|
|	+-------------------------------------------------------+
|	|returns the cart of the user, validated by the token	|
+-------+-------------------------------------------------------+
|POST	|{							|
|	|	"email":"[string]",				|
|	|	"itemcode":"[string]",				|
|	|	"count":[number],				|
|	|	"price":[number]				|
|	|}							|
+	+-------------------------------------------------------+
|	|Adds a new item to the cart				|
+-------+-------------------------------------------------------+
|PUT	|{							|
|	|	"email":"[Email address]",			|
|	|	"name":"[Name]", 		(opcional)	|
|	|	"street":"[Street address]", 	(opcional)	|
|	|	"password":"[Password]"		(opcional)	|
|	|}							|
+	+-------------------------------------------------------+
|	|Edit of user fields, exluding email which is the key	|
+-------+-------------------------------------------------------+
|DELETE |							|
|	+-------------------------------------------------------+
|	|Deletes the cart of the user, validated by token	|
+-------+-------------------------------------------------------+

Order controller
path	/orders
+-------+-------------------------------------------------------+
|GET	|							|
|	+-------------------------------------------------------+
|	|returns the cart of the user, validated by the token	|
+-------+-------------------------------------------------------+
|DELETE |							|
|	+-------------------------------------------------------+
|	|Deletes the cart of the user, validated by token	|
+-------+-------------------------------------------------------+

Checkout controller
path	/checkout
+-------+-------------------------------------------------------+
|POST	|{							|
|	|	"name":"[string]",				|
|	|	"cardnbr":[number],	(test=4242424242424242)	|
|	|	"expDate":[number],				|
|	|	"cvv":[number]					|
|	|}							|
+	+-------------------------------------------------------+
|	|Makes a new order, validated by token			|
|	|Send payment to stripe platform			|
|	|store and complete the order, associate it with user	|
+-------+-------------------------------------------------------+
