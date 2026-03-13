export async function getPrediction(data) {
  const response = await fetch("http://localhost:8000/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  const result = await response.json();
  return result;
}

export async function getRecommendations(aqi, noise, water) {
  const response = await fetch("/api/ai/recommendations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ aqi, noise, water })
  });
  const result = await response.json();
  return result;
}

export async function chat(message) {
  const response = await fetch("/api/ai/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message })
  });
  const result = await response.json();
  return result;
}