// File: src/lib/googleMapsLoader.js

let isLoaded = false;

export function loadGoogleMaps() {
  if (isLoaded) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        console.error("Google Maps API Key is not defined in .env file.");
        return reject(new Error("Missing API Key"));
    }

    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      isLoaded = true;
      resolve();
    };

    script.onerror = () => {
      reject(new Error("Google Maps script failed to load."));
    };

    document.head.appendChild(script);
  });
}