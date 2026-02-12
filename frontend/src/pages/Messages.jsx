import React, { useEffect, useContext, useState, useRef } from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Avatar from "../components/ui/Avatar";
import {
  Send,
  Phone,
  Video,
  MoreVertical,
  Search,
  ChevronLeft,
  Image,
  Smile,
  Mic,
  Check,
  CheckCheck,
  Clock
} from "lucide-react";
import { AppContext } from "../context/AppContext";
import { formatDistanceToNow } from "date-fns";

const Messages = () => {
  const { friends, api, user, socket } = useContext(AppContext);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const [showEmoji, setShowEmoji] = useState(false);

  const emojis = ["😀", "😂", "😍", "🔥", "👍", "🙏", "❤️", "😎", "😭", "🎉"];

  /* ===== CHAT ID HELPER ===== */
  const getChatId = (friendId) => {
    if (!user?._id) return null;
    return user._id < friendId
      ? `${user._id}_${friendId}`
      : `${friendId}_${user._id}`;
  };

  /* ===== SCROLL TO BOTTOM ===== */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  /* ===== SOCKET LISTENERS & FETCH ===== */
  useEffect(() => {
    if (!selectedFriend || !user) return;

    const chatId = getChatId(selectedFriend._id);

    if (socket.current) {
      socket.current.emit("joinChat", chatId);
    }

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/api/chat/${chatId}`);
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error("Fetch messages failed", err);
        setMessages([]);
      }
    };
    fetchMessages();

    const handleReceiveMessage = (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    };

    if (socket.current) {
      socket.current.on("receiveMessage", handleReceiveMessage);
      socket.current.on("userTyping", ({ isTyping: typing }) => {
        setIsTyping(typing);
      });
    }

    return () => {
      if (socket.current) {
        socket.current.off("receiveMessage", handleReceiveMessage);
        socket.current.off("userTyping");
      }
    };
  }, [selectedFriend, api, user, socket]);

  /* ===== TYPING INDICATOR ===== */
  const handleTyping = () => {
    if (!selectedFriend || !socket.current) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    socket.current.emit("typing", {
      chatId: getChatId(selectedFriend._id),
      isTyping: true,
    });

    typingTimeoutRef.current = setTimeout(() => {
      socket.current.emit("typing", {
        chatId: getChatId(selectedFriend._id),
        isTyping: false,
      });
    }, 1000);
  };

  /* ===== SEND MESSAGE ===== */
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedFriend) return;

    const chatId = getChatId(selectedFriend._id);

    if (socket.current) {
      socket.current.emit("sendMessage", {
        chatId,
        sender: user._id,
        text: inputText,
      });
      setInputText("");
      setIsTyping(false);
    } else {
      try {
        const res = await api.post("/api/chat/send", {
          receiverId: selectedFriend._id,
          text: inputText
        });

        const newMsg = res.data?.message || {
          sender: user._id,
          text: inputText,
          createdAt: new Date()
        };
        setMessages(prev => [...prev, newMsg]);
        setInputText("");
      } catch (err) {
        console.error("Send message failed", err);
      }
    }
  };

  /* ===== FILTER FRIENDS ===== */
  const filteredFriends = friends.filter(friend =>
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ===== MESSAGE STATUS ICON ===== */
  const MessageStatus = ({ message }) => {
    if (message.sender !== user._id) return null;

    if (message.read) {
      return <CheckCheck className="w-3 h-3 text-gray-400" />;
    } else if (message.delivered) {
      return <CheckCheck className="w-3 h-3 text-gray-400" />;
    } else if (message.sent) {
      return <Check className="w-3 h-3 text-gray-400" />;
    }
    return <Clock className="w-3 h-3 text-gray-400" />;
  };

  return (
    <div className="flex h-screen bg-black overflow-hidden">

      {/* SIDEBAR */}
      <div className={`w-full md:w-96 bg-black border-r border-gray-800 flex flex-col ${selectedFriend ? "hidden md:flex" : "flex"
        }`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-white">Messages</h1>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white"
            >
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages"
              className="pl-10 bg-gray-900 border-gray-800 text-white rounded-lg"
            />
          </div>
        </div>

        {/* Friends List */}
        <div className="flex-1 overflow-y-auto">
          {filteredFriends.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 px-4">
              <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-gray-600" />
              </div>
              <p className="text-gray-400 text-center">
                {searchQuery ? "No matches found" : "No conversations"}
              </p>
            </div>
          ) : (
            filteredFriends.map(friend => {
              const unreadCount = 3; // Calculate from your data

              return (
                <div
                  key={friend._id}
                  onClick={() => setSelectedFriend(friend)}
                  className={`flex items-center gap-3 p-4 border-b border-gray-800 cursor-pointer hover:bg-gray-900 ${selectedFriend?._id === friend._id ? "bg-gray-900" : ""
                    }`}
                >
                  <Avatar
                    fallback={friend.username}
                    size="md"
                    className="border border-gray-700"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-semibold text-white truncate">
                        {friend.username}
                      </h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        2h
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-400 truncate">
                        Last message here...
                      </p>
                      {unreadCount > 0 && (
                        <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <Avatar fallback={user?.username || "U"} size="sm" className="border border-gray-700" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user?.username || "User"}
              </p>
              <p className="text-xs text-gray-400 truncate">Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* CHAT AREA */}
      <div className={`flex-1 flex flex-col bg-black ${!selectedFriend ? "hidden md:flex" : "flex"
        }`}>
        {!selectedFriend ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mb-4">
              <Send className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Select a conversation
            </h3>
            <p className="text-gray-400 text-center max-w-sm">
              Choose a conversation to start messaging
            </p>
          </div>
        ) : (
          <>
            {/* CHAT HEADER */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setSelectedFriend(null)}
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-gray-400 hover:text-white"
                >
                  <ChevronLeft size={24} />
                </Button>
                <Avatar
                  fallback={selectedFriend.username}
                  size="md"
                  className="border border-gray-700"
                />
                <div>
                  <h3 className="font-bold text-white">
                    {selectedFriend.username}
                  </h3>
                  <p className="text-sm text-gray-400 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Active now
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white"
                  title="Call"
                >
                  <Phone size={20} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white"
                  title="Video"
                >
                  <Video size={20} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white"
                >
                  <MoreVertical size={20} />
                </Button>
              </div>
            </div>

            {/* MESSAGES CONTAINER */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-4 py-4 space-y-4">
                {/* Date Separator */}
                <div className="flex items-center justify-center my-4">
                  <div className="px-3 py-1 bg-gray-900 rounded-full">
                    <span className="text-xs text-gray-400">
                      Today
                    </span>
                  </div>
                </div>

                {messages.map((msg, i) => {
                  const isMe = msg.sender === user._id || msg.sender?._id === user._id;

                  return (
                    <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] px-3 py-2 rounded-lg ${isMe
                        ? "bg-white text-black rounded-br-none"
                        : "bg-gray-900 text-white rounded-bl-none"
                        }`}>
                        <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                        <div className={`flex items-center gap-1 mt-1 ${isMe ? "justify-end" : "justify-start"}`}>
                          <span className="text-xs text-gray-500">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </span>
                          {isMe && (
                            <div className="ml-1">
                              <MessageStatus message={msg} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-900 rounded-lg rounded-bl-none px-4 py-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} className="h-4" />
              </div>
            </div>

            {/* MESSAGE INPUT */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-800">
              <div className="flex items-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white"
                  onClick={() => setShowEmoji(!showEmoji)}
                >
                  😊
                </Button>

                {showEmoji && (
                  <div className="absolute bottom-12 left-0 bg-gray-900 border border-gray-700 p-2 rounded-lg flex gap-2 flex-wrap w-52">
                    {emojis.map((emoji, i) => (
                      <button
                        key={i}
                        type="button"
                        className="text-xl hover:scale-125 transition"
                        onClick={() => {
                          setInputText((prev) => prev + emoji);
                          setShowEmoji(false);
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex-1 relative">
                  <Input
                    value={inputText}
                    onChange={(e) => {
                      setInputText(e.target.value);
                      handleTyping();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                    placeholder="Message..."
                    className="pr-12 bg-gray-900 border-gray-800 text-black rounded-lg min-h-[42px] resize-none"
                    multiline
                    rows={1}
                    maxRows={4}
                  />
                </div>

                <Button
                  type="submit"
                  variant="ghost"
                  disabled={!inputText.trim()}
                  className={`h-[42px] w-[42px] text-gray-400 hover:text-white ${inputText.trim() ? "" : "opacity-50"
                    }`}
                >
                  <Send size={20} />
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Messages;