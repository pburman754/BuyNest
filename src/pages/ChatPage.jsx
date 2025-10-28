// src/pages/ChatPage.jsx

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import '../pages/ChatPage.css';

const ChatPage = () => {
  const { user } = useAuth(); // Get our user for auth
  const { socket } = useSocket();

  const [conversations, setConversations] = useState([]); // Our inbox list
  const [activeChat, setActiveChat] = useState(null); // The selected conversation
  const [messages, setMessages] = useState([]); // Messages for the active chat
  const [loading, setLoading] = useState(false);

  const [newMessage, setNewMessage] = useState('');

  const messagesEndRef = useRef(null);

  // --- 1. Fetch all conversations (the inbox) ---
  useEffect(() => {
    const fetchConversations = async () => {
      if (!user || !user.token) {
        console.log('No user or token available');
        return;
      }
      
      try {
        console.log('Fetching conversations...');
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('/api/conversations', config);
        console.log('Conversations fetched:', data);
        setConversations(data);
      } catch (err) {
        console.error('Failed to fetch conversations', err);
      }
    };
    fetchConversations();
  }, [user?.token]); // Run once when user is loaded

  // --- 3. Listen for REAL-TIME messages ---
  useEffect(() => {
    // If there's no socket, we can't listen
    if (!socket) return;

    // Set up the listener
    const handleReceiveMessage = (incomingMessage) => {
      // Check if the message belongs to the chat we have open
      if (activeChat?._id === incomingMessage.conversationId) {
        // Add the new message to our 'messages' state
        setMessages((prevMessages) => [...prevMessages, incomingMessage]);
      }
    };

    socket.on('receiveMessage', handleReceiveMessage);

    // The CLEANUP function
    // This is vital to prevent memory leaks and duplicate listeners
    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };

  }, [socket, activeChat]); // Dependencies: Re-run if socket or activeChat changes

  // --- 4. Auto-scrolling logic ---
  useEffect(() => {
    // Scroll to the bottom every time the 'messages' array changes
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- 2. Fetch messages for the selected chat ---
  const selectConversation = async (convo) => {
    setActiveChat(convo); // Set this chat as active
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`/api/conversations/${convo._id}/messages`, config);
      setMessages(data); // Load the message history
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch messages', err);
      setLoading(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault(); // Stop form from reloading

    // Don't send empty messages
    if (!newMessage.trim() || !socket || !activeChat) return;

    // This is the "payload" we send to the server
    const messageData = {
      conversationId: activeChat._id,
      senderId: user._id,
      body: newMessage,
    };

    socket.emit('sendMessage', messageData);

    setNewMessage('');
  };

  // --- 5. The JSX Layout ---
  return (
    <div className="chat-container">
      {/* Column 1: Sidebar */}
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">My Inbox</div>
        {!user ? (
          <p>Please log in to see conversations</p>
        ) : conversations.length === 0 ? (
          <p>No conversations yet</p>
        ) : (
          conversations.map((convo) => (
          <div
            key={convo._id}
            className={`conversation ${activeChat?._id === convo._id ? 'active' : ''}`}
            onClick={() => selectConversation(convo)}
          >
            {/* 'participant' is the *other* user in the chat */}
            <p>{convo.participant.name}</p>
          </div>
          ))
        )}
      </div>

      {/* Column 2: Chat Window */}
      <div className="chat-window">
        {!activeChat ? (
          // If no chat is selected
          <div className="chat-window-placeholder">
            <p>Select a conversation to start chatting</p>
          </div>
        ) : (
          // If a chat IS selected
          <>
            <div className="message-list">
              {loading ? <p>Loading messages...</p> : (
                messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`message ${msg.sender._id === user._id ? 'sent' : 'received'}`}
                  >
                    {msg.body}
                  </div>
                ))
              )}
              {/* Add this empty div for the ref to "see" */}
              <div ref={messagesEndRef} />
            </div>

            {/* Hook up the form! */}
            <form className="message-form" onSubmit={handleSendMessage}>
              <input
                type="text"
                className="message-input"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit" className="btn">Send</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatPage;