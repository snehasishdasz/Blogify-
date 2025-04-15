const {mongoose,Schema} = require('mongoose');

const blogSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    },
    coverImageURL:{
        type: String,
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
},{timestamps: true});


module.exports = mongoose.model('blog', blogSchema);