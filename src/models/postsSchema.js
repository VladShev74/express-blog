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
    
});

    // tags: {
    //     type: []
    // },
    // comments: {
    //     type: []
    // },
    // author: {
    //     type: String
    // },

const postsModel = mongoose.model("Posts", postsSchema);

module.exports = postsModel;