import React, { useEffect, useContext, useState, useRef } from "react";
import { AppContext } from "../context/AppContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Avatar from "../components/ui/Avatar";
import {
  Send,
  Search,
  ChevronLeft,
  Phone,
  Video,
  MoreVertical,
  MessageCircle
} from "lucide-react";

const Messages = () => {
  const { friends, api, user, socket } = useContext(AppContext);

  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);

  const getChatId = (friendId) => {
    if (!user?._id) return null;
    return user._id < friendId
      ? `${user._id}_${friendId}`
      : `${friendId}_${user._id}`;
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!selectedFriend || !user) return;

    const chatId = getChatId(selectedFriend._id);

    socket.current?.emit("joinChat", chatId);

    const loadMessages = async () => {
      try {
        const res = await api.get(`/api/chat/${chatId}`);
        setMessages(res.data.messages || []);
      } catch {
        setMessages([]);
      }
    };

    loadMessages();

    const handleReceive = (msg) =>
      setMessages((prev) => [...prev, msg]);

    socket.current?.on("receiveMessage", handleReceive);

    return () => {
      socket.current?.off("receiveMessage", handleReceive);
    };
  }, [selectedFriend, api, socket, user]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedFriend) return;

    const chatId = getChatId(selectedFriend._id);

    socket.current?.emit("sendMessage", {
      chatId,
      sender: user._id,
      text: inputText,
    });

    setMessages((prev) => [
      ...prev,
      { sender: user._id, text: inputText, createdAt: new Date() },
    ]);

    setInputText("");
  };

  const filteredFriends = friends.filter((f) =>
    f.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full bg-white dark:bg-black text-gray-900 dark:text-white overflow-hidden">
      {/* Left Sidebar */}
      <aside
        className={`w-full md:w-80 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col
        ${selectedFriend ? "hidden md:flex" : "flex"}`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold">Messages</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Connectly chat</p>

          {/* Search */}
          <div className="relative mt-4">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search people"
              className="pl-10 bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
            />
          </div>
        </div>

        {/* Friends List */}
        <div className="flex-1 overflow-y-auto">
          {filteredFriends.length > 0 ? (
            filteredFriends.map((friend) => (
              <button
                key={friend._id}
                onClick={() => setSelectedFriend(friend)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition
                ${selectedFriend?._id === friend._id ? "bg-gray-100 dark:bg-gray-800" : ""}`}
              >
                <Avatar 
                  src={friend.avatar} 
                  fallback={friend.username} 
                  size="md"
                  className="border border-gray-200 dark:border-gray-700"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white truncate">
                    {friend.username}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    Tap to open chat
                  </p>
                </div>
              </button>
            ))
          ) : (
            <div className="text-center py-8 px-4">
              <p className="text-gray-500 dark:text-gray-400">No conversations yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Start chatting with people you follow
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* Chat Area */}
      <section
        className={`flex-1 flex flex-col bg-white dark:bg-black
        ${!selectedFriend ? "hidden md:flex" : "flex"}`}
      >
        {!selectedFriend ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mb-4 border border-gray-200 dark:border-gray-800">
              <MessageCircle className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Your conversations</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm">
              Select a friend from the sidebar to start chatting
            </p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setSelectedFriend(null)}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Avatar 
                  src={selectedFriend.avatar} 
                  fallback={selectedFriend.username} 
                  size="md"
                  className="border border-gray-200 dark:border-gray-700"
                />
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">
                    {selectedFriend.username}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Active now
                  </p>
                </div>
              </div>

              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-400">
                  <Phone size={18} />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-400">
                  <Video size={18} />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-400">
                  <MoreVertical size={18} />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length > 0 ? (
                messages.map((msg, i) => {
                  const isMe = msg.sender === user._id;
                  return (
                    <div
                      key={i}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      {!isMe && (
                        <Avatar 
                          src={selectedFriend.avatar} 
                          fallback={selectedFriend.username} 
                          size="sm"
                          className="mr-2 self-end mb-1"
                        />
                      )}
                      <div
                        className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm break-words
                        ${isMe
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none"
                        }`}
                      >
                        {msg.text}
                        <p className={`text-xs mt-1 ${isMe ? "text-blue-100" : "text-gray-500 dark:text-gray-400"}`}>
                          {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No messages yet</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    Send a message to start the conversation
                  </p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form
              onSubmit={sendMessage}
              className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black"
            >
              <div className="flex gap-2">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Message @${selectedFriend.username}...`}
                  className="flex-1 bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                />
                <Button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed px-4"
                >
                  <Send size={18} />
                </Button>
              </div>
            </form>
          </>
        )}
      </section>
    </div>
  );
};

export default Messages;