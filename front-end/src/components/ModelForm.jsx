/* eslint-disable react/prop-types */
import { useState } from "react";

const ModalForm = ({ setModelOpen }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      const userId = localStorage.getItem("userId");

      if (userId) {
        // submission call to the backend
        fetch(`${import.meta.env.VITE_BACKEND_URL}/highest-score`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            name,
          }),
        })
          .then((res) => res.json())
          .then((data) => console.log(data));
      }
      setName(""); // Reset the input field after submission
      setModelOpen(false); // Close the modal after form submission
    }
  };

  const onClose = () => {
    setModelOpen(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4 text-green-600">
          Congratulations!
        </h2>
        <p className="text-gray-700 mb-4">
          You have beaten the previous best score!
        </p>
        <h3 className="text-lg font-medium mb-4">
          Enter your name to save your score:
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 mb-2">
              Name:
            </label>
            <input
              type="text"
              id="name"
              className="w-full p-2 border border-gray-300 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Submit
            </button>
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalForm;
