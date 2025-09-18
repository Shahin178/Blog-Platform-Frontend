import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Toaster, toast } from "react-hot-toast";
import api from "../api.js";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useNavigate } from "react-router-dom";

const initialState = {
  title: "",
  content: "",
  tags: "",
  image: "",
};

const WritePost = () => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "blog-platform");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/doltg5a9m/image/upload",
        { method: "POST", body: data }
      );
      const imgData = await res.json();
      if (imgData.secure_url) {
        setForm({ ...form, image: imgData.secure_url });
        toast.success("Image uploaded!");
      }
    } catch {
      toast.error("Image upload failed.");
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post("/blog/createPost", {
        title: form.title,
        content: form.content,
        tags: form.tags.split(",").map((tag) => tag.trim()),
        image: form.image,
      });
      console.log("Post created:", data);
      toast.success("Post created!");
      navigate("/home");
      setForm(initialState);
    } catch (err) {
      toast.error("Failed to create post.");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(93vh-64px)] bg-gradient-to-br from-blue-50 to-purple-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Write a New Post
        </h2>
        <div className="space-y-4">
          <div className="flex flex-col items-center">
            {!form.image ? (
              <label
                htmlFor="image"
                className="cursor-pointer flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl shadow hover:from-purple-600 hover:to-blue-600 transition mb-2"
                title="Upload Image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M4 12V8a2 2 0 012-2h12a2 2 0 012 2v4M16 12a4 4 0 01-8 0"
                  />
                </svg>
              </label>
            ) : (
              <div className="relative mt-2">
                <img
                  src={form.image}
                  alt="Preview"
                  className="w-75 h-50 rounded-xl object-cover shadow-lg cursor-pointer border-1"
                  onClick={() => document.getElementById("image").click()}
                  title="Change Image"
                />
                <button
                  type="button"
                  className="absolute bottom-3 right-3 bg-white rounded-full p-2 shadow hover:bg-purple-100 transition"
                  title="Edit Image"
                  onClick={() => document.getElementById("image").click()}
                  tabIndex={-1}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536M9 13l6.293-6.293a1 1 0 011.414 0l1.586 1.586a1 1 0 010 1.414L11 15H9v-2z"
                    />
                  </svg>
                </button>
              </div>
            )}
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
          </div>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
          <CKEditor
            editor={ClassicEditor}
            data={form.content}
            onChange={(_, editor) =>
              setForm({ ...form, content: editor.getData() })
            }
            config={{
              placeholder: "Write your story here...",
            }}
          />
          <input
            type="text"
            name="tags"
            placeholder="Tags (comma separated)"
            value={form.tags}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full py-2 rounded-md bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold hover:from-purple-600 hover:to-blue-600 transition shadow-lg"
        >
          {loading ? "Publishing..." : "Publish"}
        </button>
        <Toaster position="top-center" />
      </form>
    </div>
  );
};

export default WritePost;
