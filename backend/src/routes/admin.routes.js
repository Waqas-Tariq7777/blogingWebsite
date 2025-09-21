import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createPost, getPost, deletePost, updatePost, getUsers, deleteUser} from "../controller/admin.controller.js";

const router = Router();

router.post(
  "/createPost",
  upload.fields([{ name: "image", maxCount: 1 }]),
  verifyJWT,
  isAdmin,
  createPost
);
router.get("/getPost", getPost);
router.delete("/deletePost/:postId/:userId", verifyJWT, isAdmin, deletePost);
router.put(
  "/updatePost/:postId/:userId",
  upload.fields([{ name: "image", maxCount: 1 }]),
  verifyJWT,
  isAdmin,
  updatePost
);
router.route("/getUsers").get(verifyJWT, isAdmin, getUsers)
router.route('/deleteUsers/:id').delete(verifyJWT, isAdmin, deleteUser)
export default router;
