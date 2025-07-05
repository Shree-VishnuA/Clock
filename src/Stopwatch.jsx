import { useState, useEffect, useRef ,useContext} from "react";
import { ClockContext } from "./ClockContext";

function Stopwatch() {
  const {
  stopwatchTime, setStopwatchTime,
  isStopwatchRunning, setIsStopwatchRunning,
  hasStopwatchStarted, setHasStopwatchStarted,
  stopwatchLaps, setStopwatchLaps
} = useContext(ClockContext);


  // Calculate time units from total milliseconds
  const totalSeconds = Math.floor(stopwatchTime / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((stopwatchTime % 1000) / 10);
  const lapsContainerRef = useRef(null);

  useEffect(() => {
    if (lapsContainerRef.current) {
      lapsContainerRef.current.scrollTop =
        lapsContainerRef.current.scrollHeight;
    }
  }, [stopwatchLaps]);

  function handleToggle() {
    setIsStopwatchRunning(!isStopwatchRunning);
    if (!hasStopwatchStarted) {
      setHasStopwatchStarted(true); // Mark as started when first clicked
    }
  }

  function handleReset() {
    setStopwatchTime(0);
    setIsStopwatchRunning(false);
    setHasStopwatchStarted(false); // Reset the started state
    setStopwatchLaps([]); // Clear laps when resetting
  }

  function addZero(n) {
    return (n < 10 ? "0" : "") + n;
  }

  function formatstopwatchTime(h, m, s, cs) {
    let stopwatchTimeStr = "";
    if (h > 0) {
      stopwatchTimeStr += addZero(h) + ":";
    }
    if (h > 0 || m > 0) {
      stopwatchTimeStr += addZero(m) + ":";
    }
    stopwatchTimeStr += addZero(s) + "." + addZero(cs);
    return stopwatchTimeStr;
  }

  function handleLap() {
    if (isStopwatchRunning) {
      const newLap = {
        id: stopwatchLaps.length + 1,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        centiseconds: centiseconds,
        totalTime: stopwatchTime,
      };
      setStopwatchLaps([...stopwatchLaps, newLap]);
    }
  }

  useEffect(() => {
    let interval;
    if (isStopwatchRunning) {
      interval = setInterval(() => {
        setStopwatchTime((prevTime) => prevTime + 10);
      }, 10);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isStopwatchRunning]);

  return (
   <div className="bg-pink-100 dark:bg-stone-900">
  <div className="flex flex-col gap-4 sm:gap-8 items-center p-4 sm:p-2 sm:h-screen bg-gradient-to-tl from-stone-400 via-slate-400 to-stone-400 dark:from-stone-800 dark:via-slate-800 dark:to-stone-800 min-h-screen">
    <div className="relative">
      {isStopwatchRunning && (
        <div
          className="absolute inset-0 rounded-full animate-spin"
          style={{
            background:
              "conic-gradient(from 0deg, #3b02f6, #60a0fa, #93c5fd, #dbeafe, #3b82f0)",
            padding: "4px",
          }}
        >
          <div className="w-full h-full bg-white dark:bg-slate-800 rounded-full"></div>
        </div>
      )}

      <div
        className={`relative border-4 py-8 px-12 sm:py-12 md:py-16 sm:px-16 md:px-20 rounded-full bg-white/90 dark:bg-slate-800 shadow-lg backdrop-blur-sm ${
          isStopwatchRunning ? "border-slate-400 dark:border-slate-600" : "border-gray-400 dark:border-slate-600"
        }`}
      >
        <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-black dark:text-white font-mono flex flex-col items-center">
          <div className="flex justify-center">
            {hours > 0 ? addZero(hours) + ":" : ""}
            {hours > 0 || minutes > 0 ? addZero(minutes) + ":" : ""}
            {addZero(seconds)}
          </div>
          <div className="text-lg sm:text-xl md:text-2xl flex justify-center mt-1 sm:mt-2">
            {addZero(centiseconds)}
          </div>
        </div>
      </div>
    </div>

    <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 justify-center w-full max-w-sm sm:max-w-none">
      <button
        onClick={handleToggle}
        className={`px-6 sm:px-8 py-3 text-lg sm:text-xl font-semibold rounded-lg transition-colors ${
          isStopwatchRunning
            ? "bg-white dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 text-black dark:text-white"
            : "bg-slate-600 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white"
        }`}
      >
        {isStopwatchRunning ? "Stop" : hasStopwatchStarted ? "Resume" : "Start"}
      </button>

      <button
        onClick={handleReset}
        className="px-6 sm:px-8 py-3 text-lg sm:text-xl font-semibold bg-slate-600 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg transition-colors"
      >
        Reset
      </button>

      <button
        onClick={handleLap}
        disabled={!isStopwatchRunning}
        className={`px-4 sm:px-6 w-auto py-3 rounded-lg transition-colors ${
          isStopwatchRunning
            ? "bg-slate-600 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white"
            : "bg-gray-300 dark:bg-slate-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
        }`}
      >
        <center>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            className="sm:w-6 sm:h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="10" x2="14" y1="2" y2="2" />
            <line x1="12" x2="15" y1="14" y2="11" />
            <circle cx="12" cy="14" r="8" />
          </svg>
          <p className="text-xs">Lap</p>
        </center>
      </button>
    </div>

    {stopwatchLaps.length > 0 && (
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md text-black dark:text-white px-4 sm:px-0">
        <div
          ref={lapsContainerRef}
          className="h-60 sm:h-72 md:h-80 overflow-y-auto scrollbar-hide gap-0.5 flex-col flex rounded-2xl"
        >
          {stopwatchLaps.map((lap, index) => (
            <div
              key={lap.id}
              className="flex justify-between sm:justify-evenly p-2 sm:p-3 bg-gradient-to-tl from-stone-200 via-slate-300 to-stone-200 dark:from-stone-700 dark:via-slate-700 dark:to-stone-700 rounded border border-white/30 dark:border-slate-600"
            >
              <span className="font-medium text-sm sm:text-base text-gray-800 dark:text-gray-200">
                Lap {lap.id}
              </span>
              <span className="font-mono text-sm sm:text-base md:text-lg text-gray-800 dark:text-gray-100">
                {formatstopwatchTime(
                  lap.hours,
                  lap.minutes,
                  lap.seconds,
                  lap.centiseconds
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
</div>
  );
}

export default Stopwatch;
