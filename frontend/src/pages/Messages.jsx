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
} from "lucide-react";

/* ================= MESSAGES ================= */

const Messages = () => {
  const { friends, api, user, socket } = useContext(AppContext);

  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);

  /* ===== CHAT ID ===== */
  const getChatId = (friendId) => {
    if (!user?._id) return null;
    return user._id < friendId
      ? `${user._id}_${friendId}`
      : `${friendId}_${user._id}`;
  };

  /* ===== SCROLL ===== */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ===== LOAD MESSAGES ===== */
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

  /* ===== SEND ===== */
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
    <div className="flex h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-white overflow-hidden">

      {/* ===== LEFT SIDEBAR ===== */}
      <aside
        className={`w-full md:w-80 bg-gray-100 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col
        ${selectedFriend ? "hidden md:flex" : "flex"}`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold">Messages</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Connectly chat</p>

          <div className="relative mt-4">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search people"
              className="pl-10"
            />
          </div>
        </div>

        {/* Friends */}
        <div className="flex-1 overflow-y-auto">
          {filteredFriends.map((friend) => (
            <button
              key={friend._id}
              onClick={() => setSelectedFriend(friend)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800
              ${selectedFriend?._id === friend._id ? "bg-gray-800" : ""}`}
            >
              <Avatar fallback={friend.username} size="md" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{friend.username}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  Tap to open chat
                </p>
              </div>
            </button>
          ))}

          {filteredFriends.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-center mt-10">
              No conversations yet
            </p>
          )}
        </div>
      </aside>

      {/* ===== CHAT AREA ===== */}
      <section
        className={`flex-1 flex flex-col bg-white dark:bg-black
        ${!selectedFriend ? "hidden md:flex" : "flex"}`}
      >
        {!selectedFriend ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <h3 className="text-xl font-bold mb-2">Your conversations</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Chat with people you follow on Connectly
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-white to-gray-100 dark:from-black dark:to-gray-900">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setSelectedFriend(null)}
                >
                  <ChevronLeft />
                </Button>
                <Avatar fallback={selectedFriend.username} size="md" />
                <div>
                  <p className="font-bold">{selectedFriend.username}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Active</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="ghost" size="icon"><Phone size={18} /></Button>
                <Button variant="ghost" size="icon"><Video size={18} /></Button>
                <Button variant="ghost" size="icon"><MoreVertical size={18} /></Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((msg, i) => {
                const isMe = msg.sender === user._id;
                return (
                  <div
                    key={i}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] px-3 py-2 rounded-lg text-sm
                      ${isMe
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={sendMessage}
              className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950"
            >
              <div className="flex gap-2">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Message…"
                  className="flex-1"
                />
                <Button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="bg-blue-500 text-white hover:bg-blue-600"
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
