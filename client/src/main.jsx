import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthLayout, ChangePassword, ShowNavbar, Successmsg, UpdateAccount } from "./components/index.js";
import { Register, Home, Login, Profile, Video, Settings } from "./pages/index.js";
import { Provider } from "react-redux";
import store from "./app/store.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ShowNavbar>
        <App />
      </ShowNavbar>
    ),
    children: [
      {
        path: "/",
        element: <Register />,
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
        path: "/home",
        element: (
          <AuthLayout authentication>
            <Home />
          </AuthLayout>
        ),
      },
      {
        path: "/profile",
        element: (
          <AuthLayout authentication>
            <Profile />
          </AuthLayout>
        ),
      },
      {
        path: "/video/:id",
        element : (
          <AuthLayout authentication>
            <Video/>
          </AuthLayout>
        )
      },
      {
        path: "/settings",
        element : (
          <AuthLayout authentication>
            <Settings/>
          </AuthLayout>
        )
      },
      {
        path : "/change-password",
        element : (
          <AuthLayout authentication>
            <ChangePassword />
          </AuthLayout>
        )
      },
      {
        path : "/update-account",
        element : (
          <AuthLayout authentication>
            <UpdateAccount />
          </AuthLayout>
        )
      },
      {
        element : (<Successmsg text/>)
      }
    ],
  },
]);


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </Provider>
  </StrictMode>
);
