const express = require("express");
const cors=require("cors")
const toyRoutes=require("./routes/toy.routes")
const userRoutes=require("./routes/user.routes")
const globalErrorHandler = require("./utils/errorHandler");
const path=require("path")

const app=express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname,'public')))


app.use("/api/v1/toys",toyRoutes)
app.use("/api/v1/users",userRoutes)



app.get("*",()=>{

});

app.all("*",(req,res,next)=>{
    next(new AppError(404,"The requested resource not exist on this server"));
});
app.use(globalErrorHandler);

module.exports.app=app;