"use client";
import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import io from "socket.io-client";
import "quill/dist/quill.snow.css";
import { useParams } from "react-router-dom"; // Correct import for React routing

const TextEditor = () => {
  const { id: documentId } = useParams(); // Access the document ID from the route params
  const wrapper = useRef();
  const quillInstance = useRef(null); // Ref to hold the Quill instance
  const [socket, setSocket] = useState(null);
  const [quill, setQuill] = useState(null);

  useEffect(() => {
    if (wrapper.current && quillInstance.current === null) { // Only initialize once
      const editor = document.createElement("div");
      wrapper.current.append(editor);
      const q = new Quill(editor, { theme: "snow" });
      quillInstance.current = q; // Store the Quill instance
      q.disable();
      q.setText("Loading..");
      setQuill(q);
    }
    
    return () => {
      if (quillInstance.current !== null) {
        quillInstance.current = null; // Clean up the Quill instance if needed
      }
    };
  }, []);

  useEffect(() => {
    const setConn = io("http://localhost:3001");
    setSocket(setConn);
    return () => {
      setConn.disconnect();
    };
  }, []); // Add dependency array here

  useEffect(() => {
    if (socket === null || quill === null || !documentId) return;
    socket.once('load-document', document => {
      quill.setContents(document);
      quill.enable();
    });
    socket.emit("get-document", documentId);
  }, [socket, quill, documentId]); // Include documentId in the dependencies
useEffect(()=>{
const interval= setInterval(()=>{
socket.emit('save-document',quill.getContents());
},2000)
return ()=>{
  clearInterval(interval);
}
},[socket,quill])
  useEffect(() => {
    if (socket === null || quill === null) return;
    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, 2000);
    return () => clearInterval(interval);
  }, [socket, quill]);

  useEffect(() => {
    if (socket === null || quill === null) return;

    const handleQuill = (delta, oldDelta, source) => {
      if (source !== 'user') return;
      socket.emit("send-changes", delta);
    };

    quill.on("text-change", handleQuill);

    return () => {
      quill.off("text-change", handleQuill);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket === null || quill === null) return;

    const handleQuill = (delta) => {
      quill.updateContents(delta);
    };

    socket.on("receive-changes", handleQuill);

    return () => {
      socket.off("receive-changes", handleQuill);
    };
  }, [socket, quill]);

  return (
    <div className='text-red-300'>
      <div id="container" ref={wrapper}></div>
    </div>
  );
};

export default TextEditor;
