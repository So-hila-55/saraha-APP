import express from "express"
import { connectionDB } from "./DB/connectionDB.js"
import userRouter from "./modules/users/user.controller.js"

const app = express()
const port = 3000

const bootstrap = async () => {
    await connectionDB()

    app.use(express.json())

    app.get("/", (req, res) =>
        res.status(200).json({ message: "welcome on Sara7a App.....😍😍" })
    )

    app.use("/users", userRouter)

    app.use("{/*splat}", (req, res, next) => {
        res.status(404).json({
            message: `Url: ${req.originalUrl} With method: ${req.method} Not Found`,
            statusCode: 404,
        })
    })

    app.use((error, req, res, next) => {
        res.status(error.cause || 500).json({ message: error.message, statusCode: error.cause || 500 })
    })

    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}

export default bootstrap