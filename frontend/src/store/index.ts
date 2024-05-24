import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user";


export const store = configureStore({
    reducer: {
        user: userReducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
          serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;