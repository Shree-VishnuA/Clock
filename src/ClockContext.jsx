import React, { createContext, useState, useRef, useEffect } from "react";

export const ClockContext = createContext();

export const ClockProvider = ({ children }) => {
  //   timer States
  const [inputSeconds, setInputSeconds] = useState(0);
  const [inputMinutes, setInputMinutes] = useState(0);
  const [inputHours, setInputHours] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [totalMilliseconds, setTotalMilliseconds] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  // Stopwatch states
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);
  const [hasStopwatchStarted, setHasStopwatchStarted] = useState(false);
  const [stopwatchLaps, setStopwatchLaps] = useState([]);
  const [ringingAlarm, setRingingAlarm] = useState(null);

  const [alarms, setAlarms] = useState(() => {
    try {
      const saved = localStorage.getItem("alarms");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error loading alarms from localStorage:", e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("alarms", JSON.stringify(alarms));
  }, [alarms]);

  // Refs for Web Audio API
  const oscillatorRef = useRef(null);
  const [audioContext, setAudioContext] = useState(null);

  useEffect(() => {
    const initAudioContext = () => {
      if (!audioContext) {
        const context = new (window.AudioContext ||
          window.webkitAudioContext)();
        setAudioContext(context);
      }
    };

    const handleInteraction = () => {
      initAudioContext();
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
    };

    document.addEventListener("click", handleInteraction);
    document.addEventListener("keydown", handleInteraction);

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
    };
  }, [audioContext]);

  const stopAlarm = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.oscillator.stop();
        clearInterval(oscillatorRef.current.interval);
      } catch (error) {
        console.error("Error stopping alarm:", error);
      }
      oscillatorRef.current = null;
    }
    setRingingAlarm(null);
  };

  return (
    <ClockContext.Provider
      value={{
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
        stopwatchTime,
        setStopwatchTime,
        isStopwatchRunning,
        setIsStopwatchRunning,
        hasStopwatchStarted,
        setHasStopwatchStarted,
        stopwatchLaps,
        setStopwatchLaps,
        alarms,
        setAlarms,
        ringingAlarm,
        setRingingAlarm,
        audioContext,
        oscillatorRef,
        stopAlarm,
      }}
    >
      {children}
    </ClockContext.Provider>
  );
};
