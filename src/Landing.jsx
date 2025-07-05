import React, { useEffect, useState } from "react";

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
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 bg-stone-400 dark:bg-stone-900 from-stone-400 via-slate-400 to-stone-400 dark:from-stone-800 dark:via-slate-800 dark:to-stone-800">
      <div className="max-w-4xl flex-col flex mb-8 sm:mb-12">
        <div>
          <h1
            className="font-bold text-slate-600 dark:text-slate-200 mb-4 sm:mb-6 leading-tight"
            style={{ fontSize: "clamp(2.5rem, 6vw, 8rem)" }}
          >
            TimeSync
          </h1>
        </div>
        <div className="bg-amber-50 dark:bg-slate-800 px-4 sm:px-6 pt-4 sm:pt-6 pb-2 sm:pb-4 rounded-xl shadow-2xl shadow-stone-600 dark:shadow-slate-800">
          <div className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-slate-600 dark:text-white mb-4 sm:mb-6 md:mb-8 digital font-mono">
            {formatTime()}
          </div>
          <div className="text-lg sm:text-2xl md:text-3xl lg:text-5xl text-slate-600 dark:text-gray-300 mb-4 sm:mb-6 md:mb-8 leading-tight">
            {formattedDate}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 w-6xl mx-auto mb-8 sm:mb-12 lg:mb-16 w-full">
        <div className="bg-white/90 dark:bg-slate-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg backdrop-blur-sm border border-white/30 dark:border-slate-600 hover:scale-102 transition-transform duration-300">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-400 dark:bg-slate-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="sm:w-8 sm:h-8 text-white"
            >
              <circle cx="12" cy="13" r="8" />
              <path d="M12 9v4l2 2" />
              <path d="M5 3 2 6" />
              <path d="m22 6-3-3" />
              <path d="M6.38 18.7 4 21" />
              <path d="M17.64 18.67 20 21" />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 sm:mb-3">
            Smart Alarms
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 sm:mb-6 leading-relaxed">
            Set customizable alarms with multiple tones. Never miss important
            meetings or tasks.
          </p>
          <button className="text-blue-600 dark:text-blue-400 underline hover:cursor-pointer hover:text-blue-800 dark:hover:text-blue-300 transition-colors bg-transparent border-none p-0 font-inherit">
            Set Alarms
          </button>
        </div>

        <div className="bg-white/90 dark:bg-slate-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg backdrop-blur-sm border border-white/30 dark:border-slate-600 hover:scale-102 transition-transform duration-300">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-400 dark:bg-slate-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="sm:w-8 sm:h-8 text-white"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 sm:mb-3">
            World Clock
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 sm:mb-6 leading-relaxed">
            Check time in any city worldwide. Perfect for remote teams and
            international coordination.
          </p>
          <button className="text-blue-600 dark:text-blue-400 underline hover:cursor-pointer hover:text-blue-800 dark:hover:text-blue-300 transition-colors bg-transparent border-none p-0 font-inherit">
            View World Clock
          </button>
        </div>

        <div className="bg-white/90 dark:bg-slate-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg backdrop-blur-sm border border-white/30 dark:border-slate-600 hover:scale-102 transition-transform duration-300">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-400 dark:bg-slate-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="sm:w-8 sm:h-8 text-white"
            >
              <path d="M5 22h14" />
              <path d="M5 2h14" />
              <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
              <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 sm:mb-3">
            Precision Timer
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 sm:mb-6 leading-relaxed">
            Set precise countdown timers for productivity sessions, cooking, or
            any timed activity.
          </p>
          <button className="text-blue-600 dark:text-blue-400 underline hover:cursor-pointer hover:text-blue-800 dark:hover:text-blue-300 transition-colors bg-transparent border-none p-0 font-inherit">
            Use Timer
          </button>
        </div>

        <div className="bg-white/90 dark:bg-slate-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg backdrop-blur-sm border border-white/30 dark:border-slate-600 hover:scale-102 transition-transform duration-300">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-400 dark:bg-slate-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="sm:w-8 sm:h-8 text-white"
            >
              <line x1="10" x2="14" y1="2" y2="2" />
              <line x1="12" x2="15" y1="14" y2="11" />
              <circle cx="12" cy="14" r="8" />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 sm:mb-3">
            Stopwatch
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 sm:mb-6 leading-relaxed">
            Track elapsed time with precision. Perfect for workouts, races, or
            time tracking.
          </p>
          <button className="text-blue-600 dark:text-blue-400 underline hover:cursor-pointer hover:text-blue-800 dark:hover:text-blue-300 transition-colors bg-transparent border-none p-0 font-inherit">
            Use Stopwatch
          </button>
        </div>
      </div>

      <div className="bg-white/90 dark:bg-slate-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xl backdrop-blur-sm border border-white/30 dark:border-slate-600 max-w-3xl mx-auto mb-6 sm:mb-8 lg:mb-10 w-full">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4">
          Ready to Master Time?
        </h2>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 leading-relaxed">
          Choose any tool from above to get started. Simple, intuitive, and
          always accurate.
        </p>
        <div className="flex flex-col items-center sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
          <div className="flex items-center justify-center space-x-2 bg-gradient-to-r dark:from-stone-700 dark:to-slate-700 from-stone-300 to-slate-300 px-3 sm:px-4 py-2 rounded-full">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-stone-600 dark:bg-stone-400 rounded-full flex-shrink-0"></div>
            <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-200">
              No sign-up required
            </div>
          </div>
          <div className="flex items-center justify-center space-x-2 bg-gradient-to-r dark:from-stone-700 dark:to-slate-700 from-stone-300 to-slate-300 px-3 sm:px-4 py-2 rounded-full">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-stone-600 dark:bg-stone-400 rounded-full flex-shrink-0"></div>
            <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-200">
              Syncs across devices
            </span>
          </div>
          <div className="flex items-center justify-center space-x-2 bg-gradient-to-r dark:from-stone-700 dark:to-slate-700 from-stone-300 to-slate-300 px-3 sm:px-4 py-2 rounded-full">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-stone-600 dark:bg-stone-400 rounded-full flex-shrink-0"></div>
            <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-200">
              Completely free
            </span>
          </div>
        </div>
      </div>

      <footer className="text-center w-full text-gray-500 dark:text-gray-400 text-xs sm:text-sm py-4 sm:py-6 border-t bg-stone-200 dark:bg-stone-800 backdrop-blur-sm shadow-inner px-4">
        <p className="mb-2">
          © {new Date().getFullYear()} TimeSync. Crafted with care by Shree
          Vishnu A.
        </p>
        <p>
          <a
            href="https://github.com/Shree-Vishnua/Clock"
            className="text-blue-500 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
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
