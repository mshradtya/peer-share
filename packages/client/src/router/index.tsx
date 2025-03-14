import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "@/components/layouts/RootLayout";
import HomePage from "@/pages/HomePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      // public routes
      { path: "", element: <HomePage /> },
    ],
  },
]);

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
