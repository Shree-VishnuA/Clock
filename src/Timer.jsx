import { useContext, useEffect, useRef } from "react";
import { ClockContext } from "./ClockContext";

function Timer() {
  const {
    inputSeconds,
    setInputSeconds,
    inputMinutes,
    setInputMinutes,
    inputHours,
    setInputHours,
    isRunning,
    setIsRunning,
    totalMilliseconds,
    setTotalMilliseconds,
    showAlert,
    setShowAlert,
  } = useContext(ClockContext);

  // Audio reference
  const audioRef = useRef(null);
  const tickingRef = useRef(null);

  const displayHours = Math.floor(totalMilliseconds / (1000 * 60 * 60));
  const displayMinutes = Math.floor(
    (totalMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
  );
  const displaySeconds = Math.floor((totalMilliseconds % (1000 * 60)) / 1000);
  const displayMilliseconds = Math.floor((totalMilliseconds % 1000) / 10); // Show centiseconds (0-99)

  function handlesetSeconds(e) {
    const value = parseInt(e.target.value) || 0;
    if (value > 59) {
      setInputSeconds(59);
      return;
    }
    setInputSeconds(value);
  }

  function handlesetMinutes(e) {
    const value = parseInt(e.target.value) || 0;
    if (value > 59) {
      setInputMinutes(59);
      return;
    }
    setInputMinutes(value);
  }

  function handlesetHours(e) {
    const value = parseInt(e.target.value) || 0;
    if (value > 59) {
      setInputHours(59);
      return;
    }
    setInputHours(value);
  }

  function handleStart() {
    const total = (inputSeconds + inputMinutes * 60 + inputHours * 3600) * 1000; // Convert to milliseconds
    if (total > 0) {
      setTotalMilliseconds(total);
      setIsRunning(true);
    }
  }

  function handlePause() {
    setIsRunning(false);
  }

  function handleResume() {
    setIsRunning(true);
  }

  function handleOK() {
    setShowAlert(false);
    // Stop audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }

  function handleRestart() {
    setShowAlert(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    // Stop audio if playing
    const total = (inputSeconds + inputMinutes * 60 + inputHours * 3600) * 1000; // Convert to milliseconds
    if (total > 0) {
      setTotalMilliseconds(total);
      setIsRunning(true);
    }
  }

  function handleReset() {
    setIsRunning(false);
    setTotalMilliseconds(0);
    setShowAlert(false);
    // Stop audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    // Keep input values unchanged - they remain the same
  }

  // Function to play audio when timer reaches zero
  function playTimerEndSound() {
    if (audioRef.current) {
      audioRef.current.volume = 0.7; // Set volume (0.0 to 1.0)
      audioRef.current.loop = true; // Loop the audio continuously
      audioRef.current.play();
    }
  }

  // Function to start ticking sound
  function startTickingSound() {
    if (tickingRef.current) {
      tickingRef.current.volume = 0.3; // Lower volume for ticking
      tickingRef.current.loop = true;
      tickingRef.current.play();
    }
  }

  // Function to stop ticking sound
  function stopTickingSound() {
    if (tickingRef.current) {
      tickingRef.current.pause();
      tickingRef.current.currentTime = 0;
    }
  }

  // Effect to handle ticking sound based on timer state
  useEffect(() => {
    if (isRunning && totalMilliseconds > 0) {
      startTickingSound();
    } else {
      stopTickingSound();
    }

    // Cleanup function to stop ticking when component unmounts
    return () => {
      stopTickingSound();
    };
  }, [isRunning]);

  useEffect(() => {
    let interval;
    if (isRunning && totalMilliseconds > 0) {
      interval = setInterval(() => {
        setTotalMilliseconds((prev) => {
          if (prev <= 100) {
            // 100ms threshold - Timer has ended
            setIsRunning(false);
            setShowAlert(true); // Show the alert popup
            playTimerEndSound();
            // Play audio when countdown reaches zero
            return 0;
          }
          return prev - 100; // Decrease by 100ms each interval
        });
      }, 100); // Update every 100ms instead of 10ms
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, totalMilliseconds]);

  // Check if timer has been started (has time remaining or is currently running)
  const timerStarted = totalMilliseconds > 0 || isRunning;

  return (
    <div className="h-screen w-full bg-gradient-to-tl from-stone-400 via-slate-400 to-stone-400 dark:from-stone-800 dark:via-slate-800 dark:to-stone-800 flex flex-col gap-4 sm:justify-center items-center p-4">
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="auto">
  <source src="/Clock/timeup.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <audio ref={tickingRef} preload="auto">
  <source src="/Clock/ticking.mp3" type="audio/mpeg" />

        Your browser does not support the audio element.
      </audio>

      {showAlert && (
        <div className="bg-white/90 dark:bg-slate-800 text-black dark:text-white flex flex-col items-center gap-4 rounded-2xl p-6 w-full max-w-md mx-4 shadow-lg backdrop-blur-sm border border-white/30 dark:border-slate-600">
          <div className="bg-white/90 dark:bg-slate-800 text-black dark:text-white flex flex-col items-center gap-4 rounded-2xl p-6 max-w-sm w-full mx-4">
            <div>
              <div className="w-12 h-12 bg-slate-400 dark:bg-slate-600 rounded-full flex items-center justify-center">
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
                  className="lucide lucide-hourglass-icon lucide-hourglass text-white dark:text-gray-200"
                >
                  <path d="M5 22h14" />
                  <path d="M5 2h14" />
                  <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
                  <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
                </svg>
              </div>
            </div>
            <div className="text-3xl digital text-gray-800 dark:text-gray-100">
              {String(inputHours).padStart(2, "0")}:
              {String(inputMinutes).padStart(2, "0")}:
              {String(inputSeconds).padStart(2, "0")}
            </div>
            <div className="flex gap-4 w-full">
              <button
                className="bg-slate-600 dark:bg-slate-700 px-4 py-2 text-white rounded-md hover:bg-slate-700 dark:hover:bg-slate-600 active:scale-95 transition-all flex-1"
                onClick={handleRestart}
              >
                Restart
              </button>
              <button
                className="bg-slate-600 dark:bg-slate-700 px-4 py-2 text-white rounded-md hover:bg-slate-700 dark:hover:bg-slate-600 active:scale-95 transition-all flex-1"
                onClick={handleOK}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {!showAlert && (
        <div className="bg-white/90 dark:bg-slate-800 text-black dark:text-white flex flex-col items-center gap-4 rounded-2xl p-6 w-full max-w-md mx-4 shadow-lg backdrop-blur-sm border border-white/30 dark:border-slate-600">
          <div className="text-2xl sm:text-3xl md:text-4xl font-mono text-center break-all text-gray-800 dark:text-gray-100">
            {String(displayHours).padStart(2, "0")}:
            {String(displayMinutes).padStart(2, "0")}:
            {String(displaySeconds).padStart(2, "0")}:
            {String(displayMilliseconds).padStart(2, "0")}
          </div>
          <div className="flex gap-4 w-full">
            <button
              className={`bg-slate-600 dark:bg-slate-700 py-2 px-4 rounded hover:bg-slate-700 dark:hover:bg-slate-600 active:scale-95 transition-all text-white flex-1 ${
                !timerStarted ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={isRunning ? handlePause : handleResume}
              disabled={!timerStarted}
            >
              {isRunning ? "Pause" : "Resume"}
            </button>
            <button
              className="bg-slate-600 dark:bg-slate-700 py-2 px-4 rounded hover:bg-slate-700 dark:hover:bg-slate-600 active:scale-95 transition-all text-white flex-1"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-4 bg-white/90 dark:bg-slate-800 w-full max-w-md rounded-2xl p-6 mx-4 shadow-lg backdrop-blur-sm border border-white/30 dark:border-slate-600">
        <div>
          <h2 className="text-gray-800 dark:text-gray-100 text-xl sm:text-2xl font-bold text-center">
            Set Time
          </h2>
        </div>
        <div className="w-full flex gap-2 sm:gap-4 justify-center">
          <div className="flex flex-col items-center flex-1">
            <input
              type="number"
              placeholder="0"
              value={inputHours}
              onChange={handlesetHours}
              className="w-full max-w-20 text-center font-mono border-2 border-slate-300 dark:border-slate-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-700 p-2 sm:p-3 rounded-xl placeholder:text-gray-500 dark:placeholder:text-gray-400 text-sm sm:text-base focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 focus:border-transparent"
              min={0}
            />
            <div className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mt-1">
              Hours
            </div>
          </div>
          <div className="flex flex-col items-center flex-1">
            <input
              type="number"
              placeholder="0"
              onChange={handlesetMinutes}
              value={inputMinutes}
              className="w-full max-w-20 text-center font-mono border-2 border-slate-300 dark:border-slate-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-700 p-2 sm:p-3 rounded-xl placeholder:text-gray-500 dark:placeholder:text-gray-400 text-sm sm:text-base focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 focus:border-transparent"
              min={0}
              max={59}
            />
            <div className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mt-1">
              Minutes
            </div>
          </div>
          <div className="flex flex-col items-center flex-1">
            <input
              type="number"
              placeholder="0"
              onChange={handlesetSeconds}
              value={inputSeconds}
              className="w-full max-w-20 text-center font-mono border-2 border-slate-300 dark:border-slate-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-700 p-2 sm:p-3 rounded-xl placeholder:text-gray-500 dark:placeholder:text-gray-400 text-sm sm:text-base focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 focus:border-transparent"
              min={0}
              max={59}
            />
            <div className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mt-1">
              Seconds
            </div>
          </div>
        </div>

        <button
          className={`text-white bg-slate-600 dark:bg-slate-700 py-3 px-6 rounded-md w-full sm:w-auto ${
            isRunning
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-slate-700 dark:hover:bg-slate-600 active:scale-95"
          } transition-all font-semibold`}
          onClick={handleStart}
          disabled={isRunning}
        >
          Start
        </button>
      </div>
    </div>
  );
}

export default Timer;
