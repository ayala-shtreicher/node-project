const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { app } = require("./app")

dotenv.config();
const mongoURL = process.env.MONGO_URL;

const connectToDB = () => {
    mongoose.connect(mongoURL)
        .then((con) => {
            console.log("connected to database");
        }).catch((error) => {
            console.log("Error to connect to database", error);
        })
};
connectToDB();

const PORT = process.env.PORT || 1200;
app.listen(PORT,()=>{
    console.log(`the server is running on port: ${PORT}`);
})