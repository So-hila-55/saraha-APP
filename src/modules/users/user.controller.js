import { Router } from "express"
import * as userService from "./user.service.js"

const router = Router()

router.post("/signup", userService.signUp)
router.post("/signin", userService.signIn)

export default router