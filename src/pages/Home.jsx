import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../utils/blogSlice";
import api from "../api";
import toast from "react-hot-toast";
import { FaBookmark, FaRegBookmark, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const { posts, loading, error } = useSelector((state) => state.blogs);
  const { token, isAuthenticated, user } = useSelector((state) => state.auth);

  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Fetch posts
  useEffect(() => {
    if (isAuthenticated && token) {
      dispatch(fetchPosts());
    } else {
      navigate("/login");
    }
  }, [isAuthenticated, token, navigate, dispatch]);

  // Handle bookmark
  const handleBookmark = async (id) => {
    try {
      await api.post(`blog/bookmarkPost/${id}`);
      toast.success("Bookmark updated");

      // Refresh posts from server so UI is always correct
      dispatch(fetchPosts());
    } catch (err) {
      console.error("Bookmark error:", err);
      toast.error("Failed to bookmark post");
    }
  };


  // Filtered posts
  const filteredPosts = posts.filter((post) => {
    const titleMatch = post.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const tagMatch =
      post.tags &&
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return titleMatch || tagMatch;
  });

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Search bar */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search blogs..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // reset page on search
          }}
          className="w-full max-w-md p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Loading and Error */}
      {loading && <p className="text-gray-600 text-center">Loading posts...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* No Results */}
      {!loading && filteredPosts.length === 0 && (
        <p className="text-gray-500 text-center text-lg mt-8">
          No blogs found. Try a different search!
        </p>
      )}

      {/* Blog Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentPosts.map((post) => (
          <div
            key={post._id}
            onClick={() => navigate(`/blog/${post._id}`)}
            className="relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition group cursor-pointer"
          >
            {/* Post Image */}
            {post.image ? (
              <img
                src={post.image}
                alt={post.title}
                className="h-48 w-full object-cover"
              />
            ) : (
              <div className="h-48 w-full bg-gradient-to-r from-purple-200 to-blue-200 flex items-center justify-center text-gray-600">
                No Image
              </div>
            )}

            {/* Post Content */}
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                {post.title}
              </h2>
              <p className="text-sm text-gray-600">
                By {post.author?.name || "Unknown"} •{" "}
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Hover Icons (bookmark + views) */}
            <div
              className="absolute bottom-3 right-3 flex items-center space-x-3 opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()} // prevent navigation when clicking icons
            >
              {/* Views */}
              <div className="flex items-center text-sm text-gray-500 space-x-1 bg-white px-2 py-1 rounded-full shadow">
                <FaEye className="text-gray-400" />
                <span>{post.views || 0}</span>
              </div>

              {/* Bookmark */}
              <button
                onClick={() => handleBookmark(post._id)}
                className="p-2 rounded-full bg-white shadow hover:bg-gray-100"
              >
                {post.bookmarks?.includes(user?.id) ? (
                  <FaBookmark className="text-purple-600" />
                ) : (
                  <FaRegBookmark className="text-gray-500" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded-lg ${
                currentPage === i + 1
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
