import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "@/components/layouts/RootLayout";
import HomePage from "@/pages/HomePage";
import SharePage from "@/pages/SharePage";
import HowItWorksPage from "@/pages/HowItWorks";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      // public routes
      { path: "", element: <HomePage /> },
      { path: "/share", element: <SharePage /> },
      { path: "/how-it-works", element: <HowItWorksPage /> },
    ],
  },
]);

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
