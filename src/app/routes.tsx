import { createBrowserRouter } from "react-router";
import type { ReactNode } from "react";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Onboarding } from "./screens/Onboarding";
import { Login } from "./screens/Login";
import { Home } from "./screens/Home";
import { TryOnUploadPhoto } from "./screens/TryOnUploadPhoto";
import { TryOnUploadClothing } from "./screens/TryOnUploadClothing";
import { TryOnGenerating } from "./screens/TryOnGenerating";
import { TryOnResult } from "./screens/TryOnResult";
import { Wardrobe } from "./screens/Wardrobe";
import { Profile } from "./screens/Profile";
import { Premium } from "./screens/Premium";

function protectedScreen(Component: () => ReactNode) {
  return function ProtectedScreen() {
    return (
      <ProtectedRoute>
        <Component />
      </ProtectedRoute>
    );
  };
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Onboarding,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/home",
    Component: Home,
  },
  {
    path: "/try-on/upload-photo",
    Component: protectedScreen(TryOnUploadPhoto),
  },
  {
    path: "/try-on/upload-clothing",
    Component: protectedScreen(TryOnUploadClothing),
  },
  {
    path: "/try-on/generating",
    Component: protectedScreen(TryOnGenerating),
  },
  {
    path: "/try-on/result",
    Component: protectedScreen(TryOnResult),
  },
  {
    path: "/wardrobe",
    Component: protectedScreen(Wardrobe),
  },
  {
    path: "/profile",
    Component: protectedScreen(Profile),
  },
  {
    path: "/premium",
    Component: protectedScreen(Premium),
  },
]);
