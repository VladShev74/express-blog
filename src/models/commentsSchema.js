const mongoose = require('mongoose');
const { Schema } = mongoose;


const commentsSchema = new Schema({
    text: {
        required: true,
        type: String
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    parentPost: {
        type: Schema.Types.ObjectId,
        ref: 'post'
    },
    parentComment: {
        type: Schema.Types.ObjectId,
        ref: 'comment'
    },
    likes: {
        required: true,
        type: Number,
        default: 0
    },
}, {timestamps: true});
 



const commentsModel = mongoose.model("comment", commentsSchema);

module.exports = commentsModel;