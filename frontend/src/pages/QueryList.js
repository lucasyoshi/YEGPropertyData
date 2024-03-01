import React, { useState } from "react";
import { getPropertyDataList, getTestData } from "../repository/propertyData";

const QueryList = () => {
  const [neighbourhood, setNeighbourhood] = useState("");
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [result, setResult] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Calculate the total number of pages
  const totalPages = result ? Math.ceil(result.length / itemsPerPage) : 0;

  // Get the items for the current page
  const currentItems = result ? result.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) : [];
  
  const handleSubmit = async (event) => {
    console.log("finding property...");
    event.preventDefault();

    getPropertyDataList(neighbourhood, minValue, maxValue).then((data) => {
      setResult(data);
    });
  };
  return (
    <div
      style={{ height: "calc(100vh - 5rem)" }}
      className="flex flex-col justify-start p-5"
    >
      <h1 className=" text-3xl font-light mb-5">Find Property</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-4 w-full">
        <label htmlFor="neighbourhood">
          Neighbourhood
          <input
            type="text"
            id="neighbourhood"
            name="neighbourhood"
            value={neighbourhood}
            onChange={(e) => setNeighbourhood(e.target.value)}
            placeholder="Neighbourhood"
            className="border rounded w-full h-12 p-2"
          />
        </label>
        <label htmlFor="minValue">
          Min Value
          <input
            type="text"
            id="minValue"
            name="minValue"
            value={minValue}
            onChange={(e) => setMinValue(e.target.value)}
            placeholder="Min Value"
            className="border rounded w-full h-12 p-2"
          />
        </label>
        <label htmlFor="maxValue">
          Max Value
          <input
            type="text"
            id="maxValue"
            name="maxValue"
            value={maxValue}
            onChange={(e) => setMaxValue(e.target.value)}
            placeholder="Max Value"
            className="border rounded w-full h-12 p-2"
          />
        </label>

        <div className="col-span flex items-end">
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded h-12"
          >
            Search
          </button>
        </div>
      </form>
      {result ? (
        <div className="p-5">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="border px-4 py-2">House Number</th>
                <th className="border px-4 py-2">Street Name</th>
                <th className="border px-4 py-2">Assessed Value</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{item.houseNumber}</td>
                  <td className="border px-4 py-2">{item.streetName}</td>
                  <td className="border px-4 py-2">{item.assessedValue}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center mt-4">
            <button
              className={`px-4 py-2 ${currentPage === 1 ? "cursor-not-allowed opacity-50" : ""}`}
              onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
            >
              Previous
            </button>
            <button
              className={`px-4 py-2 ${currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""}`}
              onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center">No results</p>
      )}
    </div>
  );
};

export default QueryList;
