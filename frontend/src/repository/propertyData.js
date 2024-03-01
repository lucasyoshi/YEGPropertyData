import { API_URL } from "../config";

export async function getTestData() {
  const URL = `${API_URL}/properties/getTestData`;
  const response = await fetch(URL);
  const data = await response.json();
  return data;
}

export async function getPropertyData(houseNumber, streetName, suite) {
  const URL = `${API_URL}/properties/query?houseNumber=${houseNumber}&streetName=${streetName}&suite=${suite}`;
  const response = await fetch(URL);
  const data = await response.json();
  return data;
}

export async function getPropertyDataList(neighbourhood, minValue, maxValue) {
  const URL = `${API_URL}/properties/assessedValue?neighbourhood=${neighbourhood}&minValue=${minValue}&maxValue=${maxValue}`;
  const response = await fetch(URL);
  const data = await response.json();
  return data;
}

export async function getAllRecords(token) {
  const URL = `${API_URL}/properties/allRecords`;
  const response = await fetch(URL, { method: "GET", headers: { Authorization: `Bearer ${token}` } });
  const data = await response.json();
  return data;
}

export async function addProperty(token, formData) {
  const URL = `${API_URL}/properties/addProperty`;
  const response = await fetch(URL, {
    method: "POST",
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  });
  const data = await response.json();
  return data;
}

export async function deleteProperty(token, propertyId) {
  const URL = `${API_URL}/properties/deleteProperty/${propertyId}`;
  const response = await fetch(URL, {
    method: "DELETE",
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  const data = await response.text();
  return data;
}

export async function updateProperty(token, formData) {
  const URL = `${API_URL}/properties/updateProperty/${formData.accountNumber}`;
  const response = await fetch(URL, {
    method: "PUT",
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  });
  const data = await response.json();
  return data;
}