import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Post } from "../models/post.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
const createPost = asyncHandler(async (req, res) => {
    const { title, category, content } = req.body;
    if (!title || !content) throw new ApiError(400, "Title and content are required");

    const existedPost = await Post.findOne({ title });
    if (existedPost) throw new ApiError(409, "Post with the same title already exists");

    const slug = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const imageLocalPath = req.files?.image?.[0]?.path;
    if (!imageLocalPath) throw new ApiError(400, "Image file is required");

    const uploaded = await uploadOnCloudinary(imageLocalPath);
    if (!uploaded?.secure_url) throw new ApiError(500, "Image upload failed");
    console.log("multer files", req.files)
    const post = await Post.create({
        title,
        category,
        content,
        slug,
        image: uploaded.secure_url,
        userId: req.user._id,
    });

    res.status(201).json(new ApiResponse(201, post, "Post created successfully"));
});

const getPost = asyncHandler(async (req, res) => {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const posts = await Post.find({
        ...(req.query.userId && { userId: req.query.userId }),
        ...(req.query.category && { category: req.query.category }),
        ...(req.query.slug && { slug: req.query.slug }),
        ...(req.query.postId && { _id: req.query.postId }),
        ...(req.query.searchTerm && {
            $or: [
                { title: { $regex: req.query.searchTerm, $options: "i" } },
                { content: { $regex: req.query.searchTerm, $options: "i" } },
            ],
        }),
    })
        .sort({ updatedAt: sortDirection })
        .skip(startIndex)
        .limit(limit);

    const totalPosts = await Post.countDocuments();
        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );
        const lastMonthPosts = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });
    res.status(200).json({
        statusCode: 200,
        data: posts,
        totalPosts,
        lastMonthPosts,
        message: "Posts fetched successfully",
        success: true,
    });
});

const deletePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const deletedPost = await Post.findByIdAndDelete(postId);
    if (!deletedPost) throw new ApiError(404, "Post not found");

    res.status(200).json(new ApiResponse(200, deletedPost, "Post deleted successfully"));
});

const updatePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { title, category, content } = req.body;

    let imageUrl;
    const filePath = req.files?.image?.[0]?.path;
    if (filePath) {
        const uploaded = await uploadOnCloudinary(filePath);
        if (!uploaded?.secure_url) throw new ApiError(500, "Image upload failed");
        imageUrl = uploaded.secure_url;
    }

    const updateData = {
        ...(title && { title }),
        ...(category && { category }),
        ...(content && { content }),
        ...(imageUrl && { image: imageUrl }),
    };

    const post = await Post.findByIdAndUpdate(postId, updateData, {
        new: true,
        runValidators: true,
    });
    if (!post) throw new ApiError(404, "Post not found");

    res.status(200).json(new ApiResponse(200, post, "Post updated successfully"));
});


const getUsers = asyncHandler(async (req, res) => {

    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    const user = await User.find()
        .sort({ updatedAt: sortDirection })
        .skip(startIndex)
        .limit(limit);

    const totalUsers = await User.countDocuments();
        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );
        const lastMonthUsers = await User.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });
    res.status(200).json({
        statusCode: 200,
        data: user,
        totalUsers,
        lastMonthUsers,
        message: "Users fetched successfully",
        success: true,
    });
})

const deleteUser = asyncHandler(async (req, res) => {
  const userID = req.params.id;
  const deletedUser = await User.findByIdAndDelete(userID);

  if (!deletedUser) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(
    new ApiResponse(200, deletedUser, "User deleted successfully")
  );
});


export { createPost, getPost, deletePost, updatePost, getUsers, deleteUser };
