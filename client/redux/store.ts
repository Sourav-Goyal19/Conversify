import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/user/user/userSlice";
import socketSlice from "./slices/socket/socketSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    socket: socketSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
