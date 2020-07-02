var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user.js');
var Floorplan = require('../models/floorplan.js');
var Devices = require('../models/devices.js')
var middleware = require('../middleware');


//=============GET Routes===============================
//Root Route
router.get("/",function(request,response)
{
     response.render("landing.ejs");
});

// ------- Home Route ---------
router.get("/home/:id", function(request, response)
{
   User.findById(request.params.id, function(error, foundUser)
   {
        if(error)
        {
            request.flash('error',"Failed to find user.");
            response.redirect('/');
        }
        
        response.render("home.ejs", {user: foundUser, page: 'home'});
    });
});

// ------------- Floorplan route -----------
router.get("/:id/floorplan/", middleware.isLoggedIn, function(request, response) 
{
      User.findById(request.params.id, function(error, foundUser)
   {
        if(error)
        {
            request.flash('error',"Failed to find user.");
            response.redirect('/');
        }
        
          response.render('floorplan/floorplan.ejs', {user: foundUser});
    });
  
});

//============== NEW route ====================
//Floorplan New
router.get("/:id/floorplan/new", middleware.isLoggedIn, function(request, response)
{
    //Find User by id
    User.findById(request.params.id, function(error, foundUser){
        if(error)
        {
            console.log(error);
        }
        else
        {
            response.render("floorplan/new.ejs", {user: foundUser});
        }
    });
});

//Floorplan Create
router.post("/:id/floorplan/new", middleware.isLoggedIn, function(request, response)
{
    //Look up User id
    User.findById(request.params.id, function(error, foundUser)
    {
        if(error)
        {
            console.log(error);
            response.redirect("/"+ foundUser._id + "/floorplan");
        }
        else
        {
            var floorPlan = {
                name: request.body.name,
                type: request.body.type
            }; 
            var newFloorplan = {floorPlans: floorPlan};
            Floorplan.create(newFloorplan, function(error, floorplan)
            {
                if(error)
                {
                    console.log(error);
                    response.redirect("/"+ foundUser._id + "/floorplan");
                }
                else
                {
                    console.log(floorplan);
                    //Save floorplan
                    floorplan.save();
                    foundUser.floorPlans.push(floorplan);
                    foundUser.save();
                    response.redirect('/' + foundUser._id + '/floorplan');
                }
            });
        }
    });
});

//Floorplan Update
router.put('/:id/floorplan/:floorplan_id', middleware.isLoggedIn, function(request, response)
{
   Floorplan.findByIdAndUpdate(request.params.floorplan_id, request.body.floorplan, function(error,updatedFloorplan)
   {
      if(error)
      {
          response.redirect('back');
      }
      else
      {
          response.redirect('/' + request.params.id + "/floorplan");
      }
   });
});


//============= Delete Route =========================

//Floorplan Destory
router.delete("/:id/floorplan/:floorplan_id", middleware.isLoggedIn, function(request, response)
{
    Floorplan.findByIdAndRemove(request.params.floorplan_id, function(error, floorplan){
        if(error)
        {
            response.redirect("/:id/floorplan");
        }
        else 
        {
            // deletes all devices associated with the floorplan
            Devices.remove({"_id": {$in: floorplan.devices}}, function (error) 
            {
                if (error) 
                {
                    console.log(error);
                    return response.redirect("/:id/floorplan");
                }
                    //  delete the floorplan
                    floorplan.remove();
                    request.flash("success", "Floorplan deleted successfully!");
                    response.redirect("/:id/floorplan");
            });
        }
    });  
});

//==============Authenication Routes================
//Show Register form
router.get('/register', function(request, response)
{
    response.render("register.ejs", {page: 'register'});
    });

//Register Sign Up Logic (Post Route)
router.post('/register', function(request, response)
{
    
    var newUser = new User({
        username: request.body.username,
        firstName: request.body.firstName, 
        lastName: request.body.lastName, 
        email: request.body.email});
    if(request.body.adminCode === 'secretcode123')
    {
        newUser.isAdmin = true;
    }
    User.register(newUser, request.body.password, function(error, user)
    {
        if(error)
        {
            console.log(error);
            return response.render("register.ejs", {error: error.message});
        }
        //This portion handles the action if the sign up is successful
        passport.authenticate('local')(request, response, function(){
            request.flash('success','Welcome to Project: Black Mirror ' + user.username);
            response.redirect("/home/" + user.id + "");
        });
    });
});

//Show Login Form
router.get('/login', function(request, response)
{
    response.render('login.ejs', {page: 'login'});
});

//This is using middleware to handle Login (app.post('/login', middleware, callback)
router.post("/login", passport.authenticate('local', 
    {
        failureRedirect: '/login'
    }), function(request, response){
        response.redirect("/home/" + request.user.id + "");
});

//Logout Route
router.get('/logout', function(request, response)
{
    request.logout();
    request.flash('success','Logout successful.');
    response.redirect('/');
});

module.exports = router;