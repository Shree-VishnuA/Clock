import { Trash2, Volume2, VolumeX, Edit2, Check, X } from "lucide-react";
import { useState, useRef, useEffect, useContext } from "react";
import { ClockContext } from "./ClockContext";

function Alarm() {
  const [amActive, setAmActive] = useState(true);
  const [pmActive, setPmActive] = useState(false);
  const [inputHours, setInputHours] = useState("");
  const [inputMinutes, setInputMinutes] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [editingAlarm, setEditingAlarm] = useState(null);
  const [editHours, setEditHours] = useState("");
  const [editMinutes, setEditMinutes] = useState("");
  const [editPeriod, setEditPeriod] = useState("AM");
  const AlarmsContainerRef = useRef(null);

  const {
    alarms: Alarms,
    setAlarms,
    ringingAlarm,
    setRingingAlarm,
    audioContext,
    oscillatorRef,
  } = useContext(ClockContext);

  const daysOfWeek = [
    { key: "sunday", label: "Sun", fullName: "Sunday" },
    { key: "monday", label: "Mon", fullName: "Monday" },
    { key: "tuesday", label: "Tue", fullName: "Tuesday" },
    { key: "wednesday", label: "Wed", fullName: "Wednesday" },
    { key: "thursday", label: "Thu", fullName: "Thursday" },
    { key: "friday", label: "Fri", fullName: "Friday" },
    { key: "saturday", label: "Sat", fullName: "Saturday" },
  ];

  useEffect(() => {
    if (AlarmsContainerRef.current) {
      AlarmsContainerRef.current.scrollTop =
        AlarmsContainerRef.current.scrollHeight;
    }
  }, [Alarms]);

  // Initialize Audio Context
  useEffect(() => {
    const initAudioContext = () => {
      if (!audioContext) {
        const context = new (window.AudioContext ||
          window.webkitAudioContext)();
        setAudioContext(context);
      }
    };

    // Initialize on first user interaction
    const handleUserInteraction = () => {
      initAudioContext();
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
    };

    document.addEventListener("click", handleUserInteraction);
    document.addEventListener("keydown", handleUserInteraction);

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
    };
  }, [audioContext]);

  // Current time updater
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Alarm checker
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentSecond = now.getSeconds();

      // Only check at the start of each minute
      if (currentSecond !== 0) return;

      Alarms.forEach((alarm) => {
        if (!alarm.isActive) return;

        let alarmHour = alarm.hours;
        if (alarm.period === "PM" && alarm.hours !== 12) {
          alarmHour += 12;
        } else if (alarm.period === "AM" && alarm.hours === 12) {
          alarmHour = 0;
        }

        if (currentHour === alarmHour && currentMinute === alarm.minutes) {
          const today = now.getDay();
          const dayKeys = [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
          ];
          const todayKey = dayKeys[today];

          if (
            alarm.selectedDays.length > 0 &&
            alarm.selectedDays.includes(todayKey)
          ) {
            triggerAlarm(alarm);
          }
        }
      });
    };

    const interval = setInterval(checkAlarms, 1000);
    return () => clearInterval(interval);
  }, [Alarms, audioContext]);

  const triggerAlarm = (alarm) => {
    console.log(`🚨 ALARM TRIGGERED: ${alarm.time} ${alarm.period}`);
    setRingingAlarm(alarm);
    playAlarmSound();

    setTimeout(() => {
      setRingingAlarm((current) => {
        if (current && current.id === alarm.id) {
          stopLocalAlarm();
        }
        return null;
      });
    }, 60000);
  };

  const playAlarmSound = () => {
    if (!audioContext) return;

    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime); // Constant beep
      oscillator.start();

      oscillatorRef.current = { oscillator, gainNode };
    } catch (error) {
      console.error("Error playing alarm sound:", error);
      alert(`🚨 ALARM! Time: ${ringingAlarm?.time} ${ringingAlarm?.period}`);
    }
  };

  const stopLocalAlarm = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.oscillator.stop();
      } catch (error) {
        console.error("Error stopping alarm:", error);
      }
      oscillatorRef.current = null;
    }
    setRingingAlarm(null);
  };

  function handleAM() {
    setAmActive(true);
    setPmActive(false);
  }

  function handlePM() {
    setAmActive(false);
    setPmActive(true);
  }

  function handlesetInputHours(e) {
    const value = e.target.value;

    if (value === "") {
      setInputHours("");
      return;
    }

    const numValue = parseInt(value);
    if (numValue > 12 || numValue < 1) {
      alert("Please enter hours between 1-12 for 12-hour format");
      return;
    }

    setInputHours(value);
  }

  function handlesetInputMinutes(e) {
    const value = e.target.value;

    if (value === "") {
      setInputMinutes("");
      return;
    }

    const numValue = parseInt(value);

    if (numValue > 59) {
      setInputMinutes("59");
      return;
    }

    if (numValue < 0) {
      setInputMinutes("0");
      return;
    }

    setInputMinutes(value);
  }

  function handleKeyDown(e) {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "Enter",
      "Escape",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
    ];

    if (allowedKeys.includes(e.key)) {
      return;
    }

    if (e.ctrlKey) {
      return;
    }

    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  }

  function handleCancel() {
    setInputHours("");
    setInputMinutes("");
    setAmActive(true);
    setPmActive(false);
  }

  function handleOK() {
    if (!inputHours || !inputMinutes) {
      alert("Please enter both hours and minutes");
      return;
    }

    const hours = parseInt(inputHours);
    const minutes = parseInt(inputMinutes);
    const period = amActive ? "AM" : "PM";

    // Create new alarm object
    const newAlarm = {
      id: Date.now(),
      hours: hours,
      minutes: minutes,
      period: period,
      time: `${hours}:${minutes.toString().padStart(2, "0")}`,
      isActive: true,
      createdAt: new Date().toLocaleString(),
      selectedDays: [],
    };

    setAlarms([...Alarms, newAlarm]);

    setInputHours("");
    setInputMinutes("");
    setAmActive(true);
    setPmActive(false);

    console.log(`Alarm set for ${newAlarm.time} ${period}`);
  }

  function handleDeleteAlarm(alarmId) {
    setAlarms(Alarms.filter((alarm) => alarm.id !== alarmId));
  }

  function handleToggleAlarm(alarmId) {
    setAlarms(
      Alarms.map((alarm) =>
        alarm.id === alarmId ? { ...alarm, isActive: !alarm.isActive } : alarm
      )
    );
  }

  function handleDayToggle(alarmId, dayKey) {
    setAlarms(
      Alarms.map((alarm) => {
        if (alarm.id === alarmId) {
          const updatedDays = alarm.selectedDays.includes(dayKey)
            ? alarm.selectedDays.filter((day) => day !== dayKey)
            : [...alarm.selectedDays, dayKey];
          return { ...alarm, selectedDays: updatedDays };
        }
        return alarm;
      })
    );
  }

  function handleEditAlarm(alarm) {
    setEditingAlarm(alarm.id);
    setEditHours(alarm.hours.toString());
    setEditMinutes(alarm.minutes.toString().padStart(2, "0"));
    setEditPeriod(alarm.period);
  }

  function handleEditHours(e) {
    const value = e.target.value;
    if (value === "") {
      setEditHours("");
      return;
    }
    const numValue = parseInt(value);
    if (numValue > 12 || numValue < 1) {
      return;
    }
    setEditHours(value);
  }

  function handleEditMinutes(e) {
    const value = e.target.value;
    if (value === "") {
      setEditMinutes("");
      return;
    }
    const numValue = parseInt(value);
    if (numValue > 59) {
      setEditMinutes("59");
      return;
    }
    if (numValue < 0) {
      setEditMinutes("0");
      return;
    }
    setEditMinutes(value);
  }

  // Enhanced AM/PM handlers for edit mode
  function handleEditAM() {
    setEditPeriod("AM");
  }

  function handleEditPM() {
    setEditPeriod("PM");
  }

  function handleSaveEdit() {
    if (!editHours || !editMinutes) {
      alert("Please enter both hours and minutes");
      return;
    }

    const hours = parseInt(editHours);
    const minutes = parseInt(editMinutes);

    setAlarms(
      Alarms.map((alarm) => {
        if (alarm.id === editingAlarm) {
          return {
            ...alarm,
            hours: hours,
            minutes: minutes,
            period: editPeriod,
            time: `${hours}:${minutes.toString().padStart(2, "0")}`,
          };
        }
        return alarm;
      })
    );

    handleCancelEdit();
  }

  function handleCancelEdit() {
    setEditingAlarm(null);
    setEditHours("");
    setEditMinutes("");
    setEditPeriod("AM");
  }

  function getSelectedDaysDisplay(selectedDays) {
    if (selectedDays.length === 0) return "Select days to activate";
    if (selectedDays.length === 7) return "Every day";

    const dayLabels = selectedDays
      .sort((a, b) => {
        const dayOrder = [
          "sunday",
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
        ];
        return dayOrder.indexOf(a) - dayOrder.indexOf(b);
      })
      .map((dayKey) => daysOfWeek.find((day) => day.key === dayKey)?.label)
      .join(", ");

    return dayLabels;
  }

  function calculateTimeRemaining(alarm) {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();

    let alarmHour = alarm.hours;
    if (alarm.period === "PM" && alarm.hours !== 12) {
      alarmHour += 12;
    } else if (alarm.period === "AM" && alarm.hours === 12) {
      alarmHour = 0;
    }

    const today = new Date();
    today.setHours(alarmHour, alarm.minutes, 0, 0);

    let timeUntilAlarm = today.getTime() - now.getTime();

    if (timeUntilAlarm <= 0) {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      timeUntilAlarm = tomorrow.getTime() - now.getTime();
    }

    if (alarm.selectedDays.length > 0) {
      const dayKeys = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ];
      const currentDayIndex = now.getDay();

      let nextAlarmDate = null;

      const todayKey = dayKeys[currentDayIndex];
      if (
        alarm.selectedDays.includes(todayKey) &&
        today.getTime() > now.getTime()
      ) {
        nextAlarmDate = today;
      } else {
        for (let i = 1; i <= 7; i++) {
          const checkDayIndex = (currentDayIndex + i) % 7;
          const checkDayKey = dayKeys[checkDayIndex];

          if (alarm.selectedDays.includes(checkDayKey)) {
            nextAlarmDate = new Date(now);
            nextAlarmDate.setDate(now.getDate() + i);
            nextAlarmDate.setHours(alarmHour, alarm.minutes, 0, 0);
            break;
          }
        }
      }

      if (nextAlarmDate) {
        timeUntilAlarm = nextAlarmDate.getTime() - now.getTime();
      } else {
        return "Select days first";
      }
    } else {
      return "Select days first";
    }

    const totalSeconds = Math.floor(timeUntilAlarm / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return `${days}d ${remainingHours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  }

  return (
    <div className="h-screen w-full text-black dark:text-white bg-gradient-to-tl from-stone-400 via-slate-400 to-stone-400 dark:from-stone-800 dark:via-slate-800 dark:to-stone-800 relative">
      {/* Ringing Alarm Modal */}
      {ringingAlarm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 max-w-xs sm:max-w-sm w-full text-center animate-pulse">
            <div className="text-4xl sm:text-6xl mb-4">🚨</div>
            <div className="text-xl sm:text-2xl font-bold mb-2 text-black dark:text-white">
              ALARM!
            </div>
            <div className="text-lg sm:text-xl mb-4 text-black dark:text-white">
              {ringingAlarm.time} {ringingAlarm.period}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-6">
              {getSelectedDaysDisplay(ringingAlarm.selectedDays)}
            </div>
            <button
              onClick={stopLocalAlarm}
              className="bg-red-500 text-white px-6 sm:px-8 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors w-full sm:w-auto"
            >
              Stop Alarm
            </button>
          </div>
        </div>
      )}

      {/* Current Time Display */}
      <div className="fixed bottom-15 right-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-md p-1 sm:p-3 z-50 border border-white/30 dark:border-slate-600">
        <div className="text-sm sm:text-lg font-mono font-bold text-center text-black dark:text-white">
          {currentTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          })}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          {currentTime.toLocaleDateString([], {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Alarms Display Container */}
      {Alarms.length > 0 && (
        <div className="absolute top-4 left-4 right-4 h-[calc(100vh-225px)] sm:h-[72vh] overflow-y-auto scrollbar-hide">
          <div
            ref={AlarmsContainerRef}
            className="overflow-y-auto space-y-2 pr-2 scroolbar-hide"
          >
            {Alarms.map((alarm) => (
              <div
                key={alarm.id}
                className={`bg-gray-500 dark:bg-slate-700 text-white rounded-2xl p-3 sm:p-4 transition-all duration-200 border border-white/30 dark:border-slate-600 ${
                  alarm.isActive ? "opacity-100" : "opacity-60"
                } ${
                  ringingAlarm && ringingAlarm.id === alarm.id
                    ? "ring-2 ring-red-500 animate-pulse"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  {editingAlarm === alarm.id ? (
                    // Edit Mode
                    <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                      <input
                        type="number"
                        value={editHours}
                        onChange={handleEditHours}
                        onKeyDown={handleKeyDown}
                        className="w-12 sm:w-16 bg-gray-700 dark:bg-slate-600 text-white rounded-md px-1 sm:px-2 py-1 text-lg sm:text-2xl text-center focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 dark:border-slate-500"
                        min="1"
                        max="12"
                      />
                      <span className="text-lg sm:text-2xl">:</span>
                      <input
                        type="number"
                        value={editMinutes}
                        onChange={handleEditMinutes}
                        onKeyDown={handleKeyDown}
                        className="w-12 sm:w-16 bg-gray-700 dark:bg-slate-600 text-white rounded-md px-1 sm:px-2 py-1 text-lg sm:text-2xl text-center focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 dark:border-slate-500"
                        min="0"
                        max="59"
                      />
                      <div className="flex flex-col ml-1 sm:ml-2">
                        <div
                          onClick={handleEditAM}
                          className={`px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm rounded-t-md cursor-pointer transition-colors ${
                            editPeriod === "AM"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-400 dark:bg-slate-500 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-400"
                          }`}
                        >
                          AM
                        </div>
                        <div
                          onClick={handleEditPM}
                          className={`px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm rounded-b-md cursor-pointer transition-colors ${
                            editPeriod === "PM"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-400 dark:bg-slate-500 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-400"
                          }`}
                        >
                          PM
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1 sm:gap-2 flex-wrap">
                      <button
                        onClick={() => handleEditAlarm(alarm)}
                        className={`text-2xl sm:text-4xl font-light hover:text-blue-300 transition-colors cursor-pointer ${
                          alarm.isActive
                            ? "text-white"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                      >
                        {alarm.time}
                      </button>
                      <div className="text-lg sm:text-2xl font-light text-gray-300 dark:text-gray-400">
                        {alarm.period.toLowerCase()}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 sm:gap-3">
                    {editingAlarm === alarm.id ? (
                      <>
                        <button
                          onClick={handleSaveEdit}
                          className="p-1 sm:p-2 text-green-400 hover:text-green-300 hover:bg-gray-700 dark:hover:bg-slate-600 rounded-md transition-colors"
                        >
                          <Check className="h-6 w-6 sm:h-8 sm:w-8" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-1 sm:p-2 text-red-400 hover:text-red-300 hover:bg-gray-700 dark:hover:bg-slate-600 rounded-md transition-colors"
                        >
                          <X className="h-6 w-6 sm:h-8 sm:w-8" />
                        </button>
                      </>
                    ) : (
                      <>
                        {/* Toggle Switch */}
                        <div
                          className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full cursor-pointer transition-colors ${
                            alarm.isActive
                              ? "bg-gray-800 dark:bg-slate-800"
                              : "bg-gray-400 dark:bg-slate-500"
                          }`}
                          onClick={() => handleToggleAlarm(alarm.id)}
                        >
                          <span
                            className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                              alarm.isActive
                                ? "translate-x-5 sm:translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteAlarm(alarm.id)}
                          className="p-1 sm:p-2 text-gray-400 dark:text-gray-500 hover:text-red-400 hover:bg-gray-700 dark:hover:bg-slate-600 rounded-md transition-colors"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Days Selection */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <div className="text-xs sm:text-sm text-gray-300 dark:text-gray-400">
                      {getSelectedDaysDisplay(alarm.selectedDays)}
                    </div>

                    {/* Time Remaining Display */}
                    {alarm.isActive && editingAlarm !== alarm.id && (
                      <div className="text-xs sm:text-sm text-blue-300 dark:text-blue-400 font-medium">
                        {calculateTimeRemaining(alarm)}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-1 sm:gap-2 flex-wrap">
                    {daysOfWeek.map((day) => (
                      <button
                        key={day.key}
                        onClick={() => handleDayToggle(alarm.id, day.key)}
                        className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all ${
                          alarm.selectedDays.includes(day.key)
                            ? "bg-gray-800 dark:bg-slate-800 text-white"
                            : "bg-gray-400 dark:bg-slate-500 text-gray-300 dark:text-gray-400 hover:bg-gray-500 dark:hover:bg-slate-400"
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Set Time Container */}
      <div className="flex flex-col px-2 sm:px-5 gap-2 justify-evenly items-center fixed bottom-3 right-22 sm:left-[40vw] transform-translate-x-1/2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm py-2 rounded-2xl shadow-lg border border-white/30 dark:border-slate-600 w-[calc(100%-6rem)] sm:w-auto max-w-sm">
        <div className="font-semibold text-sm sm:text-base text-black dark:text-white">
          Set Time
        </div>
        <div className="flex w-full sm:w-fit gap-2 sm:gap-4 justify-center">
          <div className="flex gap-2 sm:gap-4">
            <div className="flex flex-col justify-center">
              <div>
                <input
                  type="number"
                  value={inputHours}
                  className="w-12 sm:w-16 border rounded-md border-gray-600 dark:border-slate-500 bg-white dark:bg-slate-700 text-center py-2 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400 text-sm sm:text-base text-black dark:text-white"
                  min={1}
                  max={12}
                  placeholder="12"
                  onChange={handlesetInputHours}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <div className="text-gray-700 dark:text-gray-300 text-xs text-center">
                Hour
              </div>
            </div>
            <div className="flex items-center justify-center text-lg sm:text-xl font-bold text-black dark:text-white">
              :
            </div>
            <div className="flex flex-col justify-center">
              <div>
                <input
                  type="number"
                  value={inputMinutes}
                  className="w-12 sm:w-16 border rounded-md border-gray-600 dark:border-slate-500 bg-white dark:bg-slate-700 text-center py-2 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400 text-sm sm:text-base text-black dark:text-white"
                  min={0}
                  max={59}
                  placeholder="00"
                  onChange={handlesetInputMinutes}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <div className="text-gray-700 dark:text-gray-300 text-xs text-center">
                Minute
              </div>
            </div>
          </div>
          <div className="flex flex-col border border-gray-600 dark:border-slate-500 rounded-md justify-between bg-white dark:bg-slate-400">
            <div
              className={`px-2 sm:px-3 h-full text-xs sm:text-sm flex items-center ${
                amActive
                  ? "bg-gray-600 dark:bg-blue-800 text-white"
                  : "hover:bg-gray-100 dark:hover:bg-slate-600 text-black dark:text-white"
              } rounded-t-md hover:cursor-pointer transition-colors text-center`}
              onClick={handleAM}
            >
              AM
            </div>
            <div className="border-t border-gray-300 dark:border-slate-500"></div>
            <div
              className={`px-2 sm:px-3 h-full text-xs sm:text-sm flex items-center ${
                pmActive
                  ? "bg-gray-600 dark:bg-blue-800 text-white"
                  : "hover:bg-gray-100 dark:hover:bg-slate-600 text-black dark:text-white"
              } rounded-b-md hover:cursor-pointer transition-colors text-center`}
              onClick={handlePM}
            >
              PM
            </div>
          </div>
        </div>
        <div className="flex justify-evenly w-full gap-2 sm:gap-4">
          <button
            onClick={handleCancel}
            className="px-3 sm:px-4 py-2 border border-gray-300 dark:border-slate-500 bg-white dark:bg-slate-700 text-black dark:text-white rounded-md hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors flex-1 sm:flex-none text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={handleOK}
            className="px-3 sm:px-4 py-2 bg-slate-500 dark:bg-slate-600 text-white rounded-md hover:bg-slate-600 dark:hover:bg-slate-700 transition-colors flex-1 sm:flex-none text-sm sm:text-base"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export default Alarm;
