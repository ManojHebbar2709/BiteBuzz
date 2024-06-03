import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Pages/Home.jsx";
import Login from "./Pages/Login.jsx";
import { ThemeProvider } from "./darkmodecontext.jsx";
import MainPage from "./Pages/MainPage.jsx";
import Root from "./Root.jsx";
import { isAuthLoader } from "./Loaders.js";
import { LoginAction } from "./Actions.js";
import Settings from "./Pages/Settings.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    loader: isAuthLoader,
    element: <Root />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
    ],
  },
  { path: "/home", element: <Home /> },
  { path: "/login", element: <Login />, action: LoginAction },
  { path: "/settings", element: <Settings /> },
]);

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;