import Router from "express";
import {
    registerUSer,
    loginUser,
    google,
    getCurrentUser,
    getUserByID,
    updateUser,
    deleteUser,
    logoutUser,
    getUser
} from "../controller/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route('/register').post(registerUSer)
router.route('/signin').post(loginUser)
router.route('/google').post(google)
router.route("/me").get(verifyJWT, getCurrentUser);
router.route('/getUser/:id').get(verifyJWT, getUserByID)
router.route('/updateUser/:id').put(verifyJWT,
    upload.fields([
        {
            name: "profilePicture",
            maxCount: 1
        },
    ]),
    updateUser)
router.route('/deleteUser/:id').delete(verifyJWT, deleteUser)
router.route('/logout').post(verifyJWT, logoutUser)
router.get('/:userId', getUser)
export default router;