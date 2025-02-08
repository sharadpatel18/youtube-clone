import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import axios from "axios";
import { MyContext } from "@/context/MyContext";

const CommentsSection = ({ videoId }) => {
  const { user } = useContext(MyContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
    
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/api/video-backend/getComments/${videoId}`);
        if (res.data) {
          setComments(res.data.comments);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchComments();
  }, []);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(`/api/video-backend/commentHandle`, {
        videoId: videoId,
        userId: user.id,
        username: user.name,
        comment: newComment,
      });

      if (res.status === 200) {
        setComments([...comments, res.data.comment]);
        setNewComment("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mt-6 bg-gray-900 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Comments</h2>

      {/* Comment Input Box */}
      <div className="flex items-center space-x-3 mb-4">
        <Image src="/profile.jpg" alt="User" width={40} height={40} className="rounded-full" />
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 bg-gray-800 text-white p-2 rounded-lg focus:outline-none"
        />
        <button
          onClick={handleCommentSubmit}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 text-white rounded-lg"
        >
          Comment
        </button>
      </div>

      {/* Display Comments */}
      {comments.length > 0 ? (
        comments.map((comment, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 border-b border-gray-700">
            <Image src="/profile.jpg" alt="User" width={40} height={40} className="rounded-full" />
            <div>
              <p className="font-semibold text-white">{comment?.username}</p>
              <p className="text-gray-400">{comment?.comment}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-400">No comments yet. Be the first to comment!</p>
      )}
    </div>
  );
};

export default CommentsSection;
