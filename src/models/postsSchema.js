const mongoose = require('mongoose');
const { Schema } = mongoose;


const postsSchema = new Schema({
    thumbnailUrl: {
        type: String
    },
    title: {
        type: String
    },
    body: {
        type: String
    },
    usersReading: {
        type: Number
    },
    usersLiked: {
        type: Number
    },
    views: {
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