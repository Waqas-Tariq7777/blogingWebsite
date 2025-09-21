import { app } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({ path: "./.env"})

connectDB()
.then(()=>{
app.listen(port, (req, res)=>{
    console.log("App is Successfully listening on Port:", port)
})
})
.catch((error)=>{
    console.log("MONGODB Connection Error:", error)
})
const port = process.env.PORT || 4000
