import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div className="fixed w-screen justify-evenly items-center sm:h-[100vh] h-20 sm:w-25 sm:bg-gradient-to-b from-stone-400 to-stone-400 dark:from-stone-800 dark:to-stone-800 flex sm:flex-col sm:justify-evenly z-100 sm:items-center backdrop-blur-lg border-b-2 sm:border-b-0 sm:border-r-2 border-stone-700 dark:border-stone-500 bg-stone-400 dark:bg-stone-800">
      <NavLink to={"/"}>
        {({ isActive }) => (
          <div
            className={`${
              isActive
                ? "sm:text-gray-600 sm:border-3 sm:shadow-lg shadow-stone-500  dark:sm:shadow-amber-50 border-2 border-black dark:border-white sm:bg-slate-400 dark:sm:bg-slate-700 bg-slate-400 dark:bg-slate-700"
                : "sm:text-black dark:sm:text-white"
            } rounded-full`}
          >
            <img
              src="logo.png"
              alt=""
              className={`rounded-full bg-stone-300 w-12 sm:w-18 dark:bg-stone-600 `}
            />
          </div>
        )}
      </NavLink>
      <NavLink to={"Alarm"}>
        {({ isActive }) => (
          <div
            className={`sm:w-15 w-12 flex flex-col shadow-2xl sm:bg-stone-300 dark:sm:bg-stone-700 text-black dark:text-white text-xs sm:text-sm justify-center items-center py-2 sm:py-3 sm:px-9 rounded-md hover:cursor-pointer hover:border-2 hover:border-gray-800 dark:hover:border-gray-300 ${
              isActive
                ? "sm:text-gray-600 dark:sm:text-gray-300 sm:border-3 sm:shadow-md sm:shadow-amber-50 border-2 border-black dark:border-white sm:bg-slate-400 dark:sm:bg-slate-700 bg-slate-400 dark:bg-slate-700"
                : "sm:text-black dark:sm:text-white"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
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
            <p>Alarm</p>
          </div>
        )}
      </NavLink>
      <NavLink to={"DigitalClock"}>
        {({ isActive }) => (
          <div
            className={`sm:w-15 w-12 flex flex-col shadow-2xl sm:bg-stone-300 dark:sm:bg-stone-700 text-black dark:text-white text-xs sm:text-sm justify-center items-center py-2 sm:py-3 sm:px-9 rounded-md hover:cursor-pointer hover:border-2 hover:border-gray-800 dark:hover:border-gray-300 ${
              isActive
                ? "sm:text-gray-600 dark:sm:text-gray-300 sm:border-3 sm:shadow-md sm:shadow-amber-50 border-2 border-black dark:border-white sm:bg-slate-400 dark:sm:bg-slate-700 bg-slate-400 dark:bg-slate-700"
                : "sm:text-black dark:sm:text-white"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
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
            <p>Clock</p>
          </div>
        )}
      </NavLink>
      <NavLink to={"Timer"}>
        {({ isActive }) => (
          <div
            className={`sm:w-15 w-12 flex flex-col shadow-2xl sm:bg-stone-300 dark:sm:bg-stone-700 text-black dark:text-white text-xs sm:text-sm justify-center items-center py-2 sm:py-3 sm:px-9 rounded-md hover:cursor-pointer hover:border-2 hover:border-gray-800 dark:hover:border-gray-300 ${
              isActive
                ? "sm:text-gray-600 dark:sm:text-gray-300 sm:border-3 sm:shadow-md sm:shadow-amber-50 border-2 border-black dark:border-white sm:bg-slate-400 dark:sm:bg-slate-700 bg-slate-400 dark:bg-slate-700"
                : "sm:text-black dark:sm:text-white"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
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
            <p>Timer</p>
          </div>
        )}
      </NavLink>
      <NavLink to={"Stopwatch"}>
        {({ isActive }) => (
          <div
            className={`sm:w-15 w-12 flex flex-col shadow-2xl sm:bg-stone-300 dark:sm:bg-stone-700 text-black dark:text-white text-xs sm:text-sm justify-center items-center py-2 sm:py-3 sm:px-9 rounded-md hover:cursor-pointer hover:border-2 hover:border-gray-800 dark:hover:border-gray-300 ${
              isActive
                ? "sm:text-gray-600 dark:sm:text-gray-300 sm:border-3 dark:sm:shadow-md  sm:shadow-amber-50 border-2 border-black dark:border-white sm:bg-slate-400 dark:sm:bg-slate-700 bg-slate-400 dark:bg-slate-700"
                : "sm:text-black dark:sm:text-white"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
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
            <p className="text-[9px] md:text-sm">Stopwatch</p>
          </div>
        )}
      </NavLink>
    </div>
  );
}
export default Sidebar;
