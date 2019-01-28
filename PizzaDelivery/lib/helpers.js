/*
 * Helpers for various tasks
 *
 */

// Dependencies
var config = require('./config');
var crypto = require('crypto');
var https = require('https');
var querystring = require('querystring');

// Container for all the helpers
var helpers = {};

// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = function(str){
  try{
    var obj = JSON.parse(str);
    return obj;
  } catch(e){
    return {};
  }
};

// parse a valid EMAIL
helpers.validateEmail = function(str){
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(str).toLowerCase());
}

// Create a SHA256 hash
helpers.hash = function(str){
  if(typeof(str) == 'string' && str.length > 0){
    var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
    return hash;
  } else {
    return false;
  }
};

// Create a string of random alphanumeric characters, of a given length
helpers.createRandomString = function(strLength){
  strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
  if(strLength){
    // Define all the possible characters that could go into a string
    var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

    // Start the final string
    var str = '';
    for(i = 1; i <= strLength; i++) {
        // Get a random charactert from the possibleCharacters string
        var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
        // Append this character to the string
        str+=randomCharacter;
    }
    // Return the final string
    return str;
  } else {
    return false;
  }
};

helpers.sendTwilioSms = function(phone,msg,callback){
  // Validate parameters
  phone = typeof(phone) == 'string' && phone.trim().length == 10 ? phone.trim() : false;
  msg = typeof(msg) == 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false;
  if(phone && msg){

    // Configure the request payload
    var payload = {
      'From' : config.twilio.fromPhone,
      'To' : '+1'+phone,
      'Body' : msg
    };
    var stringPayload = querystring.stringify(payload);


    // Configure the request details
    var requestDetails = {
      'protocol' : 'https:',
      'hostname' : 'api.twilio.com',
      'method' : 'POST',
      'path' : '/2010-04-01/Accounts/'+config.twilio.accountSid+'/Messages.json',
      'auth' : config.twilio.accountSid+':'+config.twilio.authToken,
      'headers' : {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(stringPayload)
      }
    };

    // Instantiate the request object
    var req = https.request(requestDetails,function(res){
        // Grab the status of the sent request
        var status =  res.statusCode;
        // Callback successfully if the request went through
        if(status == 200 || status == 201){
          callback(false);
        } else {
          callback('Status code returned was '+status);
        }
    });

    // Bind to the error event so it doesn't get thrown
    req.on('error',function(e){
      callback(e);
    });

    // Add the payload
    req.write(stringPayload);

    // End the request
    req.end();

  } else {
    callback('Given parameters were missing or invalid');
  }
};

// List of test Cards for Stripe.com 
helpers.testCardNumbers = function() {
  return {
      '3566002020360505'  : 'tok_jcb',
      '4242424242424242'  : 'tok_visa',
      '4000056655665556'  : 'tok_visa_debit',
      '5555555555554444'  : 'tok_mastercard',
      '5200828282828210'  : 'tok_mastercard_debit',
      '5105105105105100'  : 'tok_mastercard_prepaid',
      '378282246310005'   : 'tok_amex',
      '6011111111111117'  : 'tok_discover',
      '30569309025904'    : 'tok_diners',
      '6200000000000005'  : 'tok_unionpay'
  };
}

//Stripe payment API
helpers.sendStripePayment = function(amount, cardNbr, description, callback) {
  var amount = typeof(amount) == 'number' && amount > 0 ? amount : false;
  var cardNbr = typeof(cardNbr) == 'number' && cardNbr >= 0 ? cardNbr : false;
  var description = typeof(description) == 'string' && description.trim().length > 0 ? description.trim() : false; 
  var cclist = this.testCardNumbers();
  //console.log("amount: " + amount + " cardNbr: " + cardNbr + "desc: " + description + " cardToken: " + cclist[cardNbr]);
  if (amount && cardNbr && description) {
      var data = {
          amount: amount,
          currency: "usd",
          source: cclist[cardNbr], 
          description: description
          };
          
              // Configure the request details
              var stringPayLoad = querystring.stringify(data);
              // Configure the request details
              var requestDetails = {
                  'protocol' : 'https:',
                  'hostname' : 'api.stripe.com',
                  'method' : 'POST',
                  'path' : '/v1/charges',
                  'auth' : config.stripe.secretKey,
                  'headers' : {
                  'Content-Type' : 'application/x-www-form-urlencoded',
                  'Content-Length': Buffer.byteLength(stringPayLoad)
                  },
                  'data' : stringPayLoad
              };
              var req = https.request(requestDetails,function(res) {
                  // Grab the status of the sent request
                  var status = res.statusCode;
                  // Callback successfully if the request went through
                  if (status == 200 || status ==201) {
                      res.on("data", (d) => {
                          var data = d.toString();
                          var dataObject = JSON.parse(data);                         
                          //console.log("transId: " + dataObject.id);
                          //console.log("paid: " + dataObject.paid);
                          callback({'status' : status, 'transId' : dataObject.id, 'paid' : dataObject.paid});
                      });
                  } else {
                      // Bind to the error event so it does not get thrown
                      req.on("data", function(e) {
                          var data = e.toString();
                          var dataObject = JSON.parse(data);                    
                          callback({'status' : status, 'message' : e.message});
                      });
                  }
              });    
              // Bind to the error event so it does not get thrown
              req.on("error", function(e) {
                  callback(e);
              });
      
              // add the payload
              req.write(stringPayLoad);
              //end the request
              req.end();    
  } else {
      callback({'status' : 400, 'message' : "Fields are missing for card payment"});
  }
};

// Send mail with mailgun
// return: for now just sent the email.   TODO: Refine further as needed
// to use free email test you have to register the recepient
helpers.sendMailGun = function(toMail, subject, text, callback) {
  // TODO: Add email validation, since i am using specific registred email, skip for now.
  var subject = typeof(subject) == 'string' && subject.trim().length > 0 ? subject.trim() : false; 
  var text = typeof(text) == 'string' && text.trim().length > 0 ? text.trim() : false; 

  if (toMail && subject && text) {
      var data = {
          from: 'postmaster@sandbox08fbc8d417944752ad6a68be1d9f2766.mailgun.org',
          to: toMail,
          subject: subject,
          text: text
          };
          
              // Configure the request details
              var stringPayLoad = querystring.stringify(data);
              // Configure the request details
              var requestDetails = {
                  'protocol' : 'https:',
                  'hostname' : 'api.mailgun.net',
                  'method' : 'POST',
                  'path' : '/v3/sandbox08fbc8d417944752ad6a68be1d9f2766.mailgun.org/messages',
                  'auth' : 'api:'+config.mailgun.apiKey,
                  'headers' : {
                  'Content-Type' : 'application/x-www-form-urlencoded',
                  'Content-Length': Buffer.byteLength(stringPayLoad)
                  },
                  'data' : stringPayLoad
              };
              var req = https.request(requestDetails,function(res) {
                  // Grab the status of the sent request
                  var status = res.statusCode;
                  // Callback successfully if the request went through
                  if (status == 200 || status ==201) {
                      callback(false);
                  } else {
                      // Bind to the error event so it does not get thrown
                      req.on("data", function(e) {
                          var data = e.toString();
                          var dataObject = JSON.parse(data);                    
                          callback(dataObject.message);
                      });
                  }
              });
      
              // Bind to the error event so it does not get thrown
              req.on("error", function(e) {
                  callback(e);
              });
      
              // add the payload
              req.write(stringPayLoad);
              //end the request
              req.end();        
  } else {
      callback("Given parameters are  missing or invalid");
  }
}

// Export the module
module.exports = helpers;
