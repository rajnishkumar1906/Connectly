import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Avatar from "../components/ui/Avatar";
import { Hash, Plus, Send, Users, ChevronLeft } from "lucide-react";

/* Communities (servers) – same layout as rest of site, inside main content area */
const Servers = () => {
  const { serverId, channelId } = useParams();
  const navigate = useNavigate();

  const {
    myServers,
    fetchMyServers,
    createServer,
    currentServer,
    setCurrentServer,
    channels,
    fetchChannels,
    currentChannel,
    setCurrentChannel,
    channelMessages,
    fetchChannelMessages,
    setChannelMessages,
    sendChannelMessage,
    joinChannelRoom,
    leaveChannelRoom,
    appendChannelMessage,
    socket,
    isAuthorised,
  } = useContext(AppContext);

  const [createName, setCreateName] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isAuthorised) fetchMyServers();
  }, [isAuthorised, fetchMyServers]);

  useEffect(() => {
    if (!serverId) {
      setCurrentServer(null);
      setCurrentChannel(null);
      setChannelMessages([]);
      return;
    }
    const server = myServers.find((s) => s._id === serverId);
    if (server) {
      setCurrentServer(server);
      fetchChannels(server._id);
    } else if (myServers.length > 0) {
      setCurrentServer(null);
      setCurrentChannel(null);
    }
  }, [serverId, myServers]);

  useEffect(() => {
    if (!serverId || !channelId || channels.length === 0) {
      if (!channelId && currentChannel) setCurrentChannel(null);
      return;
    }
    const channel = channels.find((ch) => ch._id === channelId);
    if (channel) setCurrentChannel(channel);
  }, [serverId, channelId, channels]);

  useEffect(() => {
    if (currentServer && channels.length > 0 && !channelId && serverId) {
      const first = channels[0];
      if (first) navigate(`/servers/${serverId}/${first._id}`, { replace: true });
    }
  }, [currentServer, channels, channelId, serverId, navigate]);

  useEffect(() => {
    if (!currentChannel) return;
    fetchChannelMessages(currentChannel._id);
    joinChannelRoom(currentChannel._id);
    const cid = currentChannel._id;
    const handleMsg = (msg) => {
      if (String(msg.channel) === String(cid)) appendChannelMessage(msg);
    };
    socket.current?.on("receiveChannelMessage", handleMsg);
    return () => {
      leaveChannelRoom(currentChannel._id);
      socket.current?.off("receiveChannelMessage", handleMsg);
    };
  }, [currentChannel?._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [channelMessages]);

  const handleCreateServer = async (e) => {
    e.preventDefault();
    if (!createName.trim()) return;
    setCreating(true);
    const result = await createServer({ name: createName.trim() });
    setCreating(false);
    if (result?.success && result?.server) {
      setCreateName("");
      setShowCreate(false);
      const sid = result.server._id;
      const defaultChannelId = result.server.defaultChannelId;
      if (defaultChannelId) {
        navigate(`/servers/${sid}/${defaultChannelId}`, { replace: true });
      } else {
        navigate(`/servers/${sid}`, { replace: true });
      }
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !currentChannel) return;
    sendChannelMessage(currentChannel._id, messageInput);
    setMessageInput("");
  };

  const goToServer = (s) => navigate(`/servers/${s._id}`);
  const goToChannel = (ch) => serverId && navigate(`/servers/${serverId}/${ch._id}`);

  /* ----- List view: your communities ----- */
  if (!serverId) {
    return (
      <div className="min-h-full bg-white dark:bg-black text-gray-900 dark:text-white">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-2">Communities</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Create or join communities to chat in channels with others.
          </p>

          <div className="flex flex-wrap gap-3 mb-6">
            {myServers.map((s) => (
              <Link
                key={s._id}
                to={`/servers/${s._id}`}
                className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 min-w-[200px]"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-lg font-semibold">
                  {s.name?.slice(0, 1).toUpperCase()}
                </div>
                <span className="font-medium truncate">{s.name}</span>
              </Link>
            ))}
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-3 p-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 min-w-[200px] text-gray-500 dark:text-gray-400"
            >
              <div className="w-12 h-12 rounded-xl border-2 border-dashed flex items-center justify-center">
                <Plus className="w-6 h-6" />
              </div>
              <span className="font-medium">Create community</span>
            </button>
          </div>

          {myServers.length === 0 && (
            <div className="text-center py-12 border border-gray-200 dark:border-gray-800 rounded-xl">
              <Users className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">You haven’t joined any communities yet.</p>
              <Button onClick={() => setShowCreate(true)}>Create your first community</Button>
            </div>
          )}
        </div>

        {showCreate && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
            <div
              className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-sm w-full p-6 border border-gray-200 dark:border-gray-800"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Create community</h3>
              <form onSubmit={handleCreateServer}>
                <Input
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  placeholder="Community name"
                  className="mb-4"
                  autoFocus
                />
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button>
                  <Button type="submit" disabled={creating || !createName.trim()}>{creating ? "Creating…" : "Create"}</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ----- Server open: channels + chat ----- */
  return (
    <div className="min-h-full flex flex-col bg-white dark:bg-black text-gray-900 dark:text-white">
      {/* Top bar: back + server name */}
      <div className="shrink-0 flex items-center gap-2 px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <Link to="/servers" className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-semibold truncate">{currentServer?.name || "Community"}</h1>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* Channel list */}
        <div className="w-52 shrink-0 border-r border-gray-200 dark:border-gray-800 flex flex-col py-3">
          <p className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Channels</p>
          {channels.filter((ch) => ch.type === "text").map((ch) => (
            <button
              key={ch._id}
              onClick={() => goToChannel(ch)}
              className={`flex items-center gap-2 px-3 py-2 text-left rounded-lg mx-2 ${
                currentChannel?._id === ch._id
                  ? "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <Hash className="w-4 h-4 shrink-0" />
              <span className="truncate">{ch.name}</span>
            </button>
          ))}
        </div>

        {/* Channel chat or placeholder */}
        {currentChannel ? (
          <div className="flex-1 flex flex-col min-w-0">
            <div className="shrink-0 px-4 py-2 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
              <Hash className="w-5 h-5 text-gray-500" />
              <span className="font-medium">#{currentChannel.name}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {channelMessages.map((msg) => (
                <div key={msg._id} className="flex gap-3">
                  <Avatar fallback={msg.sender?.username} className="shrink-0" />
                  <div>
                    <span className="font-medium text-sm">{msg.sender?.username}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ""}
                    </span>
                    <p className="text-gray-700 dark:text-gray-300 break-words mt-0.5">{msg.text}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex gap-2">
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder={`Message #${currentChannel.name}`}
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={!messageInput.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400 p-8">
            <p>Select a channel to start chatting.</p>
          </div>
        )}
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <div
            className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-sm w-full p-6 border border-gray-200 dark:border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Create community</h3>
            <form onSubmit={handleCreateServer}>
              <Input
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                placeholder="Community name"
                className="mb-4"
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button>
                <Button type="submit" disabled={creating || !createName.trim()}>{creating ? "Creating…" : "Create"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Servers;
