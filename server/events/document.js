const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {User,Document} = require('../schemas/document');
const router = express.Router();


const authMiddleware = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  
    try {
      const decoded = jwt.verify(token, 'your_secret_key');
      req.user = decoded.userId;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Token is not valid' });
    }
  };

  router.post('/document',authMiddleware, async(req,res)=>{
    const {content} = req.body;
    try{
      const newDocument= new Document({content, owner:req.user})
      await newDocument.save();
      res.json(newDocument);
    }catch(error){
      res.status(500).json({error:error});
    }
    
  })
  module.exports = router;