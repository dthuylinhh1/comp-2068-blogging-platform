const viewPath = ('blogs');

const Blog = require('../models/blog');

exports.index = async (req, res) =>{
    try{
        const blogs = await Blog.find();
        res.render(`${viewPath}/index`,{
            pageTitle: 'Archive',
            blogs: blogs
        });
    }catch (error){
        req.flash('danger', `There was an error displaying an archive: ${error}`);
        res.redirect('/');
    }
};

exports.show = async (req, res) =>{
    try {
        const blog = await Blog.findById(req.params.id);
        res.render(`${viewPath}/show`, {
            pageTitle: blog.title,
            blog: blog
        });
    }catch (error){
        req.flash('danger', `There was an error displaying this blog: ${error}`);
        res.redirect('/blogs');
    }   
};

exports.new = (req, res) => {
    res.render(`${viewPath}/new`, {
        pageTitle: 'New Blog'
    });
};

exports.create = async (req, res) => {
    try{
        const blog = await Blog.create(req.body);
        req.flash('success', 'Blog created successfully');
        res.redirect(`/blogs/${blog.id}`);
    }catch(error){
        req.flash('danger', `There was an error creating this blog: ${error} `);
        req.session.formData = req.body;
        res.redirect('/blogs/new');
    }

};

exports.edit = async (req, res) =>{
    try{
        const blog = await Blog.findById(req.params.id);
        res.render(`${viewPath}/edit`, {
            pageTitle: blog.title,
            formData: blog
        });
    }catch(error){
        req.flash('danger', `There was an error accessing this blog: ${error} `);
        res.redirect('/');
    }

};

exports.update = async (req, res) => {
    try {
    //   const { user: email } = req.session.passport;
    //   const user = await User.findOne({email: email});
  
      let blog = await Blog.findById(req.body.id);
      if (!blog) throw new Error('Blog could not be found');
  
    //   const attributes = {user: user._id, ...req.body};
      await Blog.validate(req.body);
      await Blog.findByIdAndUpdate(req.body.id, req.body);
  
      req.flash('success', 'The blog was updated successfully');
      res.redirect(`/blogs/${req.body.id}`);
    } catch (error) {
      req.flash('danger', `There was an error updating this blog: ${error}`);
      res.redirect(`/blogs/${req.body.id}/edit`);
    }
  };

  exports.delete = async (req, res) => {
    try {
      console.log(req.body);
      await Blog.deleteOne({_id: req.body.id});
      req.flash('success', 'The blog was deleted successfully');
      res.redirect(`/blogs`);
    } catch (error) {
      req.flash('danger', `There was an error deleting this blog: ${error}`);
      res.redirect(`/blogs`);
    }
  };