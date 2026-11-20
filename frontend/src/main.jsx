
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
import AdminDashboard from "./pages/AdminDashboard";
import AdoptionRequests from "./pages/AdoptionRequests";
import AddPet from "./pages/AddPet";
import AdminPets from "./pages/AdminPets";
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
        path: "admin",
        element: <Admin />,
        children: [
          {
            index: true,
            element: <AdminDashboard />,
          },
          {
            path: "pets",
            element: <AdminPets />,
          },
          {
            path: "pets/new",
            element: <AddPet />,
          },
          {
            path: "adoption-requests",
            element: <AdoptionRequests />,
          },
        ],
      },
      {
        path: "adminhome",
        element: (
          <Admin>
            <AdminDashboard />
          </Admin>
        ),
      },
      {
        path: "adoptionrequests",
        element: (
          <Admin>
            <AdoptionRequests />
          </Admin>
        ),
      },
      {
        path: "addpet",
        element: (
          <Admin>
            <AddPet />
          </Admin>
        ),
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

