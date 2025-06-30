import { Trash2, Volume2, VolumeX, Edit2, Check, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

function Alarm() {
  const [amActive, setAmActive] = useState(true); 
  const [pmActive, setPmActive] = useState(false); 
  const [inputHours, setInputHours] = useState("");
  const [inputMinutes, setInputMinutes] = useState("");
  const [Alarms, setAlarms] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [ringingAlarm, setRingingAlarm] = useState(null);
  const [audioContext, setAudioContext] = useState(null);
  const [editingAlarm, setEditingAlarm] = useState(null);
  const [editHours, setEditHours] = useState("");
  const [editMinutes, setEditMinutes] = useState("");
  const [editPeriod, setEditPeriod] = useState("AM");
  const AlarmsContainerRef = useRef(null);
  const oscillatorRef = useRef(null);

  const daysOfWeek = [
    { key: 'sunday', label: 'Sun', fullName: 'Sunday' },
    { key: 'monday', label: 'Mon', fullName: 'Monday' },
    { key: 'tuesday', label: 'Tue', fullName: 'Tuesday' },
    { key: 'wednesday', label: 'Wed', fullName: 'Wednesday' },
    { key: 'thursday', label: 'Thu', fullName: 'Thursday' },
    { key: 'friday', label: 'Fri', fullName: 'Friday' },
    { key: 'saturday', label: 'Sun', fullName: 'Saturday' }
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
        const context = new (window.AudioContext || window.webkitAudioContext)();
        setAudioContext(context);
      }
    };
    
    // Initialize on first user interaction
    const handleUserInteraction = () => {
      initAudioContext();
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
    
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    
    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
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
      
      // Only check at the start of each minute (when seconds is 0)
      if (currentSecond !== 0) return;

      Alarms.forEach(alarm => {
        if (!alarm.isActive) return;

        // Convert alarm time to 24-hour format
        let alarmHour = alarm.hours;
        if (alarm.period === 'PM' && alarm.hours !== 12) {
          alarmHour += 12;
        } else if (alarm.period === 'AM' && alarm.hours === 12) {
          alarmHour = 0;
        }

        // Check if current time matches alarm time
        if (currentHour === alarmHour && currentMinute === alarm.minutes) {
          // Check if today is selected (only ring if days are selected and today is one of them)
          const today = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
          const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
          const todayKey = dayKeys[today];

          if (alarm.selectedDays.length > 0 && alarm.selectedDays.includes(todayKey)) {
            triggerAlarm(alarm);
          }
        }
      });
    };

    checkAlarms();
  }, [currentTime, Alarms, audioContext]);

  const triggerAlarm = (alarm) => {
    console.log(`🚨 ALARM TRIGGERED: ${alarm.time} ${alarm.period}`);
    setRingingAlarm(alarm);
    playAlarmSound();
    
    // Auto-stop alarm after 1 minute if not manually stopped
    setTimeout(() => {
      if (ringingAlarm && ringingAlarm.id === alarm.id) {
        stopAlarm();
      }
    }, 60000);
  };

  const playAlarmSound = () => {
    if (!audioContext) return;

    try {
      // Create a beeping alarm sound using Web Audio API
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.type = 'sine';
      
      // Create beeping pattern
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      
      const beepPattern = () => {
        const currentTime = audioContext.currentTime;
        gainNode.gain.setValueAtTime(0.3, currentTime);
        gainNode.gain.setValueAtTime(0.3, currentTime + 0.5);
        gainNode.gain.setValueAtTime(0, currentTime + 0.5);
        gainNode.gain.setValueAtTime(0, currentTime + 0.7);
        gainNode.gain.setValueAtTime(0.3, currentTime + 0.7);
        gainNode.gain.setValueAtTime(0.3, currentTime + 1.2);
        gainNode.gain.setValueAtTime(0, currentTime + 1.2);
      };
      
      oscillator.start();
      beepPattern();
      
      // Repeat beeping
      const beepInterval = setInterval(() => {
        if (ringingAlarm) {
          beepPattern();
        } else {
          clearInterval(beepInterval);
        }
      }, 2000);
      
      oscillatorRef.current = { oscillator, gainNode, interval: beepInterval };
      
    } catch (error) {
      console.error('Error playing alarm sound:', error);
      // Fallback: show alert
      alert(`🚨 ALARM! Time: ${ringingAlarm?.time} ${ringingAlarm?.period}`);
    }
  };

  const stopAlarm = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.oscillator.stop();
        clearInterval(oscillatorRef.current.interval);
      } catch (error) {
        console.error('Error stopping alarm:', error);
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
      id: Date.now(), // Simple ID generation
      hours: hours,
      minutes: minutes,
      period: period,
      time: `${hours}:${minutes.toString().padStart(2, "0")}`,
      isActive: true,
      createdAt: new Date().toLocaleString(),
      selectedDays: [] // Initially no days selected
    };

    // Add alarm to the list
    setAlarms([...Alarms, newAlarm]);

    // Clear inputs after adding
    setInputHours("");
    setInputMinutes("");
    setAmActive(true);
    setPmActive(false);

    console.log(`Alarm set for ${newAlarm.time} ${period}`);
  }

  function handleDeleteAlarm(alarmId) {
    setAlarms(Alarms.filter(alarm => alarm.id !== alarmId));
  }

  function handleToggleAlarm(alarmId) {
    setAlarms(Alarms.map(alarm => 
      alarm.id === alarmId 
        ? { ...alarm, isActive: !alarm.isActive }
        : alarm
    ));
  }

  function handleDayToggle(alarmId, dayKey) {
    setAlarms(Alarms.map(alarm => {
      if (alarm.id === alarmId) {
        const updatedDays = alarm.selectedDays.includes(dayKey)
          ? alarm.selectedDays.filter(day => day !== dayKey)
          : [...alarm.selectedDays, dayKey];
        return { ...alarm, selectedDays: updatedDays };
      }
      return alarm;
    }));
  }

  // Edit alarm functions
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

  function handleSaveEdit() {
    if (!editHours || !editMinutes) {
      alert("Please enter both hours and minutes");
      return;
    }

    const hours = parseInt(editHours);
    const minutes = parseInt(editMinutes);

    setAlarms(Alarms.map(alarm => {
      if (alarm.id === editingAlarm) {
        return {
          ...alarm,
          hours: hours,
          minutes: minutes,
          period: editPeriod,
          time: `${hours}:${minutes.toString().padStart(2, "0")}`
        };
      }
      return alarm;
    }));

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
        const dayOrder = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        return dayOrder.indexOf(a) - dayOrder.indexOf(b);
      })
      .map(dayKey => daysOfWeek.find(day => day.key === dayKey)?.label)
      .join(', ');
    
    return dayLabels;
  }

  function calculateTimeRemaining(alarm) {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();
    
    // Convert alarm time to 24-hour format
    let alarmHour = alarm.hours;
    if (alarm.period === 'PM' && alarm.hours !== 12) {
      alarmHour += 12;
    } else if (alarm.period === 'AM' && alarm.hours === 12) {
      alarmHour = 0;
    }
    
    // Create alarm time for today
    const today = new Date();
    today.setHours(alarmHour, alarm.minutes, 0, 0);
    
    let timeUntilAlarm = today.getTime() - now.getTime();
    
    // If alarm time has passed today, calculate for tomorrow
    if (timeUntilAlarm <= 0) {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      timeUntilAlarm = tomorrow.getTime() - now.getTime();
    }
    
    // If specific days are selected, find the next occurrence
    if (alarm.selectedDays.length > 0) {
      const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const currentDayIndex = now.getDay();
      
      let nextAlarmDate = null;
      
      // Check if alarm should ring today
      const todayKey = dayKeys[currentDayIndex];
      if (alarm.selectedDays.includes(todayKey) && today.getTime() > now.getTime()) {
        nextAlarmDate = today;
      } else {
        // Find next selected day
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
        // No days selected, return a message indicating this
        return "Select days first";
      }
    } else {
      // No days selected, return a message indicating this
      return "Select days first";
    }
    
    // Convert milliseconds to readable format
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
    <div className="h-screen w-full text-black bg-gradient-to-tl from-pink-200 via-purple-400 to-blue-300 relative">
      
      {/* Ringing Alarm Modal */}
      {ringingAlarm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center animate-pulse">
            <div className="text-6xl mb-4">🚨</div>
            <div className="text-2xl font-bold mb-2">ALARM!</div>
            <div className="text-xl mb-4">
              {ringingAlarm.time} {ringingAlarm.period}
            </div>
            <div className="text-sm text-gray-600 mb-6">
              {getSelectedDaysDisplay(ringingAlarm.selectedDays)}
            </div>
            <button
              onClick={stopAlarm}
              className="bg-red-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors"
            >
              Stop Alarm
            </button>
          </div>
        </div>
      )}

      {/* Current Time Display */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 z-50">
        <div className="text-lg font-mono font-bold text-center">
          {currentTime.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit',
            hour12: true 
          })}
        </div>
        <div className="text-xs text-gray-500 text-center">
          {currentTime.toLocaleDateString([], { 
            weekday: 'short',
            month: 'short',
            day: 'numeric'
          })}
        </div>
      </div>
      
      {/* Alarms Display Container */}
      {Alarms.length > 0 && (
        <div className="absolute top-4 left-4 right-4 h-[72vh] overflow-y-auto scrollbar-hide">
          <div 
            ref={AlarmsContainerRef}
            className="overflow-y-auto space-y-2  pr-2"
          >
            {Alarms.map((alarm) => (
              <div
                key={alarm.id}
                className={`bg-gray-500 text-white rounded-2xl p-4 scrollbar-hide overflow-y-auto transition-all duration-200 ${
                  alarm.isActive ? 'opacity-100' : 'opacity-60'
                } ${ringingAlarm && ringingAlarm.id === alarm.id ? 'ring-2 ring-red-500 animate-pulse' : ''}`}
              >
                {/* Time and Toggle Row */}
                <div className="flex items-center justify-between mb-3">
                  {editingAlarm === alarm.id ? (
                    // Edit Mode
                    <div className="flex items-center spac">
                      <input
                        type="number"
                        value={editHours}
                        onChange={handleEditHours}
                        onKeyDown={handleKeyDown}
                        className="w-16 bg-gray-700 text-white rounded-md px-2 py-1 text-2xl text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1"
                        max="12"
                      />
                      <span className="text-2xl">:</span>
                      <input
                        type="number"
                        value={editMinutes}
                        onChange={handleEditMinutes}
                        onKeyDown={handleKeyDown}
                        className="w-16 bg-gray-700 text-white rounded-md px-2 py-1 text-2xl text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                        max="59"
                      />
                      <div className="flex flex-col ml-2">
                        <div
                          onClick={() => setEditPeriod("AM")}
                          className={`px-3 py-2 text-sm rounded-t-md ${
                            editPeriod === "AM" ? "bg-gray-800" : "bg-gray-400 hover:bg-gray-200"
                          }`}
                        >
                          AM
                        </div>
                        <div
                          onClick={() => setEditPeriod("PM")}
                          className={`px-3 py-2 text-sm rounded-b-md  ${
                            editPeriod === "PM" ? "bg-gray-800" : "bg-gray-400 hover:bg-gray-200 "
                          }`}
                        >
                          PM
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Display Mode
                    <div className="flex items-baseline space-x-2">
                      <button
                        onClick={() => handleEditAlarm(alarm)}
                        className={`text-4xl font-light hover:text-blue-300 transition-colors cursor-pointer ${
                          alarm.isActive ? 'text-white' : 'text-gray-400'
                        }`}
                      >
                        {alarm.time}
                      </button>
                      <div className="text-2xl font-light text-gray-300">
                        {alarm.period.toLowerCase()}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-3">
                    {editingAlarm === alarm.id ? (
                      // Edit Mode Buttons
                      <>
                        <button
                          onClick={handleSaveEdit}
                          className="p-2 text-green-400 hover:text-green-300 hover:bg-gray-700 rounded-md transition-colors"
                        >
                          <Check className="h-8 w-8" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded-md transition-colors"
                        >
                          <X className="h-8 w-8" />
                        </button>
                      </>
                    ) : (
                      // Normal Mode Buttons
                      <>
                        {/* Toggle Switch */}
                        <div 
                          className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors ${
                            alarm.isActive ? 'bg-gray-800' : 'bg-gray-400'
                          }`}
                          onClick={() => handleToggleAlarm(alarm.id)}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              alarm.isActive ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </div>
                        
                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteAlarm(alarm.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-md transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Days Selection */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-300">
                      {getSelectedDaysDisplay(alarm.selectedDays)}
                    </div>
                    
                    {/* Time Remaining Display */}
                    {alarm.isActive && editingAlarm !== alarm.id && (
                      <div className="text-sm text-blue-300 font-medium">
                        {calculateTimeRemaining(alarm)}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    {daysOfWeek.map((day) => (
                      <button
                        key={day.key}
                        onClick={() => handleDayToggle(alarm.id, day.key)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                          alarm.selectedDays.includes(day.key)
                            ? 'bg-gray-800 text-white'
                            : 'bg-gray-400 text-gray-300 hover:bg-gray-500'
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
      <div className="flex flex-col px-5 gap-2 justify-evenly items-center absolute bottom-3 left-[calc(50vw-200px)] bg-white py-2 rounded-2xl shadow-lg">
        <div className="font-semibold">Set Time</div>
        <div className="flex w-fit gap-4">
          <div className="flex w-fit gap-4">
            <div className="flex flex-col w-fit justify-center">
              <div>
                <input
                  type="number"
                  value={inputHours}
                  className="w-16 border rounded-md border-gray-600 pl-3 text-center py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={1}
                  max={12}
                  placeholder="12"
                  onChange={handlesetInputHours}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <div className="text-gray-700 text-xs text-center">Hour</div>
            </div>
            <div className="flex items-center justify-center text-xl font-bold">
              :
            </div>
            <div className="flex flex-col w-fit justify-center">
              <div>
                <input
                  type="number"
                  value={inputMinutes}
                  className="w-16 border rounded-md border-gray-600 pl-3 text-center py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={0}
                  max={59}
                  placeholder="00"
                  onChange={handlesetInputMinutes}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <div className="text-gray-700 text-xs text-center">Minute</div>
            </div>
          </div>
          <div className="flex flex-col w-fit border border-gray-600 rounded-md">
            <div
              className={`px-3 py-1 ${
                amActive ? "bg-gray-600 text-white" : "hover:bg-gray-100"
              } rounded-t-md hover:cursor-pointer transition-colors text-center`}
              onClick={handleAM}
            >
              AM
            </div>
            <div className="border-t border-gray-300"></div>
            <div
              className={`px-3 py-1 ${
                pmActive ? "bg-gray-600 text-white" : "hover:bg-gray-100"
              } rounded-b-md hover:cursor-pointer transition-colors text-center`}
              onClick={handlePM}
            >
              PM
            </div>
          </div>
        </div>
        <div className="flex justify-evenly w-full gap-4">
          <button 
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleOK}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export default Alarm;