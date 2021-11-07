const blogsRouter = require('express').Router();
const Blog = require('./../models/blog');
const User = require('./../models/user');

blogsRouter.get('/', async (request, response) => {
    const result = await Blog.find({}).populate('user', { username: 1, name: 1 });
    response.json(result);
});

blogsRouter.post('/', async (request, response) => {
    const body = request.body;
    if(!request.token || !request.decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' });
    }
    const user = await User.findById(request.decodedToken.id);

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user.id
    });
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog.id);
    await user.save();
    const newBlog = await Blog.findById(savedBlog.id).populate('user', { username: 1, name: 1 });
    response.json(newBlog.toJSON());
});

blogsRouter.delete('/:id', async (request, response) => {
    if(!request.token || !request.decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' });
    }
    const blog = await Blog.findById(request.params.id);
    if(!blog) return response.status(404).json({ error: 'blog not found' });
    if(blog.user.toString() !== request.decodedToken.id.toString()) {
        return response.status(401).json({ error: 'unauthorized, blog creator id does not match with remover id' });
    }
    const result = await Blog.findByIdAndRemove(request.params.id);
    if(result) {
        response.status(204).end();
    } else {
        response.status(404).end();
    }
});

blogsRouter.put('/:id', async (req, res) => {
    const body = req.body;
    const result = await Blog.findByIdAndUpdate(req.params.id, body, { new: true });
    if(result) {
        res.json(result);
    } else {
        res.status(404).end();
    }
});

module.exports = blogsRouter;