const {Schema,model} = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  _id:String,
  data: { type: Object, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
});
const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // Link to Document model
  });

 
const Document= model("Document",DocumentSchema);
const User= model("User", UserSchema);
module.exports= {Document,User};