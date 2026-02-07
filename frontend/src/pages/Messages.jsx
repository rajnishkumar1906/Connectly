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
  Pin,
  Check,
  CheckCheck,
  Clock,
  MoreHorizontal,
  Trash2,
  Star
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

  /* ===== GET LAST MESSAGE TIME ===== */
  const getLastMessageTime = (friendId) => {
    const chatId = getChatId(friendId);
    const friendMessages = messages.filter(msg => 
      msg.sender === friendId || msg.sender?._id === friendId
    );
    if (friendMessages.length === 0) return null;
    return friendMessages[friendMessages.length - 1].createdAt;
  };

  /* ===== MESSAGE STATUS ICON ===== */
  const MessageStatus = ({ message }) => {
    if (message.sender !== user._id) return null;
    
    if (message.read) {
      return <CheckCheck className="w-3 h-3 text-blue-500" />;
    } else if (message.delivered) {
      return <CheckCheck className="w-3 h-3 text-gray-400" />;
    } else if (message.sent) {
      return <Check className="w-3 h-3 text-gray-400" />;
    }
    return <Clock className="w-3 h-3 text-gray-400" />;
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">

      {/* SIDEBAR */}
      <div className={`w-full md:w-96 bg-white/90 backdrop-blur-sm border-r border-gray-200/50 flex flex-col shadow-xl transition-all duration-300 ${
        selectedFriend ? "hidden md:flex" : "flex"
      }`}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Send className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Messages
                </h1>
                <p className="text-xs text-gray-500 font-medium">
                  {friends.length} conversations
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-gray-100 active:scale-95 transition-all"
            >
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-500"
              size={20}
            />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="pl-12 bg-gray-50/50 border-gray-200/50 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 rounded-xl h-12 transition-all"
            />
          </div>
        </div>

        {/* Friends List */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Recent Conversations
            </h3>
          </div>
          
          {filteredFriends.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 px-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500 text-center">
                {searchQuery ? "No matches found" : "Start a conversation"}
              </p>
            </div>
          ) : (
            filteredFriends.map(friend => {
              const lastMessageTime = getLastMessageTime(friend._id);
              const unreadCount = 3; // You would calculate this from your data
              
              return (
                <div
                  key={friend._id}
                  onClick={() => setSelectedFriend(friend)}
                  className={`flex items-center gap-3 p-4 mx-2 my-1 cursor-pointer rounded-xl transition-all duration-200 group hover:bg-gray-50/80 active:scale-[0.98] ${
                    selectedFriend?._id === friend._id 
                      ? "bg-gradient-to-r from-blue-50/80 to-blue-50/40 border border-blue-200/50 shadow-sm" 
                      : ""
                  }`}
                >
                  <div className="relative">
                    <Avatar 
                      fallback={friend.username} 
                      size="md" 
                      className="ring-2 ring-offset-2 ring-transparent group-hover:ring-blue-100 transition-all"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {friend.username}
                      </h3>
                      {lastMessageTime && (
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {formatDistanceToNow(new Date(lastMessageTime), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500 truncate">
                        Last message preview...
                      </p>
                      {unreadCount > 0 && (
                        <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center">
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
        <div className="p-4 border-t border-gray-200/50">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50/50 cursor-pointer transition-colors">
            <Avatar fallback={user?.username || "U"} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.username || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* CHAT AREA */}
      <div className={`flex-1 flex flex-col bg-white/90 backdrop-blur-sm transition-all duration-300 ${
        !selectedFriend ? "hidden md:flex" : "flex"
      }`}>
        {!selectedFriend ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <Send className="w-16 h-16 text-blue-500" />
              </div>
              <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to Messages
            </h3>
            <p className="text-gray-500 text-center max-w-sm mb-8">
              Select a conversation or start a new one to begin messaging
            </p>
            <Button
              variant="primary"
              className="px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
              onClick={() => {/* Add new conversation logic */}}
            >
              Start New Conversation
            </Button>
          </div>
        ) : (
          <>
            {/* CHAT HEADER */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/50 bg-white/80">
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setSelectedFriend(null)}
                  variant="ghost"
                  size="icon"
                  className="md:hidden rounded-full hover:bg-gray-100 active:scale-95"
                >
                  <ChevronLeft size={24} />
                </Button>
                <div className="relative">
                  <Avatar 
                    fallback={selectedFriend.username} 
                    size="md"
                    className="ring-2 ring-offset-2 ring-blue-100"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    {selectedFriend.username}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Active now
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  title="Voice Call"
                >
                  <Phone size={20} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  title="Video Call"
                >
                  <Video size={20} />
                </Button>
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <MoreVertical size={20} />
                  </Button>
                </div>
              </div>
            </div>

            {/* MESSAGES CONTAINER */}
            <div className="flex-1 overflow-y-auto bg-gradient-to-b from-white to-gray-50/50">
              <div className="px-4 py-6 md:px-6 space-y-4">
                {/* Date Separator */}
                <div className="flex items-center justify-center my-8">
                  <div className="px-4 py-1 bg-gray-100 rounded-full">
                    <span className="text-xs font-medium text-gray-500">
                      Today
                    </span>
                  </div>
                </div>

                {messages.map((msg, i) => {
                  const isMe = msg.sender === user._id || msg.sender?._id === user._id;
                  const showAvatar = !isMe && (i === 0 || messages[i-1].sender !== msg.sender);

                  return (
                    <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"} gap-2 group`}>
                      {!isMe && showAvatar && (
                        <div className="flex-shrink-0 self-end mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Avatar fallback={selectedFriend.username} size="xs" />
                        </div>
                      )}
                      
                      <div className={`max-w-[70%] transition-all duration-200 ${!isMe && showAvatar ? "ml-0" : !isMe ? "ml-10" : ""}`}>
                        <div className={`relative px-4 py-3 rounded-2xl text-sm shadow-sm hover:shadow-md transition-shadow ${
                          isMe
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none"
                            : "bg-white border border-gray-200/50 rounded-bl-none"
                        }`}>
                          <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                          <div className={`flex items-center gap-1 mt-2 ${isMe ? "justify-end" : "justify-start"}`}>
                            <span className={`text-xs ${isMe ? "text-blue-100" : "text-gray-400"}`}>
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
                        
                        {/* Message Actions */}
                        <div className={`flex items-center gap-1 mt-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                          isMe ? "justify-end" : "justify-start"
                        }`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-6 h-6 rounded hover:bg-gray-100"
                          >
                            <Pin className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-6 h-6 rounded hover:bg-gray-100"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start gap-2">
                    <div className="flex-shrink-0 self-end">
                      <Avatar fallback={selectedFriend.username} size="xs" />
                    </div>
                    <div className="max-w-[70%]">
                      <div className="bg-white border border-gray-200/50 rounded-2xl rounded-bl-none px-4 py-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} className="h-4" />
              </div>
            </div>

            {/* MESSAGE INPUT */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200/50 bg-white/80">
              <div className="flex items-end gap-2">
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-gray-100"
                  >
                    <Image size={20} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-gray-100"
                  >
                    <Smile size={20} />
                  </Button>
                </div>
                
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
                    placeholder="Type a message..."
                    className="pr-12 bg-gray-50/50 border-gray-200/50 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 rounded-xl min-h-[46px] resize-none transition-all"
                    multiline
                    rows={1}
                    maxRows={4}
                  />
                  <div className="absolute right-3 bottom-3 flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 rounded-full hover:bg-gray-100"
                    >
                      <Mic size={18} />
                    </Button>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!inputText.trim()}
                  className={`h-[46px] w-[46px] rounded-xl transition-all ${
                    inputText.trim() 
                      ? "shadow-lg hover:shadow-xl hover:scale-105 active:scale-95" 
                      : "opacity-50"
                  }`}
                >
                  <Send size={20} />
                </Button>
              </div>
              
              {/* Quick Reply Suggestions */}
              {!inputText && (
                <div className="flex gap-2 mt-3 overflow-x-auto">
                  {["Hello!", "How are you?", "Let's meet tomorrow"].map((suggestion) => (
                    <Button
                      key={suggestion}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-full text-xs whitespace-nowrap hover:bg-gray-50"
                      onClick={() => setInputText(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Messages;