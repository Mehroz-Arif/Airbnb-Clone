if(process.env.NODE_ENV !="production"){
  require('dotenv').config()
  
}

const express = require("express")
const app= express()
const mongoose = require("mongoose")

const path = require("path");
const methodOverRide= require('method-override');
const ejsMate= require('ejs-mate');

const expressError = require("./utils/expressError.js");
const session= require("express-session");

const Review= require("./models/review.js")
const { get } = require("http");
const { log } = require("console");
const listingsRouter = require("./routes/listing.js")
const reviewsRouter = require("./routes/review.js")
const flash= require("connect-flash");
const passport= require("passport")
const LocalStrategy = require('passport-local');
const User= require("./models/user.js")
const usersRouter= require("./routes/users.js")
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const url="mongodb://127.0.0.1:27017/wonderLust";


app.set("view engine", "ejs")

app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended :true}))
app.use(methodOverRide("_method"))
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

main().then(()=>{
console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(url)
}

const sessionOptions={
  secret:"mysupersecretkey",
  resave:false,
  saveUninitialized: true,
  cookie:{
    expires:Date.now()+ 7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    http:true,
  },
}
app.use(session(sessionOptions))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/",(req,res)=>{
  res.send("Hi i am root")
})

app.use((req,res,next)=>{
res.locals.success=req.flash("success");
res.locals.error=req.flash("error");
res.locals.currentUser= req.user
next();
})

// app.get("/demouser",async(req,res)=>{
//   let fakeuser={
//     email:"student@gmail.com",
//     username:"Mehroz",
//   }
//   let registeredUser=await User.register(fakeuser,"helloworld");
//   res.send(registeredUser)
// })


app.use("/listing",listingsRouter)
app.use("/listing/:id/reviews",reviewsRouter)
app.use("/",usersRouter)



//index roout

// app.get("/testListing", async (req,res)=>{
  // let sampleListing = new listing({
    //     title: "MY new villa",
    //     description:"By the beach",
    
    //     price:1200,
    //     location:"Gulghast , Multan",
    //     country: "Pakistan",
    
    // });
    
    
    
    
    // await sampleListing.save();
    // console.log("sample was save");
    
    // res.send("Succcesful tested")
    // })

    // get route
    
   

//show route

  
  // creat route
  
// add review route


app.all("*",(req,res,next)=>{
  next(new expressError(404,"PAGE NOT FOUND!"));
})


app.use((err, req, res, next)=>{
  let{statusCode=500,message="Something went wrong"}= err;
  res.status(statusCode).render("error.ejs",{err})
  
})

      


app.listen(8000,()=>{
console.log("server is running at port 8000");;
})