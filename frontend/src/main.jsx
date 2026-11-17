
import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import App from "./App";
import Adoption from "./pages/Adoption";
import "./index.css";
import Home from "./pages/Home";
import Assistant from "./pages/Assistant";
import Auth from "./pages/Auth";
import PetRequest from "./pages/petRequest";
import Admin from "./pages/Admin";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "adoption",
        element: <Adoption />,
      },
      {
        path: "login",
        element: <Auth />,
      },
      {
        path: "assistant",
        element: <Assistant />,
      },
      {
         path: 'adopt/:petId',
         element: <PetRequest />,
      },
      {
        path:'admin',
        element:<Admin/>
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

