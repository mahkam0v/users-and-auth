import { Router } from "express"
import {
getUsers,
getUser,
createUser,
deleteUser,
uploadUserImage,
register,
login,
refresh
} from "../controllers/user.controller.js"

import { upload } from "../middlewares/upload.middleware.js"
import { validate } from "../middlewares/validate.middleware.js"
import { authorizeRoles, protect } from "../middlewares/auth.middleware.js"
import { createUserSchema, registerSchema, loginSchema } from "../validators/user.validator.js"

const router = Router()

router.post("/register", validate(registerSchema), register)
router.post("/login", validate(loginSchema), login)
router.post("/refresh", refresh);

router.get("/", protect, authorizeRoles(["admin"]), getUsers)
router.post("/", protect, authorizeRoles(["admin"]), validate(createUserSchema), createUser)
router.post("/upload", protect, upload.single("image"), uploadUserImage)
router.get("/:id", protect, getUser)
router.delete("/:id", protect, authorizeRoles(["admin"]), deleteUser)

export default router
