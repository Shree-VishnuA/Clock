import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout";
import Stopwatch from "./Stopwatch.jsx"
import DigitalClock from "./DigitalClock.jsx"
import Timer from "./Timer.jsx"
import Alarm from "./Alarm.jsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout></Layout>,
    children: [
      {
        path: "Stopwatch",
        element: <Stopwatch></Stopwatch>,
      },
      {
        path: "DigitalClock",
        element: <DigitalClock></DigitalClock>,
      },
      {
        path: "Alarm",
        element: <Alarm></Alarm>,
      },
      {
        path: "Timer",
        element: <Timer></Timer>,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router}></RouterProvider>
);
