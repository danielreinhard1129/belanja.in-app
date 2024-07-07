"use client";

import * as React from "react";
import useGetCategories from "@/hooks/api/category/useGetCategories";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface CategoryPickerProps {
  onChange: (category: string) => void;
  defaultValue?: string;
}

export function CategoryPicker({
  onChange,
  defaultValue = "Select category",
}: CategoryPickerProps) {
  const { categories, refetch } = useGetCategories();
  const [selectedCategory, setSelectedCategory] =
    React.useState<string>(defaultValue);

  React.useEffect(() => {
    refetch();
  }, []);

  React.useEffect(() => {
    setSelectedCategory(defaultValue);
  }, [defaultValue]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    onChange(category);
  };

  const handleClear = () => {
    setSelectedCategory("");
    onChange("");
  };

  return (
    <Select value={selectedCategory} onValueChange={handleCategoryChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue
          defaultValue={selectedCategory}
          placeholder="Select category"
        />
      </SelectTrigger>
      <SelectContent
        ref={(ref) =>
          ref?.addEventListener("touchend", (e) => e.preventDefault())
        }
      >
        {categories.length > 0 ? (
          <div>
            {categories.map((category, index) => (
              <SelectItem value={category.name} key={index}>
                {category.name}
              </SelectItem>
            ))}
          </div>
        ) : (
          <p>Not found</p>
        )}
        <Button
          className="w-full px-2"
          variant="link"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleClear();
          }}
        >
          Clear
        </Button>
      </SelectContent>
    </Select>
  );
}
