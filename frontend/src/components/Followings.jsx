import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import Avatar from "../components/ui/Avatar";
import { useNavigate } from "react-router-dom";

const Followings = () => {
  const { followingList } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Following</h1>

      {followingList.length === 0 ? (
        <p className="text-gray-500">Not following anyone yet</p>
      ) : (
        followingList.map((u) => (
          <div
            key={u._id}
            className="flex items-center gap-3 p-3 border-b cursor-pointer hover:bg-gray-50"
            onClick={() => navigate(`/profile/${u._id}`)}
          >
            <Avatar fallback={u.username} />
            <span className="font-medium">{u.username}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default Followings;