// app/routes.js
module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
    
        
            res.render('index.ejs', {
                user : req.user // get the user out of session and pass to template
            });
         
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

    // process the login form
    // app.post('/login', do all our passport stuff here);

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

   
   // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
       
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // =====================================
    // CUSTOM ROUTES FOR STATIC EJS PAGE ===
    // =====================================

    app.get('/article1',function(req,res){
        
        res.render('article1.ejs');
    });

    app.get('/gallery',function(req,res){
        
        res.render('gallery.ejs');
    });

    
    // =====================================
    // CUSTOM ROUTES FOR STATIC SOCIAL SITES
    // =====================================
    app.get('/facebook',function(req,res){
        
        res.redirect('https://www.facebook.com/frshafi');
    });

    app.get('/twitter',function(req,res){
        
        res.redirect('https://twitter.com/frshafi');
    });

    app.get('/google_plus',function(req,res){
        
        res.redirect('https://plus.google.com/u/0/106537327292409520659');
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

function isUserInSession(req,res){

    if(req.isAuthenticated()){
      return true;
    }else return false;
}

