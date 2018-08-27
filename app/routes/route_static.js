
module.exports =  (app)=>{



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





};