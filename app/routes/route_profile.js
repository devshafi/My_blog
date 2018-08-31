// getting the post model
const Post = require('../models/post');

// nod-mailer for email verification
const nodemailer = require('nodemailer');

// load up the user model
var User = require('../models/user');

// getting 'dotenv' module for accessing environment variable data(secure data)
require('dotenv').config();


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
    app.post('/signup',sendMailForUserVerification, passport.authenticate('local-signup', {
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


    // email-verification call back api from gmail
    app.get('/verify',function(req,res){
        console.log(req.protocol+":/"+req.get('host'));
        if((req.protocol+"://"+req.get('host'))==("http://"+host))
        {
            console.log("Domain is matched. Information is from Authentic email");
            if(req.query.id==rand)
            {
                console.log("email is verified");
                console.log(req.user);
                
                // if user comes from correct link, update user's isVerified variable in database
                const id = req.user._id;
                console.log("user id is "+id);
                User.findById(id, function (err, user) {
                    if (err) return handleError(err);

                    user.local.isVerified = true;
                    user.save(function (err, updatedUser) {

                      if (err) return handleError(err);
                      //res.send(updatedUser);
                      const url = "http://localhost:8080";
                      res.end("<h1>Email "+mailOptions.to+" is successfully verified</br>"+
                      "<a href="+url+">Go back to home</a>");
                    
                    });
                  });
            }
            else{
                console.log("email is not verified");
                res.end("<h1>Bad Request</h1>");
            }
        }
        else
        {
            res.end("<h1>Request is from unknown source");
        }
        });


};


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}


// =====================================
// Email-verfication ===================
// =====================================

// route middlewear to send email to the user for verification
// setting smtp requiremet for sending mail to the user

// getting email and password of the app for send mail to the user
// in this blog, it is my email and password,
// which I saved in .env file
const nodmailerRequirement = require('../../config/auth');

const smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.MY_GMAIL_ID,     // loading from environment variable
        pass: process.env.MY_GMAIL_PASS    // loading from environment variable
    }
});
let rand,mailOptions,host,link;


// custom middleware for sending email verification mail
function sendMailForUserVerification(req,res,next){
   
    // creating random number for checking if user is fake or not
    rand=Math.floor((Math.random() * 1000) + 54);
    host=req.get('host');
    link="http://"+req.get('host')+"/verify?id="+rand;
    
    // nodemailer mail option setup
    mailOptions={
        to : req.body.email,
        subject : "Please confirm your Email account",
        html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
    };

    console.log(mailOptions);

    // sending email
    smtpTransport.sendMail(mailOptions, function(error, response){
     if(error){
            console.log(error);
            res.send(error);
     }else{
            
        console.log("Message sent: " + response.message);
        return next();             // if mail is sent the go for signup
    }
    });
}


function isUserInSession(req, res) {

    if (req.isAuthenticated()) {
        return true;
    } else return false;
}