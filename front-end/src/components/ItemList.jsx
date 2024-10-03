/* eslint-disable react/prop-types */
import { useState } from "react";

const ItemList = ({ items, foundItems, result }) => {
  const [highestScore, setHighestScore] = useState(null);

  // get the highest score
  fetch(`${import.meta.env.VITE_BACKEND_URL}/highest-score`)
    .then((res) => res.json())
    .then((data) => setHighestScore(data));

  return (
    <div className="flex flex-col justify-center items-center py-4">
      {/* Highest Score Display */}
      {highestScore !== null && (
        <div className="mb-4 text-lg font-semibold text-green-600">
          Highest Score: {highestScore}
        </div>
      )}

      {/* Item List */}
      <ul className="grid grid-cols-2 gap-4">
        {items.map((item) => (
          <li
            key={item.id}
            className={`p-4 border rounded-md text-center cursor-pointer transition-all transform hover:scale-105 flex justify-center items-center ${
              foundItems.includes(item.id)
                ? "line-through bg-gray-400 text-white"
                : "bg-blue-500 text-white"
            }`}
            style={{
              minWidth: "100px",
              minHeight: "50px", // Adjust for a larger box
            }}
          >
            {item.name}
          </li>
        ))}
      </ul>

      {/* Predefined area for result */}
      <div className="mt-6">
        {/* This area can be used for additional result-related information */}
        <p className="text-white-1000">
          {/* Placeholder for future results or messages */}
          {result && result}
        </p>
      </div>
    </div>
  );
};

export default ItemList;
