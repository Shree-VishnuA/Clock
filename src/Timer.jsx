import { useState, useEffect, useRef } from "react";

function Timer() {
  // Input values (persistent)
  const [inputSeconds, setInputSeconds] = useState(0);
  const [inputMinutes, setInputMinutes] = useState(0);
  const [inputHours, setInputHours] = useState(0);

  // Display values (countdown timer)
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [totalMilliseconds, setTotalMilliseconds] = useState(0);
  const [showAlert, setShowAlert] = useState(false);

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
    }
    setInputSeconds(value);
  }
  function handlesetMinutes(e) {
    const value = parseInt(e.target.value) || 0;
    if (value > 59) {
      setInputMinutes(59);
    }
    setInputMinutes(value);
  }
  function handlesetHours(e) {
    const value = parseInt(e.target.value) || 0;
    if (value > 59) {
      setInputHours(59);
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
    setIsPaused(false);
  }
  function handleResume() {
    setIsRunning(true);
    setIsPaused(true);
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

  return (
    <div className="h-screen w-full bg-gradient-to-tl from-pink-200 via-purple-400 to-blue-300 flex flex-col gap-4 sm:justify-center  items-center p-4">
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="auto" src="timeup.mp3">
        Your browser does not support the audio element.
      </audio>
      <audio ref={tickingRef} preload="auto" src="ticking.mp3">
        Your browser does not support the audio element.
      </audio>

      {showAlert && (
        <div className="fixed inset-0 from-pink-200 via-purple-400 to-blue-300 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-stone-400 text-black flex flex-col items-center gap-4 rounded-2xl p-6 justify-evenly w-140 h-fit ml-25 mx-4">
            <div className="bg-pink-50 rounded-full p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-hourglass-icon lucide-hourglass  "
              >
                <path d="M5 22h14" />
                <path d="M5 2h14" />
                <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
                <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
              </svg>
            </div>
            <div className="text-6xl digital">
              {String(inputHours).padStart(2, "0")}:
              {String(inputMinutes).padStart(2, "0")}:
              {String(inputSeconds).padStart(2, "0")}
            </div>
            <div className="flex gap-4 w-full">
              <button
                className="bg-gray-600 px-4 py-2 text-white rounded-md hover:bg-gray-700 active:scale-95 transition-all flex-1"
                onClick={handleRestart}
              >
                Restart
              </button>
              <button
                className="bg-gray-600 px-4 py-2 text-white rounded-md hover:bg-gray-700 active:scale-95 transition-all flex-1"
                onClick={handleOK}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {!showAlert && (
        <div className="bg-white text-black flex flex-col items-center gap-4 rounded-2xl p-6 w-full max-w-md mx-4">
          <div className="text-2xl sm:text-3xl md:text-6xl digital text-center break-all">
            {String(displayHours).padStart(2, "0")}:
            {String(displayMinutes).padStart(2, "0")}:
            {String(displaySeconds).padStart(2, "0")}:
            {String(displayMilliseconds).padStart(2, "0")}
          </div>
          <div className="flex gap-4 w-full">
            <button
              className={`bg-gray-600 py-2 px-4 rounded hover:bg-gray-700 active:scale-95 transition-all text-white flex-1 `}
              onClick={isRunning ? handlePause : handleResume}
              disabled={isPaused}
            >
              {isRunning ? "Pause" : "Resume"}
            </button>
            <button
              className="bg-gray-600 py-2 px-4 rounded hover:bg-gray-700 active:scale-95 transition-all text-white flex-1"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-4 bg-white w-full max-w-md rounded-2xl p-6 mx-4">
        <div>
          <h2 className="text-gray-800 text-xl sm:text-2xl font-bold text-center">
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
              className="w-full max-w-20 text-center font-mono border-2 border-black text-gray-900 p-2 sm:p-3 rounded-xl placeholder:text-gray-500 text-sm sm:text-base"
              min={0}
            />
            <div className="text-gray-600 text-xs sm:text-sm mt-1">Hours</div>
          </div>
          <div className="flex flex-col items-center flex-1">
            <input
              type="number"
              placeholder="0"
              onChange={handlesetMinutes}
              value={inputMinutes}
              className="w-full max-w-20 text-center font-mono border-2 border-black text-gray-900 p-2 sm:p-3 rounded-xl placeholder:text-gray-500 text-sm sm:text-base"
              min={0}
              max={59}
            />
            <div className="text-gray-600 text-xs sm:text-sm mt-1">Minutes</div>
          </div>
          <div className="flex flex-col items-center flex-1">
            <input
              type="number"
              placeholder="0"
              onChange={handlesetSeconds}
              value={inputSeconds}
              className="w-full max-w-20 text-center font-mono border-2 border-black text-gray-900 p-2 sm:p-3 rounded-xl placeholder:text-gray-500 text-sm sm:text-base"
              min={0}
              max={59}
            />
            <div className="text-gray-600 text-xs sm:text-sm mt-1">Seconds</div>
          </div>
        </div>

        <button
          className={`text-white bg-gray-600 py-3 px-6 rounded-md w-full sm:w-auto ${
            isRunning
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-gray-700 active:scale-95"
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
