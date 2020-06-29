// includes mongoose is Object Document Mapper 
// turns the document inside the database into object, allows us to work with them as objects
const mongoose = require('mongoose');


// Schema is a Blueprint of how our documents are look like
// Every document will have title, content, status and timestamp
const BlogSchema = new mongoose.Schema({
    // attributes are like column headings in db
    title:{
        type: String, 
        required: true // This must exist
    },
    content: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ['DRAFT', 'PUBLISHED'],
        default: 'DRAFT'
    },

},{
    timestamps: true 
});

// Query Helpers
// Allows us to access all draft versions of our blog or published versions
BlogSchema.query.drafts = function (){
    return this.where({
        status: 'DRAFT'
    })
};

BlogSchema.query.published = function (){
    return this.where({
        status: 'PUBLISHED'
    })
};

BlogSchema.virtual('synopsis')
.get(function () {
    const post = this.content;
    return post.substring(0,250);
});

// export our mongoose model
module.exports = mongoose.model('Blog', BlogSchema);