import React, { useEffect, useState } from "react";
import api from "../api"; // axios instance
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);

        const bookmarksRes = await api.get("/blog/bookmarks");
        setBookmarks(bookmarksRes.data.posts || []);

        const myPostsRes = await api.get("/blog/my-posts");
        setMyPosts(myPostsRes.data.posts || []);
      } catch (err) {
        console.error("Error fetching profile or posts:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <span className="text-lg text-gray-500 animate-pulse">
          Loading profile...
        </span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <span className="text-lg text-red-500">User not found.</span>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(93vh-64px)] max-w-6xl mx-auto py-10 px-4 space-y-12">
      {/* Profile Section */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row items-center gap-8">
        <img
          src={user.profilePicture}
          alt={user.name}
          className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
        />
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-extrabold mb-2">{user.name}</h2>
          <p className="text-sm opacity-90 mb-3">{user.email}</p>
          {user.bio && (
            <p className="text-base font-light mb-2">
              <span className="font-medium">Bio:</span> {user.bio}
            </p>
          )}
          {user.dateOfBirth && (
            <p className="text-sm opacity-90">
              <span className="font-medium">Date of Birth:</span>{" "}
              {new Date(user.dateOfBirth).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* Bookmarked Blogs */}
      <section>
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
          ⭐ Bookmarked Blogs
        </h3>
        {bookmarks.length === 0 ? (
          <p className="text-gray-500 italic">No bookmarks yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map((post) => (
              <Link
                key={post._id}
                to={`/blog/${post._id}`}
                className="group block bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100 rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 p-6 cursor-pointer"
              >
                <h4 className="text-lg font-bold text-purple-800 mb-3 group-hover:text-indigo-700 transition">
                  {post.title}
                </h4>
                <p className="text-gray-700 line-clamp-3 mb-4">
                  {post.content.replace(/<[^>]+>/g, "").slice(0, 120)}...
                </p>
                <span className="inline-block text-indigo-600 font-medium text-sm group-hover:underline">
                  Read more →
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* My Blogs */}
      <section>
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
          📝 My Blogs
        </h3>
        {myPosts.length === 0 ? (
          <p className="text-gray-500 italic">
            You haven’t written any blogs yet.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {myPosts.map((post) => (
              <div key={post._id} className="relative">
                {/* Entire card clickable */}
                <Link
                  to={`/blog/${post._id}`}
                  className="group block bg-gradient-to-r from-green-100 via-emerald-100 to-teal-100 rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 p-6 flex flex-col cursor-pointer"
                >
                  <h4 className="text-lg font-bold text-green-800 mb-3 group-hover:text-teal-700 transition">
                    {post.title}
                  </h4>
                  <p className="text-gray-700 flex-1 mb-4 line-clamp-3">
                    {post.content.replace(/<[^>]+>/g, "").slice(0, 120)}...
                  </p>
                  <span className="inline-block text-indigo-600 font-medium text-sm group-hover:underline">
                    Read more →
                  </span>
                </Link>
                
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProfilePage;
