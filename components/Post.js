import React, { useEffect, useRef, useState } from "react";
import { BsHeart, BsHeartFill, BsChat, BsShare } from "react-icons/bs";
import { HiVolumeOff, HiVolumeUp } from "react-icons/hi";
import { auth } from "../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const Post = ({ caption, video, profileImage, username }) => {
  const [user] = useAuthState(auth);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isMuted, setIsMuted] = useState(false); // Set to FALSE so it starts with sound
  const videoRef = useRef(null);

  // Toggle Like State
  const toggleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  // Toggle Mute
  const toggleMute = () => {
    if (videoRef.current) {
      setIsMuted((prev) => !prev);
      videoRef.current.muted = !videoRef.current.muted;
    }
  };

  // Handle Video Autoplay when in View
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (videoRef.current) {
            if (entry.isIntersecting) {
              videoRef.current.play(); // Play when visible
            } else {
              videoRef.current.pause(); // Pause when out of view
            }
          }
        });
      },
      { threshold: 0.8 } // Play when 80% of the video is visible
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
        muted={isMuted} // Default to UNMUTED (false)
        playsInline
      />

      {/* Right-side controls */}
      <div className="absolute right-5 bottom-24 flex flex-col items-center gap-4">
        <button onClick={toggleLike} className="flex flex-col items-center">
          {isLiked ? (
            <BsHeartFill className="text-black text-2xl" />
          ) : (
            <BsHeart className="text-black text-2xl" />
          )}
          <span className="text-black text-sm">{likes}</span>
        </button>
        <button className="flex flex-col items-center">
          <BsChat className="text-black text-2xl" />
          <span className="text-black text-sm">Comments</span>
        </button>
        <button className="flex flex-col items-center">
          <BsShare className="text-black text-2xl" />
          <span className="text-black text-sm">Share</span>
        </button>
      </div>

      {/* Volume Control Button */}
      <div className="absolute bottom-10 left-5">
        <button onClick={toggleMute} className="text-white text-3xl">
          {isMuted ? <HiVolumeOff /> : <HiVolumeUp />}
        </button>
      </div>

      {/* Profile Image & Caption */}
      <div className="absolute left-5 bottom-24 flex items-center gap-3">
        <img
          src={profileImage}
          alt="Profile"
          className="w-12 h-12 rounded-full border-2 border-white"
        />
        <div>
          <p className="text-white font-semibold">{username}</p>
          <p className="text-white text-sm">{caption}</p>
        </div>
      </div>
    </div>
  );
};

export default Post;
