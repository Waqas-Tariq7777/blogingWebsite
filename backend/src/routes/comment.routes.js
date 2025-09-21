import Router from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin} from "../middlewares/isAdmin.middleware.js"
import { createComment, getPostComments, likeComment, editComment, deleteComment, getComments} from "../controller/comment.controller.js";
const router = Router();
router.route('/create').post(verifyJWT, createComment)
router.route('/getPostComments/:postId').get(getPostComments)
router.route('/likeComment/:commentId').put(verifyJWT, likeComment)
router.route('/editComment/:commentId').put(verifyJWT, editComment)
router.route('/deleteComment/:commentId').delete(verifyJWT, deleteComment)
router.route('/getComments').get(verifyJWT, isAdmin,  getComments)
export default router;