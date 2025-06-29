import { useState, useEffect, useRef } from "react";

function Stopwatch() {
  const [time, setTime] = useState(0); // Single source of truth in milliseconds
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);

  // Calculate time units from total milliseconds
  const totalSeconds = Math.floor(time / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((time % 1000) / 10);
  const lapsContainerRef = useRef(null);

  useEffect(() => {
    if (lapsContainerRef.current) {
      lapsContainerRef.current.scrollTop =
        lapsContainerRef.current.scrollHeight;
    }
  }, [laps]);

  function handleToggle() {
    setIsRunning(!isRunning);
    if (!hasStarted) {
      setHasStarted(true); // Mark as started when first clicked
    }
  }

  function handleReset() {
    setTime(0);
    setIsRunning(false);
    setHasStarted(false); // Reset the started state
    setLaps([]); // Clear laps when resetting
  }

  function addZero(n) {
    return (n < 10 ? "0" : "") + n;
  }

  function formatTime(h, m, s, cs) {
    let timeStr = "";
    if (h > 0) {
      timeStr += addZero(h) + ":";
    }
    if (h > 0 || m > 0) {
      timeStr += addZero(m) + ":";
    }
    timeStr += addZero(s) + "." + addZero(cs);
    return timeStr;
  }

  function handleLap() {
    if (isRunning) {
      const newLap = {
        id: laps.length + 1,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        centiseconds: centiseconds,
        totalTime: time,
      };
      setLaps([...laps, newLap]);
    }
  }

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  return (
    <div className="bg-pink-100">
      <div className="flex flex-col gap-4 sm:gap-8 items-center p-4 sm:p-2 sm:h-screen  bg-gradient-to-tl bg-pink-200 via-purple-400 to-blue-300 min-h-screen">
        <div className="relative">
          {isRunning && (
            <div
              className="absolute inset-0 rounded-full animate-spin"
              style={{
                background:
                  "conic-gradient(from 0deg, #3b02f6, #60a0fa, #93c5fd, #dbeafe, #3b82f0)",
                padding: "4px",
              }}
            >
              <div className="w-full h-full bg-white rounded-full"></div>
            </div>
          )}

          <div
            className={`relative border-4 py-8 px-12 sm:py-12 md:py-16 sm:px-16 md:px-20 rounded-full bg-white shadow-lg ${
              isRunning ? "border" : "border-gray-400"
            }`}
          >
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-black font-mono flex flex-col items-center">
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
            className={`px-6 sm:px-8 py-3 text-lg sm:text-xl font-semibold rounded-lg ${
              isRunning
                ? "bg-white hover:bg-gray-600 text-black"
                : "bg-black hover:bg-gray-600 text-white"
            } transition-colors`}
          >
            {isRunning ? "Stop" : hasStarted ? "Resume" : "Start"}
          </button>

          <button
            onClick={handleReset}
            className="px-6 sm:px-8 py-3 text-lg sm:text-xl font-semibold bg-black hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Reset
          </button>

          <button
            onClick={handleLap}
            disabled={!isRunning}
            className={`px-4 sm:px-6 w-auto py-3 rounded-lg transition-colors ${
              isRunning
                ? "bg-black hover:bg-gray-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
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
            </center>
          </button>
        </div>

        {laps.length > 0 && (
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md text-black px-4 sm:px-0">
            <div
              ref={lapsContainerRef}
              className="h-60 sm:h-72 md:h-80 overflow-y-auto scrollbar-hide gap-0.5 flex-col flex rounded-2xl"
            >
              {laps.map((lap, index) => (
                <div
                  key={lap.id}
                  className="flex justify-between sm:justify-evenly p-2 sm:p-3 bg-gradient-to-tl bg-pink-100 via-purple-200 to-pink-100 rounded"
                >
                  <span className="font-medium text-sm sm:text-base">
                    Lap {lap.id}
                  </span>
                  <span className="font-mono text-sm sm:text-base md:text-lg">
                    {formatTime(
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
