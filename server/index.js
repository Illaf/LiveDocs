const mongoose = require('mongoose');
const express = require('express');

const uri = 'mongodb+srv://ilaf:Elaf%401234@cluster0.rb9ba.mongodb.net/myDatabase?retryWrites=true&w=majority';

let isConnected;

async function connectDb() {
  if (isConnected) {
    console.log("MongoDB already connected");
    return;
  }
  try {
    await mongoose.connect(uri);
    isConnected = true;
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.log("Failed to connect to MongoDB:", error);
    throw new Error("Cannot connect to MongoDB");
  }
}

module.exports = connectDb;
