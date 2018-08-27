// getting the post model
const Post = require('./models/post');
const paypal = require('paypal-rest-sdk');

// configuring paypal
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AfFcr8IRqecpCe-xfCmy1RBA0jp4usurpFIJm8dFDgN7IM_XhHdzr-wiWDGcRaVYEkgQOe5t8c5u5LG0',
    'client_secret': 'EHQKzSZZQkjusNhW2pnftlq5TyfgK6HfDlU8ZR-HazQN_n8vhIOwjwSSsBM-DD_yE-s18TE3YstYwAu1'
  });

module.exports = function (app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function (req, res) {


        res.render('index.ejs', {
            user: req.user // get the user out of session and pass to template
        });

    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function (req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', {
            message: req.flash('loginMessage')
        });
    });

    // process the login form
    // app.post('/login', do all our passport stuff here);

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function (req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', {
            message: req.flash('signupMessage')
        });
    });


    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));


    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));


    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function (req, res) {

        res.render('profile.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // WHO AM I SECTION ====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/who_am_i', isLoggedIn, function (req, res) {

        res.render('who_am_i.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    });


    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    // =====================================
    // CUSTOM ROUTES FOR STATIC EJS PAGE ===
    // =====================================

    app.get('/article1', function (req, res) {

        res.render('article1.ejs');
    });

    app.get('/gallery', function (req, res) {

        res.render('gallery.ejs');
    });


    // =====================================
    // CUSTOM ROUTES FOR STATIC SOCIAL SITES
    // =====================================
    app.get('/facebook', function (req, res) {

        res.redirect('https://www.facebook.com/frshafi');
    });

    app.get('/twitter', function (req, res) {

        res.redirect('https://twitter.com/frshafi');
    });

    app.get('/google_plus', function (req, res) {

        res.redirect('https://plus.google.com/u/0/106537327292409520659');
    });


    // =====================================
    // Post section     ====================
    // =====================================

    app.post('/post', (req, res) => {

        console.log(`Post request body is ${req.body}`);
        
        // taking post values from request body
        const title = req.body.title;
        const body = req.body.title;

        // creating post object
        post = new Post({
            title: title,
            body: body
        });

        // saving in database 
        post.save((err) => {
            res.json({"saved":"ok"});
            if(err){
                res.json({"saved":"failed"});
            }
        });
       


    });


    // =====================================
    // Paypal Pyment Sectio  ===============
    // =====================================

    app.post('/pay',(req,res)=>{


        var create_payment_json = {
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
            res.send("succcess");
        }
     });


    });

app.get('/cancel',(req,res)=>res.send('Payment Canceled'));

};


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

function isUserInSession(req, res) {

    if (req.isAuthenticated()) {
        return true;
    } else return false;
}