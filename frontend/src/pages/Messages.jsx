import React, { useState } from "react";

const Messages = () => {
  // Friend list
  const friendList = [
    { id: 1, name: "Rajnish" },
    { id: 2, name: "Prince" },
    { id: 3, name: "Albert" },
    { id: 4, name: "Bhagat Singh" },
    { id: 5, name: "Vivekananda" },
  ];

  // Messages
  const messages = [
    { timeStamp: 10, from: "me", text: "Hi" },
    { timeStamp: 20, from: "friend", text: "Hello" },
    { timeStamp: 30, from: "me", text: "How was your day?" },
    { timeStamp: 40, from: "me", text: "And what about that session?" },
    { timeStamp: 50, from: "friend", text: "It was fine" },
  ];

  // Sort messages
  const sortedMessages = [...messages].sort(
    (a, b) => a.timeStamp - b.timeStamp
  );

  // Selected friend
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="bg-gradient-to-r from-white to-blue-800 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 pt-10 px-10">
        <img src="/favicon.svg" alt="App icon" className="w-8 h-8" />
        <p className="text-2xl text-blue-700 font-semibold">Messages</p>
      </div>

      {/* Layout */}
      <div className="flex gap-4 px-6 py-4 h-[calc(100vh-120px)]">
        {/* Sidebar */}
        <div className="flex-[1] bg-blue-500 rounded-[20px] p-4 text-white overflow-y-auto">
          <p className="text-2xl mb-2">Friends</p>
          <hr className="border-2 border-blue-300 mb-3" />

          {friendList.map((friend) => (
            <div
              key={friend.id}
              onClick={() => setSelectedUser(friend)}
              className={`p-2 rounded-lg cursor-pointer hover:bg-blue-600 ${
                selectedUser?.id === friend.id ? "bg-blue-600" : ""
              }`}
            >
              {friend.name}
            </div>
          ))}
        </div>

        {/* Chat Area */}
        <div className="flex-[2] bg-blue-200 rounded-[20px] p-4 flex flex-col">
          {!selectedUser ? (
            <div className="flex flex-1 items-center justify-center text-gray-600">
              Select a friend to start chatting
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="/avatar.svg"
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {selectedUser.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Last seen · 2 days ago
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 text-gray-600">
                  <span className="cursor-pointer">📞</span>
                  <span className="cursor-pointer">🎥</span>
                  <span className="cursor-pointer">⋮</span>
                </div>
              </div>

              <hr className="my-4 border-gray-300" />

              {/* Messages */}
              <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
                {sortedMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                      msg.from === "me"
                        ? "bg-blue-500 text-white self-end"
                        : "bg-white text-gray-800 self-start"
                    }`}
                  >
                    {msg.text}
                    <div className="text-[10px] opacity-60 mt-1 text-right">
                      {msg.timeStamp}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
