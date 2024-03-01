import React, { useContext, useState } from "react";
import { getPropertyData, getTestData } from "../repository/propertyData";
import UserContext from "../repository/userContext";

const Query = () => {
  const [houseNumber, setHouseNumber] = useState("");
  const [streetName, setStreetName] = useState("");
  const [suite, setSuite] = useState("");
  const [result, setResult] = useState(null);
  const { user, token } = useContext(UserContext);

  const handleSubmit = async (event) => {
    console.log("finding property...");
    event.preventDefault();

    getPropertyData(houseNumber, streetName, suite)
      .then((data) => {
        setResult(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div style={{height: "calc(100vh - 5rem)"}} className="flex flex-col items-center justify-center p-5">
      <h1 className=" text-3xl font-light mb-5">Find Property</h1>
      <h2 className="text-xl font-light mb-5">Welcome {user?.username}</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 w-full">
        <label htmlFor="houseNumber">
          House Number
          <input
            type="text"
            id="houseNumber"
            name="houseNumber"
            value={houseNumber}
            onChange={(e) => setHouseNumber(e.target.value)}
            placeholder="House Number"
            className="border rounded w-full h-12 p-2"
          />
        </label>
        <label htmlFor="suite">
          Suite
          <input
            type="text"
            id="suite"
            name="suite"
            value={suite}
            onChange={(e) => setSuite(e.target.value)}
            placeholder="Suite"
            className="border rounded w-full h-12 p-2"
          />
        </label>
        <label htmlFor="streetName" className="col-span-2">
          Street Name
          <input
            type="text"
            id="streetName"
            name="streetName"
            value={streetName}
            onChange={(e) => setStreetName(e.target.value)}
            placeholder="Street Name"
            className="border rounded w-full h-12 p-2"
          />
        </label>
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded col-span-2"
        >
          Search
        </button>
      </form>
      {result && (
        <div className="mt-5 p-5 border-2 rounded drop-shadow-sm">
          <h2>House Number: {result.houseNumber}</h2>
          <p>Street Name: {result.streetName}</p>
          <p>Neighbourhood: {result.neighbourhood}</p>
          <p>Assessed Value: {result.assessedValue}</p>
        </div>
      )}
    </div>
  );
};

export default Query;
