require("dotenv").config()

const express = require("express");
const app = express();
const userRoute = require("./routes/userRoutes");
const contentRoute = require("./routes/content-route");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const ExpressError = require("./utils/expressError");
const cors = require("cors");
const cookieParser = require("cookie-parser")

app.use(cors({
    origin:process.env.frontendurl,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    exposedHeaders: ["set-cookie"],
  }))

main().then((res)=>console.log("data base connected"))
.catch((e)=>console.log(e));
async function main() {
    mongoose.connect(process.env.dburl);
}





const sessionOption = {
    store:MongoStore.create({
        mongoUrl:process.env.dburl,
        crypto:{
          secret:process.env.dbsecret
        },
        touchAfter:24*60*60*1000
    }),
    secret:process.env.sessionsecret,
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:24*60*60*1000,
        secure:false
    }
}

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use(session(sessionOption));

app.use("/user",userRoute);
app.use("/content",contentRoute)



app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"))
})


app.use((err,req,res,next)=>{
    let {status = 500,message ="someting went wrong"}=err;
    res.status(status).json({message,success:false});
})

app.listen(8080,()=>{
    console.log("server is listen in the port");
})