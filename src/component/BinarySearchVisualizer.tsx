import React, { useState } from "react";
import ArrayDisplay from "./ArrayDisplay";
import { InformationCircleIcon } from "@heroicons/react/24/solid";

const BinarySearchVisualizer: React.FC = () => {
  const [arrayInput, setArrayInput] = useState<string>("");
  const [array, setArray] = useState<number[]>([]);
  const [target, setTarget] = useState<number | null>(null);
  const [low, setLow] = useState<number>(0);
  const [high, setHigh] = useState<number>(-1);
  const [mid, setMid] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("");
  const [steps, setSteps] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [randomArrayLength, setRandomArrayLength] = useState<number>(10);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const options = [10, 50, 100, 200, 1000, 5000, 10000];

  const handleInputFocus = () => {
    setShowDropdown(true); // Show the dropdown when the input is focused
  };

  const handleOptionSelect = (value: number) => {
    setRandomArrayLength(value);
    setShowDropdown(false); // Hide the dropdown after selection
  };

  const handleArrayInputChange = (input: string): void => {
    setArrayInput(input);
    const parsedArray = input
      .split(",")
      .map((num) => parseInt(num.trim(), 10))
      .filter((num) => !isNaN(num));
    parsedArray.sort((a, b) => a - b);
    setArray(parsedArray);
    setLow(0);
    setHigh(parsedArray.length - 1);
    setMessage("");
    setSteps([]);
  };

  const handleBinarySearch = async (): Promise<void> => {
    setShowDropdown(false);
    if (array.length === 0) {
      setMessage("Array is empty");
      return;
    }
    if (target === null || isNaN(target)) {
      setMessage("Please enter a target number.");
      return;
    }

    setLow(0);
    setHigh(array.length - 1);
    setMessage("");
    setSteps([]);
    setIsSearching(true);

    let start = 0;
    let end = array.length - 1;

    while (start <= end) {
      const middle = Math.floor((start + end) / 2);
      setMid(middle);

      setSteps((prevSteps) => [
        ...prevSteps,
        `low=${start}, high=${end}, mid=${middle}, array[mid]=${array[middle]}`,
      ]);

      if (array[middle] === target) {
        setMessage(`Found ${target} at index ${middle}`);
        setSteps((prevSteps) => [
          ...prevSteps,
          `Target ${target} found at index ${middle}`,
        ]);
        break;
      } else if (array[middle] < target) {
        start = middle + 1;
        setSteps((prevSteps) => [
          ...prevSteps,
          `Target > array[mid], moving start to ${start}`,
        ]);
      } else {
        end = middle - 1;
        setSteps((prevSteps) => [
          ...prevSteps,
          `Target < array[mid], moving end to ${end}`,
        ]);
      }

      setLow(start);
      setHigh(end);

      await new Promise<void>((resolve) => setTimeout(resolve, 1000));
    }

    if (start > end) {
      setSteps((prevSteps) => [
        ...prevSteps,
        `Target ${target} not found in the array`,
      ]);
      setMessage(`${target} not found in the array`);
    }

    setIsSearching(false);
  };

  const handleReset = (): void => {
    setArrayInput("");
    setArray([]);
    setTarget(null);
    setLow(0);
    setHigh(-1);
    setMid(null);
    setMessage("");
    setSteps([]);
    setRandomArrayLength(10);
    setErrorMessage("");
    setShowDropdown(false);
  };

  const handleRandomGenerate = (): void => {
    setErrorMessage("");
    setShowDropdown(false);
    const generatedArray = Array.from({ length: randomArrayLength }, () =>
      Math.floor(Math.random() * 100)
    );
    generatedArray.sort((a, b) => a - b);
    setArray(generatedArray);
    setLow(0);
    setHigh(generatedArray.length - 1);
    setMessage("");
    setSteps([]);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5 w-auto">
      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        onClick={() => setIsModalOpen(true)}
      >
        <InformationCircleIcon className="h-8 w-8" />
      </button>

      <h1 className="text-3xl font-bold text-indigo-600 mb-6">
        Binary Search Visualizer
      </h1>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg text-center">
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">
              Information about Visualizer
            </h2>
            <div className="mt-6 text-sm text-gray-700">
              <p className="font-semibold mb-2">Color Legend:</p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <span>Mid Element</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span>Low-High Range</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                  <span>Default Element</span>
                </div>
              </div>

              {/* Note about index */}
              <p className="mt-4 text-sm text-gray-500">
                <strong>Note:</strong> The index of each element is shown at the
                top of the element.
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-4 w-full">
        <div className="flex flex-col w-full sm:w-auto max-w-3xl">
          <label
            className="text-sm font-semibold text-gray-600 mb-2"
            htmlFor="arrayInput"
          >
            Comma-separated numbers
          </label>
          <input
            id="arrayInput"
            type="text"
            value={arrayInput}
            onChange={(e) => handleArrayInputChange(e.target.value)}
            disabled={isSearching}
            className="p-3 w-full border border-gray-300 rounded-md shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>

        <div className="flex flex-col w-full sm:w-auto max-w-xs">
          <label
            className="text-sm font-semibold text-gray-600 mb-2"
            htmlFor="target"
          >
            Target number
          </label>
          <input
            id="target"
            type="number"
            value={target ?? ""}
            onChange={(e) => setTarget(Number(e.target.value))}
            disabled={isSearching}
            className="p-3 w-full border border-gray-300 rounded-md shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>

        <div className="flex items-center justify-center w-full sm:w-auto max-w-lg space-x-4">
          <div className="mb-6">
            <label className="text-sm font-semibold text-gray-600 mb-2">
              Action Buttons
            </label>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
              <button
                onClick={handleBinarySearch}
                disabled={isSearching}
                className="px-6 py-3 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600 w-full sm:w-auto"
              >
                Search
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600 w-full sm:w-auto"
                disabled={isSearching}
              >
                Reset
              </button>
            </div>
          </div>

          <div className="my-4 border-t border-gray-300"></div>

          <div className="mb-6">
            <label className="text-sm font-semibold text-gray-600 mb-2">
              Generate Random Array
            </label>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
              <div className="flex flex-col w-full sm:w-auto max-w-xs">
                <div className="relative">
                  <input
                    id="array-length"
                    disabled={isSearching}
                    type="number"
                    value={randomArrayLength}
                    onChange={(e) =>
                      setRandomArrayLength(Number(e.target.value))
                    }
                    onFocus={handleInputFocus}
                    onInput={(e) => {
                      const input = e.target as HTMLInputElement;
                      const maxValue = 10000; // Maximum value
                      if (Number(input.value) > maxValue) {
                        setErrorMessage(
                          `The value cannot exceed ${maxValue.toLocaleString()}`
                        );
                        input.value = String(maxValue); // Set value to max if it exceeds
                      } else {
                        setErrorMessage(""); // Clear the error message when the value is valid
                      }
                    }}
                    className="p-3 w-full border border-gray-300 rounded-md shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder="Length"
                  />
                  {errorMessage && (
                    <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
                  )}
                  {showDropdown && (
                    <div className="absolute left-0 right-0 mt-1 bg-white shadow-lg border border-gray-300 rounded-md z-10">
                      {options.map((option) => (
                        <div
                          key={option}
                          onClick={() => handleOptionSelect(option)}
                          className="p-2 cursor-pointer hover:bg-gray-200"
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={handleRandomGenerate}
                disabled={isSearching}
                className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 w-full sm:w-auto"
              >
                Generate
              </button>
            </div>
          </div>

          <div className="my-4 border-t border-gray-300"></div>
        </div>
      </div>
      {message && (
        <p
          className={`text-xl text-center font-semibold p-4 rounded-md bg-transparent
      ${
        message?.includes("not found")
          ? "text-red-500"
          : message?.includes("Found")
          ? "text-green-500"
          : "text-yellow-500"
      }`}
        >
          {message}
        </p>
      )}

      <ArrayDisplay array={array} low={low} high={high} mid={mid} />
      {steps.length > 0 && (
        <div className="mt-6 w-full max-w-lg p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-indigo-500">
            Calculation Steps
          </h2>
          <ul className="space-y-2 text-gray-700 text-sm">
            {steps.map((step, index) => (
              <li key={index} className="p-2 bg-gray-100 rounded-lg">
                Step {index + 1}: {step}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-auto text-center p-4 text-sm text-gray-600">
        <p>
          Copyright © {new Date().getFullYear()} Created with{" "}
          <span role="img" aria-label="heart">
            ❤️
          </span>{" "}
          by{" "}
          <a
            href="https://github.com/akyabhishek"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 font-semibold hover:underline"
          >
            Abhishek Kumar Yadav
          </a>
        </p>
      </div>
    </div>
  );
};

export default BinarySearchVisualizer;
