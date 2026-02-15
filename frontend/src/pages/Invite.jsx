import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Button from "../components/ui/Button";

const Invite = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const { getServerByInviteCode, joinServerByInviteCode } = useContext(AppContext);

  const [server, setServer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!code) {
      setError("Invalid invite link");
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const data = await getServerByInviteCode(code);
        if (!cancelled) {
          setServer(data);
          setError(data ? null : "Invite invalid or expired");
        }
      } catch {
        if (!cancelled) setError("Failed to load invite");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [code, getServerByInviteCode]);

  const handleJoin = async () => {
    if (!code) return;
    setJoining(true);
    try {
      const result = await joinServerByInviteCode(code);
      if (result?.success && result?.server) {
        navigate(`/servers/${result.server._id}`, { replace: true });
      }
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-full bg-white dark:bg-black text-gray-900 dark:text-white flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Loading invite…</p>
      </div>
    );
  }

  if (error || !server) {
    return (
      <div className="min-h-full bg-white dark:bg-black text-gray-900 dark:text-white flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-500 dark:text-red-400 mb-4">{error || "Invite invalid or expired"}</p>
          <Button onClick={() => navigate("/servers", { replace: true })}>Go to Communities</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-white dark:bg-black text-gray-900 dark:text-white flex items-center justify-center px-4 py-8">
      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-8 max-w-md w-full text-center border border-gray-200 dark:border-gray-800">
        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-2xl font-bold mx-auto mb-4 text-gray-700 dark:text-gray-200">
          {server.name?.slice(0, 1).toUpperCase()}
        </div>
        <h1 className="text-xl font-semibold mb-1">{server.name}</h1>
        {server.owner?.username && (
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Invited by {server.owner.username}</p>
        )}
        <Button onClick={handleJoin} disabled={joining} className="w-full">
          {joining ? "Joining…" : "Join community"}
        </Button>
        <button
          type="button"
          onClick={() => navigate("/servers", { replace: true })}
          className="mt-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Invite;
