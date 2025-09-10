import React, { useState } from "react";
import ArrayDisplay from "./ArrayDisplay";
import { InfoIcon } from "lucide-react";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

const BinarySearchVisualizer: React.FC = () => {
  const [arrayInput, setArrayInput] = useState<string>("");
  const [array, setArray] = useState<number[]>([]);
  const [target, setTarget] = useState<number | null>(null);
  const [low, setLow] = useState<number>(0);
  const [high, setHigh] = useState<number>(-1);
  const [mid, setMid] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("");
  const [steps, setSteps] = useState<any[]>([]); // Array of step objects
  const [currentStep, setCurrentStep] = useState<number>(0);
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
    setCurrentStep(0);
  };

  // Precompute all steps for step-by-step navigation
  const computeBinarySearchSteps = (arr: number[], tgt: number | null) => {
    if (tgt === null) return [];
    const stepsArr = [];
    let start = 0;
    let end = arr.length - 1;
    let found = false;
    while (start <= end) {
      const middle = Math.floor((start + end) / 2);
      stepsArr.push({
        low: start,
        high: end,
        mid: middle,
        message: `low=${start}, high=${end}, mid=${middle}, array[mid]=${arr[middle]}`,
        highlight: { low: start, high: end, mid: middle },
      });
      if (arr[middle] === tgt) {
        stepsArr.push({
          low: start,
          high: end,
          mid: middle,
          message: `Target ${tgt} found at index ${middle}`,
          highlight: { low: start, high: end, mid: middle },
          found: true,
        });
        found = true;
        break;
      } else if (arr[middle] < tgt) {
        stepsArr.push({
          low: start,
          high: end,
          mid: middle,
          message: `Target > array[mid], moving start to ${middle + 1}`,
          highlight: { low: start, high: end, mid: middle },
        });
        start = middle + 1;
      } else {
        stepsArr.push({
          low: start,
          high: end,
          mid: middle,
          message: `Target < array[mid], moving end to ${middle - 1}`,
          highlight: { low: start, high: end, mid: middle },
        });
        end = middle - 1;
      }
    }
    if (!found) {
      stepsArr.push({
        low: 0,
        high: arr.length - 1,
        mid: null,
        message: `Target ${tgt} not found in the array`,
        highlight: {},
        notFound: true,
      });
    }
    return stepsArr;
  };

  const handleBinarySearch = () => {
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
    const allSteps = computeBinarySearchSteps(array, target);
    setSteps(allSteps);
    setCurrentStep(0);
    setIsSearching(false);
    if (allSteps.length > 0) {
      const step = allSteps[0];
      setLow(step.low);
      setHigh(step.high);
      setMid(step.mid);
      setMessage(step.message);
    }
  };

  const handleNextStep = () => {
    if (steps.length === 0) return;
    const nextStep = Math.min(currentStep + 1, steps.length - 1);
    setCurrentStep(nextStep);
    const step = steps[nextStep];
    setLow(step.low);
    setHigh(step.high);
    setMid(step.mid);
    setMessage(step.message);
  };

  const handlePrevStep = () => {
    if (steps.length === 0) return;
    const prevStep = Math.max(currentStep - 1, 0);
    setCurrentStep(prevStep);
    const step = steps[prevStep];
    setLow(step.low);
    setHigh(step.high);
    setMid(step.mid);
    setMessage(step.message);
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
    setCurrentStep(0);
    setRandomArrayLength(10);
    setErrorMessage("");
    setShowDropdown(false);
  };

  const handleRandomGenerate = (): void => {
    setErrorMessage("");
    setShowDropdown(false);
    const maxValue = Math.max(100, randomArrayLength * 2); // Ensure enough range for uniqueness
    if (randomArrayLength > maxValue) {
      setErrorMessage(
        `Cannot generate ${randomArrayLength} unique numbers in range 0-${maxValue}`
      );
      return;
    }
    // Generate unique random numbers
    const uniqueSet = new Set<number>();
    while (uniqueSet.size < randomArrayLength) {
      uniqueSet.add(Math.floor(Math.random() * maxValue));
    }
    const generatedArray = Array.from(uniqueSet);
    generatedArray.sort((a, b) => a - b);
    setArray(generatedArray);
    setLow(0);
    setHigh(generatedArray.length - 1);
    setMessage("");
    setSteps([]);
    setCurrentStep(0);
  };

  // Click-to-set-target handler
  const handleArrayElementClick = (index: number) => {
    if (isSearching) return;
    setTarget(array[index]);
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen bg-background px-2 sm:px-4 py-2 sm:py-3 w-full">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2"
        onClick={() => setIsModalOpen(true)}
      >
        <InfoIcon className="h-5 w-5" />
      </Button>

      <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-3 sm:mb-4 mt-1">
        Binary Search Visualizer
      </h1>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              Information about Visualizer
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 text-sm text-muted-foreground">
            <p className="font-semibold mb-2">Color Legend:</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
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
            <p className="mt-4 text-sm text-muted-foreground">
              <strong>Note:</strong> The index of each element is shown at the
              top of the element.
            </p>
          </div>
          <DialogFooter className="sm:justify-center">
            <DialogClose asChild>
              <Button type="button" variant="default">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 w-full max-w-7xl">
        <Card className="w-full">
          <CardHeader className="py-2 px-4">
            <CardTitle className="text-sm sm:text-base font-medium">
              Array Input
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Enter comma-separated numbers
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3">
            <Input
              id="arrayInput"
              type="text"
              value={arrayInput}
              onChange={(e) => handleArrayInputChange(e.target.value)}
              disabled={isSearching}
              className="text-base"
              placeholder="e.g., 1, 3, 5, 7, 9"
            />
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="py-2 px-4">
            <CardTitle className="text-sm sm:text-base font-medium">
              Target
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Number to search for
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3">
            <Input
              id="target"
              type="number"
              value={target ?? ""}
              onChange={(e) => setTarget(Number(e.target.value))}
              disabled={isSearching}
              className="text-base"
              placeholder="e.g., 5"
            />
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="py-2 px-4">
            <CardTitle className="text-sm sm:text-base font-medium">
              Actions
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Control the visualization
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3">
            <div className="flex gap-2">
              <Button
                onClick={handleBinarySearch}
                disabled={isSearching}
                className="flex-1"
                variant="default"
                size="sm"
              >
                Search
              </Button>
              <Button
                onClick={handleReset}
                disabled={isSearching}
                variant="destructive"
                className="flex-1"
                size="sm"
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="py-2 px-4">
            <CardTitle className="text-sm sm:text-base font-medium">
              Random Array
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Generate with specified length
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="array-length"
                  disabled={isSearching}
                  type="number"
                  value={randomArrayLength}
                  onChange={(e) => setRandomArrayLength(Number(e.target.value))}
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
                  className="w-full"
                  placeholder="Length"
                  size={6}
                />
                {showDropdown && (
                  <div className="absolute left-0 right-0 mt-1 bg-card shadow-lg border border-border rounded-md z-10">
                    {options.map((option) => (
                      <div
                        key={option}
                        onClick={() => handleOptionSelect(option)}
                        className="p-2 cursor-pointer hover:bg-muted"
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button
                onClick={handleRandomGenerate}
                disabled={isSearching}
                variant="secondary"
                size="sm"
              >
                Generate
              </Button>
            </div>
            {errorMessage && (
              <p className="text-destructive text-xs mt-1">{errorMessage}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {message && (
        <div className="w-full max-w-lg mt-2 sm:mt-3">
          <p
            className={`text-base sm:text-lg text-center font-semibold p-2 rounded-md ${
              message?.includes("not found")
                ? "text-destructive"
                : message?.includes("Found")
                ? "text-green-500"
                : "text-yellow-500"
            }`}
          >
            {message}
          </p>
        </div>
      )}

      <ArrayDisplay
        array={array}
        low={low}
        high={high}
        mid={mid}
        target={target}
        onElementClick={handleArrayElementClick}
      />

      {steps.length > 0 && (
        <Card className="mt-3 w-full max-w-lg">
          <CardHeader className="py-2 px-4">
            <CardTitle className="text-sm sm:text-lg text-primary">
              Calculation Steps
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <Button
                onClick={handlePrevStep}
                disabled={currentStep === 0}
                variant="outline"
                size="sm"
              >
                Previous
              </Button>
              <span className="text-sm sm:text-base font-medium">
                Step {currentStep + 1} / {steps.length}
              </span>
              <Button
                onClick={handleNextStep}
                disabled={currentStep === steps.length - 1}
                variant="outline"
                size="sm"
              >
                Next
              </Button>
            </div>
            <div className="p-2 bg-muted rounded-md text-xs sm:text-sm">
              {steps[currentStep]?.message}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-auto text-center py-2 text-xs sm:text-sm text-muted-foreground">
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
            className="text-primary font-semibold hover:underline"
          >
            Abhishek Kumar Yadav
          </a>
        </p>
      </div>
    </div>
  );
};

export default BinarySearchVisualizer;
