const mongoose = require('mongoose');
const { Schema } = mongoose;


const postsSchema = new Schema({
    thumbnailUrl: {
        type: String
    },
    title: {
        required: true,
        type: String
    },
    body: {
        required: true,
        type: String
    },
    usersReading: {
        default: 0,
        type: Number
    },
    usersLiked: {
        default: 0,
        type: Number
    },
    views: {
        default: 0,
        type: Number
    },
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'tag'
    }],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
}, {timestamps: true});
 

    // comments: {
    //     type: []
    // },


const postsModel = mongoose.model("post", postsSchema);

module.exports = postsModel;