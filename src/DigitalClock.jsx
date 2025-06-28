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
      const cityMappings = {
        "new york": "America/New_York",
        london: "Europe/London",
        tokyo: "Asia/Tokyo",
        paris: "Europe/Paris",
        dubai: "Asia/Dubai",
        sydney: "Australia/Sydney",
        mumbai: "Asia/Kolkata",
        singapore: "Asia/Singapore",
        "los angeles": "America/Los_Angeles",
        berlin: "Europe/Berlin",
        moscow: "Europe/Moscow",
        beijing: "Asia/Shanghai",
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
      };

      const cityLower = city.toLowerCase().trim();
      const timezone = cityMappings[cityLower];

      if (!timezone) {
        throw new Error(
          `City "${city}" not found. Please try a major city name.`
        );
      }

      const response = await fetch(
        `https://api.api-ninjas.com/v1/worldtime?city=${timezone}`,
        {
          headers: {
            "My-Api-Key": "PvrTMFtugj9tcQ5uTsK+9g==ai7eTBz7uRsAhMaP",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch time data");
      }

      const data = await response.json();
      const datetime = new Date(data.datetime);

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
        timezone: data.timezone,
        utcOffset: `UTC${data.hour >= 0 ? "+" : "-"}${Math.abs(data.hour)
          .toString()
          .padStart(2, "0")}:00`,
      });
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "Could not fetch time data.");
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
    <div className="min-h-screen bg-gradient-to-bl from-pink-200 via-purple-400 to-pink-200 p-5">
      {/* Local Clock */}
      <div className="fixed bottom-4 right-4 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-3">
        <div className="text-black text-lg font-mono font-bold">
          Local: {formatTime()}
        </div>
      </div>

      {/* Main Container */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white backdrop-blur-3xl rounded-3xl p-10 shadow-2xl w-full max-w-lg text-center">
          <h1 className="text-4xl font-light text-gray-800 mb-8">
            🌍 World Clock
          </h1>

          <div className="mb-8">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter city name (e.g., London, New York, Tokyo)"
              className="w-full p-4 border-2 border-gray-500 rounded-full text-lg text-black outline-none focus:border-blue-500 focus:shadow-lg transition-all duration-300 bg-white bg-opacity-90"
            />
            <button
              onClick={getTime}
              disabled={isLoading}
              className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-10 py-4 rounded-full text-lg font-semibold hover:shadow-lg hover:scale-103 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Searching...
                </span>
              ) : (
                "Get Time"
              )}
            </button>
          </div>

          {/* Results */}
          {result && (
            <div className="mt-8 p-6 bg-white bg-opacity-80 rounded-2xl border-l-4 border-blue-500 animate-fade-in">
              <div className="text-2xl text-gray-800 font-semibold mb-3">
                {result.cityName}
              </div>
              <div className="text-4xl text-blue-600 font-light mb-3 font-mono">
                {result.time}
              </div>
              <div className="text-lg text-gray-600 mb-4">{result.date}</div>
              <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
                <div>Timezone: {result.timezone}</div>
                <div>UTC Offset: {result.utcOffset}</div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-8 p-6 bg-red-50 border-l-4 border-red-500 rounded-2xl animate-fade-in">
              <div className="text-red-600 text-lg">❌ {error}</div>
            </div>
          )}

          {/* Suggestions */}
          <div className="mt-6 text-left text-sm text-gray-600">
            <div className="font-semibold text-gray-800 mb-2">
              Popular cities:
            </div>
            <div>
              London, New York, Tokyo, Paris, Dubai, Sydney, Mumbai, Singapore,
              Los Angeles, Berlin
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DigitalClock;
