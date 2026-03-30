import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { PersistGate } from "redux-persist/integration/react";
import "./setupAxios.js"; // global axios config and 401 interceptor
import {
  AuthLayout,
  ChangePassword,
  ShowNavbar,
  UpdateAccount,
  UserTweets,
  VideoComponent,
  VideoDetails,
  VideoFile,
} from "./components/index.js";
import {
  Register,
  Home,
  Login,
  Profile,
  Video,
  AddVideo,
  AddTweet,
  Playlist,
  Subscription,
  About,
} from "./pages/index.js";
import { Provider } from "react-redux";
import { store, persistor } from "./app/store.js";
import {
  createBrowserRouter,
  RouterProvider,
  ScrollRestoration,
} from "react-router-dom";


const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ShowNavbar>
        <ScrollRestoration />
        <App />
      </ShowNavbar>
    ),
    children: [
      {
        path: "/",
        element: <About />,
      },
      {
        path: "/login",
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: "/register",
        element: (
          <AuthLayout authentication={false}>
            <Register />
          </AuthLayout>
        ),
      },
      {
        path: "/home",
        element: (
          <AuthLayout authentication>
            <Home />
          </AuthLayout>
        ),
      },
      {
        path: "/profile/:username",
        element: (
          <AuthLayout authentication>
            <Profile />
          </AuthLayout>
        ),
      },
      {
        path: "/video/:id",
        element: (
          <AuthLayout authentication>
            <Video />
          </AuthLayout>
        ),
      },
      {
        path: "/change-password",
        element: (
          <AuthLayout authentication>
            <ChangePassword />
          </AuthLayout>
        ),
      },
      {
        path: "/update-account",
        element: (
          <AuthLayout authentication>
            <UpdateAccount />
          </AuthLayout>
        ),
      },
      {
        path: "/addVideo",
        element: (
          <AuthLayout>
            <AddVideo />
          </AuthLayout>
        ),
      },
      {
        path: "/addTweet",
        element: (
          <AuthLayout>
            <AddTweet />
          </AuthLayout>
        ),
      },

      {
        path: "/playlists/:id",
        element: (
          <AuthLayout>
            <Playlist />
          </AuthLayout>
        ),
      },
      {
        path: "/subscription",
        element: (
          <AuthLayout>
            <Subscription />
          </AuthLayout>
        ),
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        element: <UserTweets />,
      },
      {
        element: <VideoFile video />,
      },
      {
        element: <VideoDetails video />,
      },
      {
        element: <VideoComponent video />,
      }
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <RouterProvider router={router}>
          <App />
        </RouterProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
