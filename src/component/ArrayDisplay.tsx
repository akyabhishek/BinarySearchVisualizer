import React from "react";

interface ArrayDisplayProps {
  array: number[];
  low: number;
  high: number;
  mid: number | null;
}

const ArrayDisplay: React.FC<ArrayDisplayProps> = ({
  array,
  low,
  high,
  mid,
}) => {
  const itemsPerRow = 10; // Limit items per row

  // Split the array into subarrays for each row
  const rows = [];
  for (let i = 0; i < array.length; i += itemsPerRow) {
    rows.push(array.slice(i, i + itemsPerRow));
  }

  return (
    <div className="flex flex-col items-center mt-6 w-full max-w-screen-md p-6 bg-white rounded-lg shadow-lg">
      {array.length === 0 ? (
        <div className="p-4 text-gray-500 text-center w-full">
          Array is empty. Please enter comma-separated values or generate a
          random array to proceed.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-4 justify-center">
              {row.map((value, index) => {
                const actualIndex = rowIndex * itemsPerRow + index;
                return (
                  <div
                    key={index}
                    className={`flex flex-col items-center px-5 py-2 rounded-md shadow-sm font-semibold text-center transition-all duration-200 ease-in-out transform ${
                         low > high
                            ? "bg-red-500 text-white" // Mark all elements red if not found
                            : actualIndex === mid
                                ? "bg-yellow-500 text-white scale-105" // Highlight mid element
                                : actualIndex >= low && actualIndex <= high
                                    ? "bg-green-500 text-white scale-105" // Highlight elements within range
                                    : "bg-gray-200 text-gray-700" // Default style for other elements
                    } hover:scale-105`}
                  >
                    <span className="text-xs text-gray-500">{actualIndex}</span>
                    <span className="text-lg font-bold">{value}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArrayDisplay;
