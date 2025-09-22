import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const generateToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    return { accessToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating token");
  }
};



const registerUSer = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body

  if (!userName || !email || !password) {
    throw new ApiError(400, "All fields are required")
  }

  const existedUser = await User.findOne({ email })

  if (existedUser) {
    throw new ApiError(401, "User already existed")
  }

  const user = await User.create({
    userName,
    email,
    password
  })

  const createdUser = await User.findById(user._id).select("-password")

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong")
  }

  return res.status(200)
    .json(
      new ApiResponse(200, createdUser, "User registered  successfully")
    );

})


const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new ApiError(400, "All fields are required")
  }

  const user = await User.findOne({ email })

  if (!user) {
    throw new ApiError(400, "User not found")
  }

  const isValidPassword = await user.isPasswordCorrect(password)

  if (!isValidPassword) {
    throw new ApiError(400, "Password is Incorrect")
  }

  const { accessToken } = await generateToken(user._id)

  const options = {
    httpOnly: true,
    secure: true
  }

  return res.status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(200, {
        id: user._id,
        userName: user.userName,
        email: user.email,
        isAdmin: user.isAdmin,
        accessToken
      }, "User logged in successfully")
    );
})

const google = asyncHandler(async (req, res) => {
  const { name, email, googlePhotoUrl } = req.body;

  let user = await User.findOne({ email });

  if (!user) {
    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);

    user = await User.create({
      userName:
        name.toLowerCase().split(" ").join("") +
        Math.random().toString(9).slice(-4),
      email,
      password: generatedPassword, // make sure model middleware hashes it
      profilePicture: googlePhotoUrl,
    });
  }

  const { accessToken } = await generateToken(user._id);

  const options = {
    httpOnly: true,
    secure: true
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        {
          id: user._id,
          userName: user.userName,
          email: user.email,
          profilePicture: user.profilePicture,
          accessToken,
        }, 'User registered with google successfully'
      )
    );
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) throw new ApiError(404, "User not found");

  res.json({
    id: user._id,
    userName: user.userName,
    email: user.email,
    profilePicture: user.profilePicture,
    isAdmin: user.isAdmin,
  });
});

const getUserByID = asyncHandler(async (req, res) => {

  const userID = req.params.id;
  const user = await User.findById({ _id: userID });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(
    new ApiResponse(200, user, "User fetched successfully")
  );
})


const updateUser = asyncHandler(async (req, res) => {
  const userID = req.params.id.trim();

  const { userName, email, password } = req.body;
  const user = await User.findById(userID);

  if (!user) throw new ApiError(404, "User not found");

  const profilePictureLocalPath = req.files?.profilePicture?.[0]?.path;
  if (profilePictureLocalPath) {
    const uploaded = await uploadOnCloudinary(profilePictureLocalPath);
    if (uploaded) user.profilePicture = uploaded.secure_url;
  }

  if (userName) user.userName = userName;
  if (email) user.email = email;
  if (password) user.password = password; // raw — will be hashed by hook

  await user.save();

  const { password: _, ...userData } = user.toObject();
  res
    .status(200)
    .json(new ApiResponse(200, userData, "User updated successfully"));
});

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

const logoutUser = asyncHandler(async (req, res) => {
  const options = {
    httpOnly: true,
    secure: true
  }

  return res.status(200).clearCookie("accessToken", options).json(new ApiResponse(200, 'Logout successfully'))
})

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId)
    if (!user) {
      throw new ApiError(500, "user not found")
    }
    const { password, ...rest } = user._doc
    res.status(200).json(rest)
  } catch (error) {
    next(error)
  }
}
export {
  registerUSer,
  loginUser,
  google,
  getCurrentUser,
  getUserByID,
  updateUser,
  deleteUser,
  logoutUser,
  getUser
}