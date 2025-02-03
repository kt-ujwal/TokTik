import React from "react";
import { useRouter } from "next/router";
import DetailFeed from "../../components/DetailFeed";

const VideoDetailPage = () => {
  const router = useRouter();
  const { videoId } = router.query;

  if (!videoId) return <p className="text-center">Loading...</p>;

  return (
    <div>
      <DetailFeed videoId={videoId} />
    </div>
  );
};

export default VideoDetailPage;
