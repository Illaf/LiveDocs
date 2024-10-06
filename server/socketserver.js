const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const {Document} = require('./schemas/document');
const cors = require('cors');
const app = express();
const authRoutes= require('./auth/auth');
const authMiddleware= require('./auth/authMiddleWare');
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:5173", // Next.js frontend
    methods: ["GET", "POST"],
    credentials: true,
  },
});
app.use(cors());
app.use(express.json());
const uri = 'mongodb+srv://ilaf:Elaf%401234@cluster0.rb9ba.mongodb.net/myDatabase?retryWrites=true&w=majority';

async function connectDb() {
  try {
    await mongoose.connect(uri);
    console.log("Successfully connected to MongoDB cluster");
  } catch (error) {
    throw new Error(error);
  }
}

connectDb(); 
app.use('/auth',authRoutes);

const defaultValue = ""

io.on("connection", socket => {
  socket.on("get-document", async documentId => {
    const document = await findOrCreateDocument(documentId)
    const data=""
    socket.join(documentId)
    socket.emit("load-document", document.data)

    socket.on("send-changes", delta => {
      socket.broadcast.to(documentId).emit("receive-changes", delta)
    })

    socket.on("save-document", async data => {
      await Document.findByIdAndUpdate(documentId, {data})
    })
  })
})

// async function findOrCreateDocument(id) {
//   if (id == null) return

//   const document = await Document.findById(id)
//   if (document) return document
//   return await Document.create({ _id: id, data: defaultValue })
// }
// const PORT = process.env.PORT || 3001;
server.listen(3001, () => {
  console.log('Socket.io server running on port 3001');
});
