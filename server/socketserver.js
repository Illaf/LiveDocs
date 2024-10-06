const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const Document = require('./schemas/document');
const cors = require('cors');
const app = express();
const authRoutes= require('./auth/auth');
const authMiddleware= require('./auth/authMiddleWare');
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000", // Next.js frontend
    methods: ["GET", "POST"],
    credentials: true,
  },
});
app.use(cors);
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

connectDb(); // Establish MongoDB connection for Socket.io
app.use('/auth',authRoutes);
app.get('/documents/:id', authMiddleware, async (req, res) => {
  const documentId = req.params.id;
  const userId = req.user.id; // Get user ID from JWT

  try {
    const document = await Document.findById(documentId);
    if (!document) return res.status(404).json({ message: 'Document not found' });

    if (document.ownerId.toString() !== userId) {
      return res.status(403).json({ message: 'You do not have access to this document' });
    }

    res.json(document);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
io.on('connection', (socket) => {
  socket.on('get-document', async (documentId) => {
    const document = await createOrFindDocument(documentId);
    socket.join(documentId);
    socket.emit('load-document', document.data);
    
    socket.on('send-changes', (delta) => {
      socket.broadcast.to(documentId).emit('receive-changes', delta);
    });

    socket.on('save-document', async data => {
      await Document.findByIdAndUpdate(documentId, { data });
    });
  });

  console.log('User connected');
});

async function createOrFindDocument(id) {
  if (id === null) return;
  const document = await Document.findById(id);
  if (document) return document;
  return await Document.create({ _id: id, data: "", ownerId: "defaultUserId" });
}
const PORT = process.env.PORT || 3001;
server.listen(3001, () => {
  console.log('Socket.io server running on port 3001');
});
