import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Comment } from "../models/comment.model.js";

const createComment = asyncHandler(async (req, res) => {
    const { content, postId, userId } = req.body;

    if (!content || !postId || !userId) {
        throw new ApiError(400, "All fields are required");
    }

    if (userId !== req.user.id) {
        throw new ApiError(403, "You are not authorized to comment");
    }

    const newComment = new Comment({
        content,
        userId,
        postId,
    });

    await newComment.save();

    return res
        .status(201)
        .json( newComment);
});


const getPostComments = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const comments = await Comment.find({ postId }).sort({ createdAt: -1 });

    res.status(200).json(comments);
});

const likeComment = asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) throw new ApiError(500, "No comments found");

    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
        comment.numberOfLikes += 1;
        comment.likes.push(req.user.id);
    } else {
        comment.numberOfLikes -= 1;
        comment.likes.splice(userIndex, 1);
    }
    await comment.save();
    return res.status(200).json(comment);
});

const editComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return next(new ApiError(404, "Comment not found"));
        }

        if (comment.userId.toString() !== req.user.id && !req.user.isAdmin) {
            return next(new ApiError(403, "You are not allowed to edit this comment"));
        }

        const editedComment = await Comment.findByIdAndUpdate(
            req.params.commentId,
            { content: req.body.content },
            { new: true }
        );

        res.status(200).json(editedComment);
    } catch (error) {
        next(error);
    }
};

const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    // 1. Validate ID
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return next(new ApiError(400, "Invalid comment ID"));
    }

    // 2. Find comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return next(new ApiError(404, "Comment not found"));
    }

    // 3. Check permissions
    if (comment.userId.toString() !== req.user.id.toString() && !req.user.isAdmin) {
      return next(new ApiError(403, "You are not allowed to delete this comment"));
    }

    // 4. Delete
    await Comment.findByIdAndDelete(commentId);
    res.status(200).json({ success: true, message: "Comment has been deleted" });
  } catch (error) {
    console.error("Delete Comment Error:", error);
    next(error);
  }
  console.log("hii")
};

const getComments = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0
        const limit = parseInt(req.query.limit) || 9
        const sortDirection = req.query.sort === "desc" ? -1 : 1;
        const comments = await Comment.find()
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit);
        const totalComments = await Comment.countDocuments();
        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );
        const lastMonthComments = await Comment.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });
        res.status(200).json({
            data: comments,
            totalComments,
            lastMonthComments,
        });

    } catch (error) {
        next(error);
    }
};


export { createComment, getPostComments, likeComment, editComment, deleteComment, getComments };
