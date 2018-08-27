
//getting paypal-rest-sdk module
const paypal = require('paypal-rest-sdk');

// configuring paypal
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AfFcr8IRqecpCe-xfCmy1RBA0jp4usurpFIJm8dFDgN7IM_XhHdzr-wiWDGcRaVYEkgQOe5t8c5u5LG0',
    'client_secret': 'EHQKzSZZQkjusNhW2pnftlq5TyfgK6HfDlU8ZR-HazQN_n8vhIOwjwSSsBM-DD_yE-s18TE3YstYwAu1'
  });


  module.exports = function(app){


    // =====================================
    // Paypal Pyment Section ===============
    // =====================================


    // this end point will be called when encourage btton is pressed
    app.post('/pay',(req,res)=>{


      // this json object will be sent to next create function of paypal
      // for now we are giving it as a demo,but in real payment, prices and
      // items will be updated from form and will be received by body parser and
      // pass it to this json
      const create_payment_json = {
          "intent": "sale",
          "payer": {
              "payment_method": "paypal"
          },
          "redirect_urls": {
              "return_url": "http://localhost:8080/success",
              "cancel_url": "http://localhost:8080/cancel"
          },
          "transactions": [{
              "item_list": {
                  "items": [{
                      "name": "item",
                      "sku": "item",
                      "price": "1.00",
                      "currency": "USD",
                      "quantity": 1
                  }]
              },
              "amount": {
                  "currency": "USD",
                  "total": "1.00"
              },
              "description": "This is the payment description."
          }]
      };

     // paypal will create a payment template using this function based on our 'create_payment_json'
     paypal.payment.create(create_payment_json, function (error, payment) {
          if (error) {
              throw error;
          } else {
              console.log("Create Payment Response");
              console.log(payment);

              // if it gets everything ok it will give us some link in an array
              // we have to redirect to 'approval_url' link
              // So, we are running a for loop to get extract this desired url
              for(let i=0;i<payment.links.length;i++){
                  if(payment.links[i].rel==='approval_url'){
                      res.redirect(payment.links[i].href);
                  }
              }
          }
      });
    });

    // if our payment is done successfully, this route will be called
    // because it is mentioned in 'redirect_urls' object of 'create_payment_json'
    app.get('/success',(req,res)=>{
      const payerId = req.query.PayerID;
      const paymentId = req.query.paymentId;

      const execute_payment_json = {
          
          "payer_id":payerId,
          "transactions":[{
              "amount":{
                  "currency":"USD",
                  "total":"1.00"
              }
          }]
      };

      // this method will be called by paypal when our payment is done
      // from the response of this function, we will get a lots of info
      // about the payment, which we can use in our website
      paypal.payment.execute(paymentId,execute_payment_json,function(error,payment){

          if(error){
              console.log(error.response);
              throw error;
          }else{
              console.log("Get Payment Response");
              console.log(JSON.stringify(payment));
              res.render('paypal_response/paypal_success.ejs');
          }
      
      });
  });

  // if user canceled the payment in the middle of the payment process,
  // this rout will be called
  app.get('/cancel',(req,res)=>{
  
      res.render('paypal_response/paypal_cancel.ejs');

  });





  
};
