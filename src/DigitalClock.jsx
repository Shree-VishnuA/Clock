import { useEffect, useState } from "react";

function DigitalClock() {
  const [time, setTime] = useState(new Date());
  const [city, setCity] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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

  async function getTime() {
    if (!city.trim()) {
      setError("Please enter a city name");
      setResult(null);
      return;
    }

    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      // First try with the city parameter
      let response = await fetch(
        `https://api.api-ninjas.com/v1/worldtime?city=${encodeURIComponent(
          city.trim()
        )}`,
        {
          headers: {
            "X-Api-Key": "PvrTMFtugj9tcQ5uTsK+9g==ai7eTBz7uRsAhMaP",
          },
        }
      );

      // If city doesn't work, try with timezone mapping
      if (!response.ok) {
        const cityMappings = {
          "new york": "America/New_York",
          london: "Europe/London",
          tokyo: "Asia/Tokyo",
          paris: "Europe/Paris",
          dubai: "Asia/Dubai",
          singapore: "Asia/Singapore",
          "los angeles": "America/Los_Angeles",
          berlin: "Europe/Berlin",
          moscow: "Europe/Moscow",
          beijing: "Asia/Shanghai",
          shanghai: "Asia/Shanghai",
          cairo: "Africa/Cairo",
          johannesburg: "Africa/Johannesburg",
          toronto: "America/Toronto",
          chicago: "America/Chicago",
          seattle: "America/Los_Angeles",
          miami: "America/New_York",
          "mexico city": "America/Mexico_City",
          "buenos aires": "America/Argentina/Buenos_Aires",
          "sao paulo": "America/Sao_Paulo",
          madrid: "Europe/Madrid",
          rome: "Europe/Rome",
          stockholm: "Europe/Stockholm",
          istanbul: "Europe/Istanbul",
          bangkok: "Asia/Bangkok",
          jakarta: "Asia/Jakarta",
          manila: "Asia/Manila",
          seoul: "Asia/Seoul",
          "hong kong": "Asia/Hong_Kong",
          taipei: "Asia/Taipei",
          melbourne: "Australia/Melbourne",
          perth: "Australia/Perth",
          auckland: "Pacific/Auckland",
          vancouver: "America/Vancouver",
          montreal: "America/Toronto",
          amsterdam: "Europe/Amsterdam",
          zurich: "Europe/Zurich",
          vienna: "Europe/Vienna",
          warsaw: "Europe/Warsaw",
          athens: "Europe/Athens",
          helsinki: "Europe/Helsinki",
          oslo: "Europe/Oslo",
          copenhagen: "Europe/Copenhagen",
          lisbon: "Europe/Lisbon",
          brussels: "Europe/Brussels",
          prague: "Europe/Prague",
          budapest: "Europe/Budapest",
          bucharest: "Europe/Bucharest",
          kiev: "Europe/Kiev",
          minsk: "Europe/Minsk",
          riga: "Europe/Riga",
          vilnius: "Europe/Vilnius",
          tallinn: "Europe/Tallinn",
          mumbai: "Asia/Kolkata",
          delhi: "Asia/Kolkata",
          "new delhi": "Asia/Kolkata",
          bangalore: "Asia/Kolkata",
          bengaluru: "Asia/Kolkata",
          hyderabad: "Asia/Kolkata",
          chennai: "Asia/Kolkata",
          kolkata: "Asia/Kolkata",
          ahmedabad: "Asia/Kolkata",
          pune: "Asia/Kolkata",
          surat: "Asia/Kolkata",
          jaipur: "Asia/Kolkata",
          lucknow: "Asia/Kolkata",
          kanpur: "Asia/Kolkata",
          nagpur: "Asia/Kolkata",
          indore: "Asia/Kolkata",
          bhopal: "Asia/Kolkata",
          patna: "Asia/Kolkata",
          ranchi: "Asia/Kolkata",
          guwahati: "Asia/Kolkata",
          kochi: "Asia/Kolkata",
          trivandrum: "Asia/Kolkata",
          thiruvananthapuram: "Asia/Kolkata",
          visakhapatnam: "Asia/Kolkata",
          vijayawada: "Asia/Kolkata",
          madurai: "Asia/Kolkata",
          coimbatore: "Asia/Kolkata",
          mysore: "Asia/Kolkata",
          vellore: "Asia/Kolkata",
          noida: "Asia/Kolkata",
          ghaziabad: "Asia/Kolkata",
          faridabad: "Asia/Kolkata",
          gurgaon: "Asia/Kolkata",
          gandhinagar: "Asia/Kolkata",
          vadodara: "Asia/Kolkata",
          nashik: "Asia/Kolkata",
          aurangabad: "Asia/Kolkata",
          amritsar: "Asia/Kolkata",
          ludhiana: "Asia/Kolkata",
          jalandhar: "Asia/Kolkata",
          shimla: "Asia/Kolkata",
          dehradun: "Asia/Kolkata",
          haridwar: "Asia/Kolkata",
          agra: "Asia/Kolkata",
          varanasi: "Asia/Kolkata",
          allahabad: "Asia/Kolkata",
          meerut: "Asia/Kolkata",
          jodhpur: "Asia/Kolkata",
          udaipur: "Asia/Kolkata",
          raipur: "Asia/Kolkata",
          bilaspur: "Asia/Kolkata",
          panaji: "Asia/Kolkata",
          goa: "Asia/Kolkata",
          siliguri: "Asia/Kolkata",
          dhanbad: "Asia/Kolkata",
          jamnagar: "Asia/Kolkata",
          jalgaon: "Asia/Kolkata",
          hosur: "Asia/Kolkata",
          tiruchirappalli: "Asia/Kolkata",
          salem: "Asia/Kolkata",
        };

        const cityLower = city.toLowerCase().trim();
        const timezone = cityMappings[cityLower];

        if (timezone) {
          response = await fetch(
            `https://api.api-ninjas.com/v1/worldtime?timezone=${timezone}`,
            {
              headers: {
                "X-Api-Key": "PvrTMFtugj9tcQ5uTsK+9g==ai7eTBz7uRsAhMaP",
              },
            }
          );
        }
      }

      if (!response.ok) {
        throw new Error(
          `City "${city}" not found. Please try a different city name.`
        );
      }

      const data = await response.json();
      console.log("API Response:", data); // Debug log

      // Create date from the datetime string
      const datetime = new Date(data.datetime);

      // Handle UTC offset calculation
      let utcOffset = "UTC+00:00";
      if (data.hour !== undefined) {
        const offsetHours = Math.floor(Math.abs(data.hour));
        const offsetMinutes = Math.abs(
          (Math.abs(data.hour) - offsetHours) * 60
        );
        const offsetSign = data.hour >= 0 ? "+" : "-";
        utcOffset = `UTC${offsetSign}${offsetHours
          .toString()
          .padStart(2, "0")}:${Math.round(offsetMinutes)
          .toString()
          .padStart(2, "0")}`;
      }

      setResult({
        cityName: city.replace(/\b\w/g, (c) => c.toUpperCase()),
        time: datetime.toLocaleTimeString("en-US", {
          hour12: true,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        date: datetime.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        timezone: data.timezone || "Unknown",
        utcOffset: utcOffset,
        dayOfWeek:
          data.day_of_week ||
          datetime.toLocaleDateString("en-US", { weekday: "long" }),
      });
    } catch (error) {
      console.error("Full Error:", error);
      setError(
        `Error: ${error.message}. Try cities like: London, New York, Tokyo, Paris, Mumbai, Sydney`
      );
    } finally {
      setIsLoading(false);
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      getTime();
    }
  };

  return (
    <div className="h-screen bg-gradient-to-tl from-stone-400 via-slate-400 to-stone-400 dark:from-stone-800 dark:via-slate-800 dark:to-stone-800 px-3 sm:p-5">
      <div className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-lg p-2 sm:p-3 z-50 border border-white/30 dark:border-slate-600 shadow-lg">
        <div className="text-black dark:text-white text-sm sm:text-lg font-mono font-bold">
          Local: {formatTime()}
        </div>
      </div>

      <div className="flex sm:items-center sm:justify-center sm:h-screen py-5 sm:py-8">
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-3xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-2xl border border-white/30 dark:border-slate-600 w-full max-w-xs sm:max-w-md md:max-w-lg text-center mx-auto">
          <div className="text-2xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-6 sm:mb-8">
            World Clock
          </div>

          <div className="mb-6 sm:mb-8">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter city name (e.g., London, Tokyo)"
              className="w-full p-3 sm:p-4 border-2 border-gray-500 dark:border-slate-500 rounded-full text-base sm:text-lg text-black dark:text-white outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:shadow-lg transition-all duration-300 bg-white/90 dark:bg-slate-700/90 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
            <button
              onClick={getTime}
              disabled={isLoading}
              className="mt-3 sm:mt-4 w-fit sm:w-auto bg-gray-600 dark:bg-slate-600 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:shadow-lg hover:scale-105 active:scale-95 hover:bg-gray-700 dark:hover:bg-slate-700 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                  Searching...
                </span>
              ) : (
                "Get Time"
              )}
            </button>
          </div>

          {result && (
            <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-white/80 dark:bg-slate-700/80 rounded-xl sm:rounded-2xl border-l-4 border-blue-500 dark:border-blue-400 animate-fade-in">
              <div className="text-xl sm:text-2xl text-gray-800 dark:text-gray-100 font-semibold mb-2 sm:mb-3 break-words">
                {result.cityName}
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl text-blue-600 dark:text-blue-400 font-light mb-2 sm:mb-3 font-mono break-all">
                {result.time}
              </div>
              <div className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 break-words">
                {result.date}
              </div>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-slate-600 p-2 sm:p-3 rounded-lg space-y-1">
                <div className="break-all">Timezone: {result.timezone}</div>
                <div>UTC Offset: {result.utcOffset}</div>
                <div>Day: {result.dayOfWeek}</div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-400 rounded-xl sm:rounded-2xl animate-fade-in">
              <div className="text-red-600 dark:text-red-400 text-base sm:text-lg break-words">
                ❌ {error}
              </div>
            </div>
          )}

          <div className="mt-4 sm:mt-6 text-left text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            
            <div className="break-words leading-relaxed">
              <span className="font-medium">Major cities:</span> London, New
              York, Tokyo, Paris, Dubai, Sydney, Mumbai, Singapore, Los Angeles,
              Berlin, Moscow, Beijing
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export default DigitalClock;
