
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

    app.post('/pay',(req,res)=>{

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


     paypal.payment.create(create_payment_json, function (error, payment) {
          if (error) {
              throw error;
          } else {
              console.log("Create Payment Response");
              console.log(payment);
              for(let i=0;i<payment.links.length;i++){
                  if(payment.links[i].rel==='approval_url'){
                      res.redirect(payment.links[i].href);
                  }
              }
          }
      });
    });

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

  app.get('/cancel',(req,res)=>{
  
      res.render('paypal_response/paypal_cancel.ejs');

  });





  
};
