import React, { useEffect, useRef, useState } from "react";
import { BsHeart, BsHeartFill, BsChat, BsShare } from "react-icons/bs";
import { auth } from "../../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { motion } from "framer-motion";

const VideoDetail = ({ caption, video, profileImage, username }) => {
  const [user] = useAuthState(auth);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const videoRef = useRef(null);

  // Function to toggle like state
  const toggleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  // Function to handle video autoplay
  useEffect(() => {
    console.log("Intersection Observer mounted!");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (videoRef.current) {
            if (entry.isIntersecting) {
              console.log("Video is visible - Playing...");
              videoRef.current.play(); // Play when visible
            } else {
              console.log("Video out of view - Pausing...");
              videoRef.current.pause(); // Pause when out of view
            }
          }
        });
      },
      { threshold: 0.8 } // Trigger when 80% of video is visible
    );
  
    if (videoRef.current) observer.observe(videoRef.current);
  
    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, []);
  

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-screen">
      {/* Video Container */}
      <video
        ref={videoRef}
        src={video}
        className="w-full h-full object-cover"
        loop
        muted
        playsInline
      />

      {/* Right-side controls */}
      <div className="absolute right-5 bottom-24 flex flex-col items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleLike}
          className="flex flex-col items-center bg-gray-300 rounded-full p-2"
        >
          {isLiked ? (
            <BsHeartFill className="text-red-500 text-2xl" />
          ) : (
            <BsHeart className="text-black text-2xl" />
          )}
          <span className="text-black text-sm">{likes}</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex flex-col items-center bg-gray-300 rounded-full p-2"
        >
          <BsChat className="text-black text-2xl" />
          <span className="text-black text-sm">Comments</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex flex-col items-center bg-gray-300 rounded-full p-2"
        >
          <BsShare className="text-black text-2xl" />
          <span className="text-black text-sm">Share</span>
        </motion.button>
      </div>

      {/* Profile Image & Caption */}
      <div className="absolute left-5 bottom-24 flex items-center gap-3">
        <img
          src={profileImage}
          alt="Profile"
          className="w-12 h-12 rounded-full border-2 border-gray-300"
        />
        <div>
          <p className="text-white font-semibold">{username}</p>
          <p className="text-white text-sm">{caption}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;