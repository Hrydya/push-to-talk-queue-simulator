const express= require('express');
const router= express.Router();
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

router.post('/register',async (req,res)=>{
    const { username, password } = req.body;
    try{
        let user = await User.findOne({ username });
        if (user) return res.status(400).json({ message: 'username exists' });
        const hashPassword = await bcrypt.hash(password,10);
        user= new User({username,password:hashPassword});
        await user.save();
        console.log("saved user:",user)
        const token = jwt.sign({ id: user._id, username: user.username },process.env.JWT_SECRET,{expiresIn :'1d'});
        res.status(201).json({token, username:user.username});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:'server error'})
    }
})

router.post('/login', async (req,res)=>{
    const {username,password} = req.body;
    try{
        let user= await User.findOne({username});
        if(!user)return res.status(400).json({message:'Invalid Credentials'});
        const isMatch = bcrypt.compareSync(password,user.password);
        if(!isMatch) return res.status(400).json({message:'Invalid Credentials'});

        const token = jwt.sign({ id: user._id, username: user.username },process.env.JWT_SECRET,{expiresIn:'1d'});
        res.json({token,username:user.username})
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:'server error'})
    }
})

module.exports = router;
