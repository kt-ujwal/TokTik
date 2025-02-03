import React, { useState, useEffect, useRef } from "react";
import { MdDelete } from "react-icons/md";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";

import useSelectFile from "../hooks/useSelectFile";
import { auth, firestore, storage } from "../firebase/firebase";

const CreateVideo = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const { selectedFile, setSelectedFile, onSelectedFile, filePreview } = useSelectFile();
  const selectedFileRef = useRef(null);

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user]);

  const handlePost = async () => {
    if (!caption || !selectedFile) {
      toast.error("Please add a caption and select a video");
      return;
    }

    setLoading(true);
    console.log("Uploading video...");

    try {
      const docRef = await addDoc(collection(firestore, "posts"), {
        userId: user?.uid,
        username: user?.displayName,
        caption,
        profileImage: user?.photoURL || "/default-avatar.png",
        timestamp: serverTimestamp(),
        likes: [],
        comments: [],
      });

      const storageRef = ref(storage, `videos/${docRef.id}.mp4`);
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Upload failed:", error);
          toast.error("Upload failed. Try again.");
          setLoading(false);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          await updateDoc(doc(firestore, "posts", docRef.id), {
            videoUrl: downloadUrl,
          });

          setCaption("");
          setSelectedFile(null);
          setLoading(false);
          toast.success("Video uploaded successfully!");
          router.push("/");
        }
      );
    } catch (error) {
      console.error("Error uploading video:", error);
      toast.error("Something went wrong. Try again.");
      setLoading(false);
    }
  };

  const handleDiscard = () => {
    setCaption("");
    setSelectedFile(null);
  };

  return (
    <div className="flex w-full h-full absolute left-0 top-[60px] lg:top-[70px] mb-10 pt-2 lg:pt-8 justify-center">
      <Toaster />
      <div className="bg-white rounded-lg xl:h-[80vh] flex gap-6 flex-wrap justify-center items-center p-14 pt-6">
        <div>
          <p className="text-2xl font-bold">Upload Video</p>
          <p className="text-md text-gray-400 mt-1">Post a video to your account</p>

          <div className="border-dashed rounded-xl border-4 border-gray-200 flex flex-col justify-center items-center outline-none mt-10 w-[260px] h-[400px] pl-10 pr-10 cursor-pointer hover:border-red-300 hover:bg-gray-100">
            {loading ? (
              <p className="text-xl font-semibold text-gray-600">Uploading...</p>
            ) : (
              <div>
                {!selectedFile ? (
                  <label className="cursor-pointer">
                    <div className="flex flex-col items-center justify-center h-full">
                      <p className="text-xl font-semibold">Select video to upload</p>
                      <input
                        type="file"
                        name="upload-video"
                        ref={selectedFileRef}
                        className="w-0 h-0"
                        onChange={onSelectedFile}
                        accept="video/*"
                      />
                    </div>
                  </label>
                ) : (
                  <div className="rounded-3xl w-[300px] p-4 flex flex-col gap-6 justify-center items-center">
                    {filePreview ? (
                      <video className="rounded-xl h-[383px] w-[245px] mt-16 bg-black" controls loop src={filePreview} />
                    ) : (
                      <p className="text-red-500">Invalid file format</p>
                    )}
                    <button
                      type="button"
                      className="rounded-full bg-gray-200 text-red-400 p-2 text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                      onClick={() => setSelectedFile(null)}
                    >
                      <MdDelete />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 mt-8">
            <label className="text-md font-medium">Caption</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="rounded lg:w-650 outline-none text-md border-2 border-gray-200 p-2"
              placeholder="Enter a caption..."
            />
          </div>

          <div className="flex gap-6 mt-6">
            <button
              onClick={handleDiscard}
              type="button"
              className="border-gray-300 border-2 text-md font-medium p-2 rounded w-28 lg:w-44 outline-none"
            >
              Discard
            </button>
            <button
              onClick={handlePost}
              type="button"
              className="text-white font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l text-lg rounded-lg px-5 cursor-pointer"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateVideo;
