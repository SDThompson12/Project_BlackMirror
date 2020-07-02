
var middlewareObject = {};

middlewareObject.isLoggedIn = function(request, response, next)
{
    if(request.isAuthenticated())
    {
        return next();
    }
    request.flash("error","Please login to Project: Black Mirror first!");
    response.redirect('/login');
};

module.exports = middlewareObject;