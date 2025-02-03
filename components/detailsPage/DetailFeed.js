import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { onSnapshot, query, collection, orderBy } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import VideoDetail from "./VideoDetail";

const DetailFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const feedRef = useRef(null);
  const videoRefs = useRef([]);
  const router = useRouter();

  useEffect(() => {
    const q = query(collection(firestore, "posts"), orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const videoData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(videoData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play();
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.8 }
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      videoRefs.current.forEach((video) => {
        if (video) observer.unobserve(video);
      });
    };
  }, [posts]);

  if (loading) return <p className="text-center text-white">Loading...</p>;

  return (
    <div ref={feedRef} className="video-feed">
      {posts.map((post, index) => (
        <VideoDetail
          key={post.id}
          caption={post.caption}
          company={post.company}
          video={post.videoUrl}
          profileImage={post.profileImage}
          username={post.username}
          userId={post.userId}
          id={post.id}
          videoId={post.id}
          videoRef={(el) => (videoRefs.current[index] = el)}
        />
      ))}
    </div>
  );
};

export default DetailFeed;
