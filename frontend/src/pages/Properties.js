import React, { useContext, useEffect, useState } from "react";
import { addProperty, deleteProperty, getAllRecords, updateProperty } from "../repository/propertyData";
import UserContext from "../repository/userContext";

function Properties() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    accountNumber: null,
    suite: "",
    houseNumber: null,
    streetName: "",
    garage: false,
    neighbourhoodId: null,
    neighbourhood: "",
    ward: "",
    assessedValue: null,
    latitude: null,
    longitude: null,
    assessmentClass1: "",
    pointLocation: "",
    createTime: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [filteredData, setFilteredData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  const { token } = useContext(UserContext);


  useEffect(() => {
    getAllRecords(token).then((data) => {
      setData(data);
      setFilteredData(data);
    })
  }, [token, data.length])

  const [currentItems, setCurrentItems] = useState([]);
  const [visiblePageNumbers, setVisiblePageNumbers] = useState([]);

  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setCurrentItems(filteredData.slice(indexOfFirstItem, indexOfLastItem));

    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    const pagesToShow = 20;
    const startPage = Math.max(currentPage - Math.floor(pagesToShow / 2), 1);
    const endPage = Math.min(startPage + pagesToShow - 1, totalPages);

    setVisiblePageNumbers(pageNumbers.filter(number => number >= startPage && number <= endPage));
  }, [currentPage, itemsPerPage, filteredData]);

  const handleClick = (event) => {
    setCurrentPage(Number(event.target.id));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(form);
    if (form.accountNumber) {
      // Update existing record
      const updatedRecord = await updateProperty(token, form);
      // Handle the updated record
      if (!updatedRecord.ok) {
        setErrorMessage(updatedRecord.message);
      }
      else {
        setData(data.map(item => item.accountNumber === form.accountNumber ? updatedRecord : item));
        setFilteredData(filteredData.map(item => item.accountNumber === form.accountNumber ? updatedRecord : item));
        setErrorMessage("Record updated successfully.");
      }
    } else {
      // Create new record
      const newRecord = await addProperty(token, form);
      console.log(newRecord);
      if (!newRecord.ok) {
        setErrorMessage(newRecord.message);
      }
      else {
        // Handle the new record
        setData([newRecord, ...data]);
        setFilteredData([newRecord, ...data]);
        setErrorMessage("Record added successfully.");
      }

    }
  };
  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const results = data.filter((item) =>
      item.streetName.toLowerCase().includes(searchTerm)
    );
    setFilteredData(results);
  };

  const handleDelete = async (accountNumber) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this record?');
    if (confirmDelete) {
      // Delete the record if the user clicked OK
      const response = await deleteProperty(token, accountNumber);
      console.log(response);
      if (!response.ok) {
        setErrorMessage(response.message);
      }
      else {
        await new Promise(resolve => {
          setData(data.filter(item => item.accountNumber !== accountNumber));
          setFilteredData(filteredData.filter(item => item.accountNumber !== accountNumber));
          resolve();
        });
        setErrorMessage("Record deleted successfully.");
      }
    }
  };

  const clearForm = () => {
    setForm({
      accountNumber: "",
      suite: "",
      houseNumber: "",
      streetName: "",
      garage: false,
      neighbourhoodId: "",
      neighbourhood: "",
      ward: "",
      assessedValue: null,
      latitude: "",
      longitude: "",
      assessmentClass1: "",
      pointLocation: "",
      createTime: "",
    });
  };
  // Render the form, table, and search bar
  return (
    <div
      style={{ height: "calc(100vh - 5rem)" }}
      className="flex flex-col justify-start p-5"
    >
      <h1 className=" text-3xl font-light mb-5">CRUD Properties</h1>
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-4 gap-4 pb-5 border-b-2 border-dashed border-gray-600"
      >
        <div>
          <label
            htmlFor="accountNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Account Number
          </label>
          <input
            disabled={true}
            type="text"
            id="accountNumber"
            name="accountNumber"
            value={form.accountNumber}
            onChange={(e) =>
              setForm({ ...form, accountNumber: e.target.value })
            }
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="suite"
            className="block text-sm font-medium text-gray-700"
          >
            Suite
          </label>
          <input
            type="text"
            id="suite"
            name="suite"
            value={form.suite}
            onChange={(e) => setForm({ ...form, suite: e.target.value })}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="houseNumber"
            className="block text-sm font-medium text-gray-700"
          >
            House Number
          </label>
          <input
            type="text"
            id="houseNumber"
            name="houseNumber"
            value={form.houseNumber}
            onChange={(e) => setForm({ ...form, houseNumber: e.target.value })}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="streetName"
            className="block text-sm font-medium text-gray-700"
          >
            Street Name
          </label>
          <input
            type="text"
            id="streetName"
            name="streetName"
            value={form.streetName}
            onChange={(e) => setForm({ ...form, streetName: e.target.value })}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="garage"
            className="block text-sm font-medium text-gray-700"
          >
            Garage
          </label>
          <input
            type="checkbox"
            id="garage"
            name="garage"
            value={form.garage}
            onChange={(e) => setForm({ ...form, garage: e.target.value })}
            className="mt-1 w-8 h-8 py-2 px-3 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="neighbourhoodId"
            className="block text-sm font-medium text-gray-700"
          >
            Neighbourhood Id
          </label>
          <input
            type="text"
            id="neighbourhoodId"
            name="neighbourhoodId"
            value={form.neighbourhoodId}
            onChange={(e) =>
              setForm({ ...form, neighbourhoodId: e.target.value })
            }
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="neighbourhood"
            className="block text-sm font-medium text-gray-700"
          >
            Neighbourhood
          </label>
          <input
            type="text"
            id="neighbourhood"
            name="neighbourhood"
            value={form.neighbourhood}
            onChange={(e) =>
              setForm({ ...form, neighbourhood: e.target.value })
            }
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="ward"
            className="block text-sm font-medium text-gray-700"
          >
            Ward
          </label>
          <input
            type="text"
            id="ward"
            name="ward"
            value={form.ward}
            onChange={(e) => setForm({ ...form, ward: e.target.value })}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="assessedValue"
            className="block text-sm font-medium text-gray-700"
          >
            Assessed Value
          </label>
          <input
            type="text"
            id="assessedValue"
            name="assessedValue"
            value={form.assessedValue}
            onChange={(e) =>
              setForm({ ...form, assessedValue: e.target.value })
            }
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="latitude"
            className="block text-sm font-medium text-gray-700"
          >
            Latitude
          </label>
          <input
            type="text"
            id="latitude"
            name="latitude"
            value={form.latitude}
            onChange={(e) => setForm({ ...form, latitude: e.target.value })}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="longitude"
            className="block text-sm font-medium text-gray-700"
          >
            Longitude
          </label>
          <input
            type="text"
            id="longitude"
            name="longitude"
            value={form.longitude}
            onChange={(e) => setForm({ ...form, longitude: e.target.value })}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="assessmentClass1"
            className="block text-sm font-medium text-gray-700"
          >
            Assessment Class 1
          </label>
          <input
            type="text"
            id="assessmentClass1"
            name="assessmentClass1"
            value={form.assessmentClass1}
            onChange={(e) =>
              setForm({ ...form, assessmentClass1: e.target.value })
            }
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="pointLocation"
            className="block text-sm font-medium text-gray-700"
          >
            Point Location
          </label>
          <input
            type="text"
            id="pointLocation"
            name="pointLocation"
            value={form.pointLocation}
            onChange={(e) =>
              setForm({ ...form, pointLocation: e.target.value })
            }
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="createTime"
            className="block text-sm font-medium text-gray-700"
          >
            Create Time
          </label>
          <input
            disabled
            type="text"
            id="createTime"
            name="createTime"
            value={form.createTime}
            onChange={(e) => setForm({ ...form, createTime: e.target.value })}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="col-span flex items-end">
          <button
            className="w-full bg-sky-500 text-white rounded h-9"
            onClick={() => clearForm()}
          >
            Clear
          </button>
        </div>

        <div className="col-span flex items-end">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white rounded h-9"
          >
            Submit
          </button>
        </div>
      </form>
      {/* Search bar */}
      <div className="my-5">
        <label
          htmlFor="search"
          className="block text-sm font-medium text-gray-700 mb-3"
        >
          Search
        </label>
        <input
          type="text"
          id="search"
          onChange={handleSearch}
          className="w-full px-3 py-2 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300"
          placeholder="Search by street name"
        />
      </div>
      {errorMessage && <div className="text-sky-800 bg-sky-100 border border-sky-400 p-4 mb-4 rounded">{errorMessage}</div>}
      {/* Table */}
      {filteredData.length > 0 ? (
        <table className="table-auto w-full text-left">
          <thead>
            <tr>
              <th>Street Name</th>
              <th>Account Number</th>
              <th>House Number</th>
              <th>Garage</th>
              <th>Neighbourhood</th>
              <th>Assessed Value</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr key={item.id}>
                <td>{item.streetName}</td>
                <td>{item.accountNumber}</td>
                <td>{item.houseNumber}</td>
                <td>{item.garage ? "Yes" : "No"}</td>
                <td>{item.neighbourhood}</td>
                <td>{item.assessedValue}</td>
                <td>
                  <button
                    onClick={() => setForm(item)}
                    className="bg-blue-500 text-white rounded px-2 py-1 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.accountNumber)}
                    className="bg-red-500 text-white rounded px-2 py-1"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data</p>
      )}
      {/* Pagination */}
      <ul className="pagination flex justify-center space-x-2">
        {visiblePageNumbers.map((number) => (
          <li
            key={number}
            id={number}
            onClick={handleClick}
            className={`cursor-pointer p-2 border rounded ${currentPage === number ? "bg-blue-500 text-white" : ""}`}
          >
            {number}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Properties;
