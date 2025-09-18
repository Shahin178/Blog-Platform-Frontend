// src/redux/slices/blogSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

// Fetch all posts
export const fetchPosts = createAsyncThunk(
  "blogs/fetchPosts",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/blog/allPost");
      return data.posts || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to load posts"
      );
    }
  }
);

// Create new post
export const createPost = createAsyncThunk(
  "blogs/createPost",
  async (postData, thunkAPI) => {
    try {
      const { data } = await api.post("/blog/createPost", postData, {
        headers: { Authorization: `Bearer ${thunkAPI.getState().auth.token}` },
      });
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to create post"
      );
    }
  }
);

const blogSlice = createSlice({
  name: "blogs",
  initialState: {
    posts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload.post); // insert new post at top
      });
  },
});

export default blogSlice.reducer;
