const API_DRIVERS = "http://localhost:3000/api/drivers";

export async function getAllDrivers() {
  const response = await fetch(API_DRIVERS, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  return data;
}
