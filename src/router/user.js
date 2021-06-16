const express = require('express');
const router = new express.Router();
require('../db/mongoose');
const User = require('../model/user');
const auth = require('../middleware/auth');

router.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
  //async await used because of promise chaining
  //try catch used to show then and catch .try  executes await and returns result,catch called when await thrws error
  // user
  //   .save()
  //   .then((result) => {
  //     res.send(result);
  //   })
  //   .catch((err) => {
  //     res.status(400).send(err);
  //   });
});

router.get('/users/me', auth, async (req, res) => {
  // const users = await User.find();
  res.send(req.user);

  // User.find()
  //   .then((result) => {
  //     res.send(result);
  //   })
  //   .catch((err) => {
  //     res.status(500).send(err);
  //   });
});

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

router.get('/users/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.send('user not found');
    }
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send(e);
  }
  // User.findById(_id)
  //   .then((user) => {
  //     if (!user) {
  //       return res.send('user not found');
  //     }
  //     res.status(200).send(user);
  //   })
  //   .catch((err) => {
  //     res.send(err);
  //   });
});

router.patch('/users/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'age', 'email', 'password'];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates' });
  }
  const _id = req.params.id;
  try {
    //one way to do if you dont need to use middleware
    // const user = await User.findByIdAndUpdate(_id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    // 2nd way if you want middleware that is before saving pre('save') to be executed
    const user = await User.findByIdAndUpdate(_id);
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    // 2nd method ends
    if (!user) {
      return res.send('user not found');
    }
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.send('not found');
    }
    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.status(200).send();
  } catch (e) {
    res.status(500).send();
  }
});
module.exports = router;
