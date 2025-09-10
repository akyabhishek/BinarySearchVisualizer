import React from "react";
import { Card, CardContent } from "../components/ui/card";
import { cn } from "../lib/utils";

interface ArrayDisplayProps {
  array: number[];
  low: number;
  high: number;
  mid: number | null;
  target?: number | null;
  onElementClick?: (index: number) => void;
}

const ArrayDisplay: React.FC<ArrayDisplayProps> = ({
  array,
  low,
  high,
  mid,
  target,
  onElementClick,
}) => {
  const itemsPerRow = 10; // Limit items per row

  // Split the array into subarrays for each row
  const rows = [];
  for (let i = 0; i < array.length; i += itemsPerRow) {
    rows.push(array.slice(i, i + itemsPerRow));
  }

  return (
    <Card className="mt-6 w-full max-w-screen-md border bg-card">
      <CardContent className="p-6">
        {array.length === 0 ? (
          <div className="p-4 text-muted-foreground text-center w-full">
            Array is empty. Please enter comma-separated values or generate a
            random array to proceed.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {rows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="flex flex-wrap gap-4 justify-center"
              >
                {row.map((value, index) => {
                  const actualIndex = rowIndex * itemsPerRow + index;
                  const isTarget = target === value;

                  return (
                    <div
                      key={index}
                      className={cn(
                        "flex flex-col items-center px-5 py-2 rounded-md shadow-sm font-medium text-center transition-all duration-300 ease-in-out transform cursor-pointer",
                        low > high
                          ? "bg-destructive text-destructive-foreground"
                          : actualIndex === mid
                          ? "bg-yellow-500 text-white scale-110"
                          : actualIndex >= low && actualIndex <= high
                          ? "bg-green-500 text-white scale-105"
                          : isTarget
                          ? "bg-primary text-primary-foreground scale-105 border-2 border-primary"
                          : "bg-muted text-muted-foreground",
                        "hover:scale-110"
                      )}
                      onClick={() =>
                        onElementClick && onElementClick(actualIndex)
                      }
                      title={isTarget ? "Target" : undefined}
                    >
                      <span className="text-xs opacity-70">{actualIndex}</span>
                      <span className="text-lg font-bold">{value}</span>
                      {isTarget && (
                        <span className="text-xs font-bold">🎯</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ArrayDisplay;
