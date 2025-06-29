import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

function Landing() {
  const [time, setTime] = useState(new Date());
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const today = new Date();
  const currentDay = days[today.getDay()];
  const todate = new Date();

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = todate.toLocaleDateString("en-US", options);

  function formatTime() {
    let hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    hours = hours % 12 || 12;

    return `${addZero(hours)}:${addZero(minutes)}:${addZero(seconds)} ${
      time.getHours() >= 12 ? "PM" : "AM"
    }`;
  }

  function addZero(n) {
    return (n < 10 ? "0" : "") + n;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <div className="max-w-4xl flex-col flex mx-auto mb-12">
        <div className="text-2xl">
          <h1 className="text-9xl font-bold bg-gradient-to-r h-25 from-pink-500 via-purple-500 to-indigo-500 inline-block text-transparent bg-clip-text mb-6">TimeSync</h1>
        </div>
        <div className="text-5xl text-gray-600 mb-8 font-mono ">
          {formatTime()}
        </div>
        <div className="text-5xl text-gray-600 mb-8 font-mono ">
          {formattedDate}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-16">
        <div className="bg-white/90 rounded-3xl p-8 shadow-lg backdrop-blur-sm border border-white/30 hover:scale-105 transition-transform duration-300">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-300 to-purple-400 rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="35"
              height="354"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-alarm-clock-icon lucide-alarm-clock"
            >
              <circle cx="12" cy="13" r="8" />
              <path d="M12 9v4l2 2" />
              <path d="M5 3 2 6" />
              <path d="m22 6-3-3" />
              <path d="M6.38 18.7 4 21" />
              <path d="M17.64 18.67 20 21" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Smart Alarms
          </h3>
          <p className="text-gray-600 text-sm">
            Set customizable alarms with multiple tones. Never miss important
            meetings or tasks.
          </p>
          <NavLink to={"Alarm"}>
            <div className="text-blue-600 underline hover:cursor-pointer mt-8">
              Set Alarms
            </div>
          </NavLink>
        </div>

        <div className="bg-white/90 rounded-3xl p-8 shadow-lg backdrop-blur-sm border border-white/30 hover:scale-105 transition-transform duration-300">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-300 to-purple-400 rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="35"
              height="35"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-clock-icon lucide-clock"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3 ">
            World Clock
          </h3>
          <p className="text-gray-600 text-sm">
            Check time in any city worldwide. Perfect for remote teams and
            international coordination.
          </p>
          <NavLink to={"DigitalClock"}>
            <div className="text-blue-600 underline hover:cursor-pointer mt-3">
              View World Clock
            </div>
          </NavLink>
        </div>

        <div className="bg-white/90 rounded-3xl p-8 shadow-lg backdrop-blur-sm border border-white/30 hover:scale-105 transition-transform duration-300">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-300 to-purple-400 rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="35"
              height="35"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-hourglass-icon lucide-hourglass"
            >
              <path d="M5 22h14" />
              <path d="M5 2h14" />
              <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
              <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Precision Timer
          </h3>
          <p className="text-gray-600 text-sm">
            Set precise countdown timers for productivity sessions, cooking, or
            any timed activity.
          </p>
          <NavLink to={"Timer"}>
            <div className="text-blue-600 underline hover:cursor-pointer mt-8">
              Use Timer
            </div>
          </NavLink>
        </div>

        <div className="bg-white/90 rounded-3xl p-8 shadow-lg backdrop-blur-sm border border-white/30 hover:scale-105 transition-transform duration-300">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-300 to-purple-400 rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="35"
              height="35"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-timer-icon lucide-timer"
            >
              <line x1="10" x2="14" y1="2" y2="2" />
              <line x1="12" x2="15" y1="14" y2="11" />
              <circle cx="12" cy="14" r="8" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Stopwatch
          </h3>
          <p className="text-gray-600 text-sm">
            Track elapsed time with precision. Perfect for workouts, races, or
            time tracking.
          </p>
          <NavLink to={"Stopwatch"}>
            <div className="text-blue-600 underline hover:cursor-pointer mt-8">
              Use Stopwatch{" "}
            </div>
          </NavLink>
        </div>
      </div>
      <div className="bg-white/90 rounded-3xl p-12 shadow-xl backdrop-blur-sm border border-white/30 max-w-3xl mx-auto mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Ready to Master Time?
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Choose any tool from the sidebar to get started. Simple, intuitive,
          and always accurate.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="flex items-center space-x-2 bg-gradient-to-r from-pink-100 to-purple-100 px-4 py-2 rounded-full">
            <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
            <span className="text-sm text-gray-700">
              No signing-in required
            </span>
          </div>
          <div className="flex items-center space-x-2 bg-gradient-to-r from-pink-100 to-purple-100 px-4 py-2 rounded-full">
            <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
            <span className="text-sm text-gray-700">Syncs across devices</span>
          </div>
          <div className="flex items-center space-x-2 bg-gradient-to-r from-pink-100 to-purple-100 px-4 py-2 rounded-full">
            <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
            <span className="text-sm text-gray-700">Completely free</span>
          </div>
        </div>
      </div>

      <footer className="text-center w-screen text-gray-500 text-sm py-6 border-t bg-pink-100 backdrop-blur-sm shadow-inner">
        <p>
          © {new Date().getFullYear()} TimeSync. Crafted with care by Shree
          Vishnu A.
        </p>
        <p>
          <a
            href="https://github.com/Shree-Vishnua/Clock"
            className="text-blue-500 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}

export default Landing;
