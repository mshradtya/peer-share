import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "@/components/layouts/RootLayout";
import HomePage from "@/pages/HomePage";
import SharePage from "@/pages/SharePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      // public routes
      { path: "", element: <HomePage /> },
      { path: "/share", element: <SharePage /> },
    ],
  },
]);

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
