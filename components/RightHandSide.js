import React, { useEffect, useState } from "react";
import { onSnapshot, query, collection, orderBy } from "firebase/firestore";

import { firestore } from "../firebase/firebase";
import Post from "./Post";
import Skeleton from "./Skeleton/Skeleton";

const RightHandSide = () => {
  const [posts, setPosts] = useState([]);
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    const q = query(collection(firestore, "posts"), orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      },
      (error) => {
        console.error(" Firestore Error:", error);
      }
    );

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (posts.length > 0) {
        setIsShow(true);
      }
    }, 3000);
  }, [posts]);

  return (
    <div className="right flex-1 mt-4 p-4">
      {isShow ? (
        <>
          {posts.length === 0 ? (
            <p className="text-center text-gray-500">No videos found.</p>
          ) : (
            posts.map((post) => (
              <Post
                key={post.id}
                caption={post.caption}
                company={post.company}
                video={post.videoUrl}
                profileImage={post.profileImage}
                topic={post.topic}
                timestamp={post.timestamp}
                username={post.username}
                userId={post.userId}
                songName={post.songName}
                id={post.id}
              />
            ))
          )}
        </>
      ) : (
        <Skeleton />
      )}
    </div>
  );
};

export default RightHandSide;
