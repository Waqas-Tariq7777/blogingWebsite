import mongoose, { Schema } from "mongoose";

const postSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        default: "https://simplybuiltsites.com/wp-content/uploads/how-to-write-a-blog-post.png"
    },
    category: {
        type: String,
        default: "uncategorized"
    },
    slug: {
        type: String,
        required: true,
        unique: true    
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
},{timestamps: true}
)

export const Post = mongoose.model('Post', postSchema)