import express from "express"

const testRouter = express.Router();

testRouter.get("/test", (req, res) => {
    res.send("Hello from Express Test")
})

export default testRouter