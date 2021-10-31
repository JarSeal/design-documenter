const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('./../models/user');

// Get all users
usersRouter.get('/', async (request, response) => {
  const result = await User.find({}).populate('userGroups', {
    name: 1, id: 1
  });
  response.json(result);
});

// Register user
usersRouter.post('/', async (request, response) => {
  const body = request.body;

  if(!body.username || body.username.length < 5) {
    response.status(400).json({ error: 'username too short or missing' });
    return;
  }

  if(!body.email || body.email.length < 5) {
    response.status(400).json({ error: 'email too short or missing' });
    return;
  }
  
  if(!body.password || body.password.length < 6) {
    response.status(400).json({ error: 'password too short or missing' });
    return;
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    email: body.email,
    name: body.name,
    passwordHash,
  });
  
  const savedUser = await user.save();

  response.json(savedUser);
});

module.exports = usersRouter;