const express = require('express');
const bcrypt = require('bcryptjs');
const jwt= require('jsonwebtoken');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

const router = express.Router();


const JWT_SECRET= "reactapp";

//create a user using : POST "/api/auth" . Does not require auth
router.post('/createUser', [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
  //If there are error return bad error and errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  //check whether if user with same email exist already
try{

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({ error: "sorry a user with this email already exists" })
  }
  const salt= await bcrypt.genSalt(10);
  secPass= await bcrypt.hash(req.body.password, salt);
//create a new user 
  user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: secPass,
  });

 
const data={
  user:{
    id: user.id}
}
 const authToken= jwt.sign(data, JWT_SECRET);
 // res.json(user);
res.json({authToken});
}
catch(error)
{
  console.error(error.message);
  res.status(500).send("some error occured");
}

})

module.exports = router