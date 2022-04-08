/*********************************************************************************WEB322 – Assignment 06 I declare that this assignment is my own work in
*  accordance with Seneca Academic Policy. No part of this assignment has been copied manually or electronically from any other source (including web sites)
* or distributed to other students.
* 
* Name: Ramandeep kaur______________________ Student ID: _139428205_____________ Date: __7 April 2022______________
*
* Online (Heroku) Link: ________________________________________________________
*
***********************************************************************************************************************************************************/
const service = require('./data-service.js')
const authData = require('./auth-service.js')
const reqie = require("require");
const app1 = reqie();
const express = require("express");
const app = express();
const multer = require("multer")
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const HTTP_PORT = process.env.PORT || 8080;
const exphbs = require('express-handlebars');
cloudinary.config({
 cloud_name: 'Cloud Name',
 api_key: 'API Key',
 api_secret: 'API Secret',
 secure: true
 });
 // no {storage: storage}
 const upload = multer();
 app.post('/posts/add', fileUpload.single("featureImage"), function (req, res) {
 res.redirect('/images');
	} );
	 let streamUpload = (req) => {
    return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );

       streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
};
app.engine('.hbs', exphbs({ 
    extname: '.hbs', 
    defaultLayout: 'main',
    helpers: {
        // helper function for changing the navbar
        navLink: function(url, options) {
            return '<li' + 
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function(lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    } 
}));

app.get("/posts/:id", function(req,res) {
        if (isNaN(req.params.id)) {
        
        res.redirect("/posts");    
    } else {
        service.getPostById(req.params.id)
        .then(function(value) {
            res.render('posts', {post: value});
        })
        .catch(function(err) {
            res.render('post', {message: "no results"});
        });
    }
});
app.get("/categories/:id", function(req,res) {
        if (isNaN(req.params.id)) {
        
        res.redirect("/categories");    
    } else {
        service.getCategoryById(req.params.id)
        .then(function(value) {
            res.render('categories', {category: value});
        })
        .catch(function(err) {
            res.render('category', {message: "no results"});
        });
    }
});

app.set('view engine', '.hbs');

app.use(function(req,res,next){       
let route = req.path.substring(1);       
app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.)/, "") : route.replace(/\/(.)/, ""));       app.locals.viewingCategory = req.query.category;       next();   });

// setting up route for /about
app.get("/about", function(req,res) {
       res.render('about');
});
app.get("/", function(req,res) {
     
    res.render('addPost');
});


async function upload(req) {
    let result = await streamUpload(req);
    console.log(result);
	 return result

}
upload(req).then((uploaded) => {
 req.body.featureImage = uploaded.url
upload(req);
});
 
app.get("/views", function(req, res){
    res.sendFile(path.join(__dirname, "/views/addPost.html"));
});
// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

// setup a route on the 'root' of the url
// IE: http://localhost:8080/
app.get("/", (req, res) => {
  res.send("<h1>Welcome to my simple website</h1><p>Be sure to visit the <a href='/headers'>headers page</a> to see what headers were sent from your browser to the server!</p>");
});

// now add a route for the /headers page
// IE: http://localhost:8080/headers
app.get("/headers", (req, res) => {
  const headers = req.headers;
  res.send(headers);
});
app.get('/blog', async (req, res) => {

    // Declare an object to store properties for the view
    let viewData = {};

    try{

        // declare empty array to hold "post" objects
        let posts = [];

        // if there's a "category" query, filter the returned posts by category
        if(req.query.category){
            // Obtain the published "posts" by category
            posts = await blogData.getPublishedPostsByCategory(req.query.category);
        }else{
            // Obtain the published "posts"
            posts = await blogData.getPublishedPosts();
        }

        // sort the published posts by postDate
        posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));

        // get the latest post from the front of the list (element 0)
        let post = posts[0]; 

        // store the "posts" and "post" data in the viewData object (to be passed to the view)
        viewData.posts = posts;
        viewData.post = post;

    }catch(err){
        viewData.message = "no results";
    }

    try{
        // Obtain the full list of "categories"
        let categories = await blogData.getCategories();

        // store the "categories" data in the viewData object (to be passed to the view)
        viewData.categories = categories;
    }catch(err){
        viewData.categoriesMessage = "no results"
    }

    // render the "blog" view with all of the data (viewData)
    res.render("blog", {data: viewData})

});
// This use() will not allow requests to go beyond it
// so we place it at the end of the file, after the other routes.
// This function will catch all other requests that don't match
// any other route handlers declared before it.
// This means we can use it as a sort of 'catch all' when no route match is found.
// We use this function to handle 404 requests to pages that are not found.
app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

// listen on port 8080\. The default port for http is 80, https is 443\. We use 8080 here
// because sometimes port 80 is in use by other applications on the machine
app.listen(HTTP_PORT, onHttpStart);
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

app.get("/posts/add", ensureLogin, (req, res) => {
  console.log("-addPost called"); 
  dataService.getCategories()
    .then((data) => {
      console.log("-addPost resolved"); 
      res.render("addPost", { category: data });
    })
    .catch((err) => {
      res.render("addPost", { category: [] });
      console.log(err);
      console.log("-addPost rejected"); 
    });
});

app.get("/post/delete/:postid", ensureLogin, (req, res) => {
  console.log("-deletePostById called"); // test //
  dataService.deletePostById(req.params.postid)
    .then((data) => {
      console.log("-deletePostById resolved"); // test //
      res.redirect("/post"); 
    })
    .catch((err) => {
      res.status(500).send("Unable to Remove Post / Post Not Found");
      console.log(err);
      console.log("-deletePostByNum rejected"); // test //
    });
});

app.get("/post/delete/:categoryid", ensureLogin, (req, res) => {
  console.log("-deleteCategoryById called"); // test //
  dataService.deleteCategoryById(req.params.categoryid)
    .then((data) => {
      console.log("-deleteCategoryById resolved"); // test //
      res.redirect("/post"); 
    })
    .catch((err) => {
      res.status(500).send("Unable to Remove Category / Category Not Found");
      console.log(err);
      console.log("-deleteCategoryByNum rejected"); // test //
    });
});

app.get("/category", ensureLogin, (req, res) => {
  console.log("-getCategories called"); // test //
  dataService.getCategories()
    .then((data) => {
      console.log("-getCategories resolved"); // test //
      res.render("categoryList", { data: data, title: "Categories" });
    })
    .catch((err) => {
      res.render("categoriesList", { data: {}, title: "Categories" });
      console.log(err);
      console.log("-getCategories rejected"); // test //
    });
});
// route for login page
app.get("/login", function(req, res) {
    res.render('login');
});

// route for registration page
app.get("/register", function(req, res) { 
    res.render('register');
});

// post for /register
app.post("/register", function(req, res) {
    authData.registerUser(req.body)
    .then(() => res.render('register', { successMsg: "User created!"}))
    .catch((err) => res.render('register', { errorMsg: err, userName: req.body.userName }));
});

// post for /login
app.post("/login", function(req, res) {
    req.body.userAgent = req.get('User-Agent');

    authData.checkUser(req.body)
    .then(function(user) { 
        req.session.user = {
            userName: user.userName,
            email: user.email,
            loginHistory: user.loginHistory
        }

        res.redirect('/posts');
    })
    .catch(function(err) {
        console.log(err);
        res.render('login', { errorMsg: err, userName: req.body.userName });
    });
});

// logout
app.get("/logout", function(req, res) {
    req.session.reset();
    res.redirect('/');
});

// user history
app.get("/userHistory", ensureLogin, function (req, res) {
    res.render('userHistory');
}); 


app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});
// setup listen
blogData.initialize()
.then(authData.initialize)
.then(function(){
 app.listen(HTTP_PORT, function(){
 console.log("app listening on: " + HTTP_PORT)
 });
}).catch(function(err){
 console.log("unable to start server: " + err);
});
