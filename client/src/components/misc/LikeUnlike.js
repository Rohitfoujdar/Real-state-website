import React from "react";
import { useAuth } from "../../context/auth";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function LikeUnlike({ ad }) {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const handleLike = async () => {
    try {
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnlike = async () => {
    try {
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      {auth.user?.wishlist?.includes(ad?._id) ? (
        <span className="h2 mt-3 pointer" onClick={handleUnlike}>
          <FcLike />
        </span>
      ) : (
        <span className="h2 mt-3 pointer" onClick={handleLike}>
          <FcLikePlaceholder />
        </span>
      )}
    </div>
  );
}
