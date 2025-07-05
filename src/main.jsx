import { createRoot } from "react-dom/client";
import "./index.css";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout";
import Stopwatch from "./Stopwatch.jsx";
import DigitalClock from "./DigitalClock.jsx";
import Timer from "./Timer.jsx";
import Alarm from "./Alarm.jsx";
import Landing from "./Landing.jsx";
import { ClockProvider } from "./ClockContext"; // ✅ Import ClockProvider

const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "Stopwatch",
        element: <Stopwatch />,
      },
      {
        path: "DigitalClock",
        element: <DigitalClock />,
      },
      {
        path: "Alarm",
        element: <Alarm />,
      },
      {
        path: "Timer",
        element: <Timer />,
      },
    ],
  },
]);

// ✅ Wrap RouterProvider in ClockProvider
createRoot(document.getElementById("root")).render(
  <ClockProvider>
    <RouterProvider router={router} />
  </ClockProvider>
);
