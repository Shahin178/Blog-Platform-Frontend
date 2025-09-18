import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../api";
import toast from "react-hot-toast";
import {
  FaUserCircle,
  FaRegBookmark,
  FaBookmark,
  FaTrash,
  FaEdit,
} from "react-icons/fa";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  // Fetch post
 useEffect(() => {
   const fetchPost = async () => {
     try {
       const { data } = await api.get(`/blog/post/${id}`);
       setPost(data.post);

       const userId = user?.id;
       
       const bookmarks = data.post.bookmarks || [];
       console.log("bookmarks:", bookmarks);
       setBookmarked(userId ? bookmarks.includes(userId) : false);
     } catch (err) {
       console.error("Error fetching blog:", err);
       toast.error("Failed to load blog");
     } finally {
       setLoading(false);
     }
   };
   fetchPost();
 }, [id, user?._id]);

  // Bookmark
 const handleBookmark = async () => {
   if (!user?.id) {
     toast.error("You must be logged in to bookmark.");
     return;
   }

   try {
     const data = await api.post(`/blog/bookmarkPost/${id}`);
     console.log("Bookmark response:", data);
     
     // Toggle bookmark state after successful API call
     setBookmarked((prev) => !prev);
     toast.success(
       bookmarked ? "Removed from bookmarks" : "Added to bookmarks"
     );
   } catch (err) {
     console.error(err);
     toast.error("Failed to update bookmark");
   }
 };

  // Delete Post (with confirmation popup)
  const confirmDelete = async () => {
    try {
      await api.delete(`/blog/deletePost/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Post deleted");
      navigate("/home");
    } catch {
      toast.error("Failed to delete post");
    } finally {
      setShowDeletePopup(false);
    }
  };

  // Add Comment
  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      const res = await api.post(
        `/blog/post/${id}/comment`,
        { text: commentText });
      setPost((prev) => ({ ...prev, comments: res.data.comments }));
      setCommentText("");
    } catch {
      toast.error("Failed to add comment");
    }
  };

  // Delete Comment
  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Delete this comment?")) {
      try {
        await api.delete(`/blog/post/${id}/comment/${commentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPost((prev) => ({
          ...prev,
          comments: prev.comments.filter((c) => c._id !== commentId),
        }));
      } catch {
        toast.error("Failed to delete comment");
      }
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (!post) return <p className="text-center text-red-500">Post not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg mt-6">
      {/* Blog Image */}
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-64 object-cover rounded-md mb-4"
        />
      )}

      {/* Title & Actions */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
        <div className="flex items-center space-x-3">
          {/* Bookmark */}
          <button
            onClick={handleBookmark}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
          >
            {bookmarked ? (
              <FaBookmark className="text-purple-600" />
            ) : (
              <FaRegBookmark className="text-gray-600" />
            )}
          </button>

          {/* Edit/Delete only for author */}
          {user?.id === post.author?._id && (
            <>
              <button
                onClick={() =>
                  navigate(`/blog/edit/${post._id}`, { state: post })
                }
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <FaEdit className="text-blue-600" />
              </button>
              <button
                onClick={() => setShowDeletePopup(true)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <FaTrash className="text-red-600" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Author Info */}
      <div className="flex items-center space-x-3 mb-4">
        {post.author?.profilePicture ? (
          <img
            src={post.author.profilePicture}
            alt={post.author.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <FaUserCircle className="w-10 h-10 text-gray-400" />
        )}
        <div>
          <p className="font-medium text-gray-800">
            {post.author?.name || "Unknown Author"}
          </p>
          <p className="text-sm text-gray-500">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Blog Content */}
      <div
        className="prose max-w-none mb-6"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-sm"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Comments Section */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Comments</h2>

        {/* Add Comment */}
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 p-2 border rounded-lg"
          />
          <button
            onClick={handleAddComment}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Post
          </button>
        </div>

        {/* List Comments */}
        {post.comments?.length > 0 ? (
          post.comments.map((comment) => (
            <div key={comment._id} className="flex items-start space-x-3 mb-3">
              {comment.user?.profilePicture ? (
                <img
                  src={comment.user.profilePicture}
                  alt={comment.user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <FaUserCircle className="w-8 h-8 text-gray-400" />
              )}
              <div className="bg-gray-100 px-3 py-2 rounded-lg flex-1">
                <p className="font-medium text-gray-800">
                  {comment.user?.name || "User"}
                </p>
                <p className="text-gray-700">{comment.text}</p>
              </div>
              {(user?.id === comment.user?._id ||
                user?._id === post.author?._id) && (
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className="p-1 rounded-full hover:bg-gray-200"
                >
                  <FaTrash className="text-red-600 text-sm" />
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No comments yet</p>
        )}
      </div>

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h3 className="text-lg font-semibold mb-4">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeletePopup(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDetail;
