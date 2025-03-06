import axios from "axios";

const API_BASE_URL = "https://www.wtvehiclesapi.sgambe.serv00.net/api/vehicles?limit=200&page=0&type=tank&isPremium=true&isPack=true&isSquadronVehicle=true&isOnMarketplace=true&excludeKillstreak=true&excludeEventVehicles=true";

// Fetch all vehicles (with correct filters)
export const fetchVehicles = async () => {
  try {
    const apiUrl = `${API_BASE_URL}/vehicles?limit=200&page=0&isPremium=false&isPack=false&isSquadronVehicle=false&isOnMarketplace=false&excludeKillstreak=true&excludeEventVehicles=true`;
    
    const response = await axios.get(apiUrl, {
      headers: { "Accept": "application/json" },
    });

    console.log("API Response:", response.data); // Debugging log

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching vehicle data:", error);
    return [];
  }
};

// Fetch vehicle details by name
export const fetchVehicleDetails = async (vehicleName) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/vehicles`, {
        params: { name: vehicleName },
      });
  
      console.log(`API Response for ${vehicleName}:`, response.data); // Debugging log
  
      return response.data.length ? response.data[0] : null;
    } catch (error) {
      console.error(`Error fetching details for ${vehicleName}:`, error);
      return null;
    }
  };
  
