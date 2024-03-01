import { API_URL } from "../config";

export async function SignIn(username, password) {
  const URL = `${API_URL}/login/enter`;
  
  const response = await fetch(URL, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}