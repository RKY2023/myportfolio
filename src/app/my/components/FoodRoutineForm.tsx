"use client";

import { useState } from "react";
import { Column, Flex, Text, Input, Button } from "@/once-ui/components";
import styles from "./FoodRoutineForm.module.scss";

interface FoodItem {
  name: string;
  quantity: string;
  time?: string;
  calories?: number;
  notes?: string;
}

interface FoodRoutine {
  morningItems?: FoodItem[];
  breakfastItems?: FoodItem[];
  lunchItems?: FoodItem[];
  dinnerItems?: FoodItem[];
  snacks?: FoodItem[];
  waterIntake?: number;
}

interface FoodRoutineFormProps {
  value?: FoodRoutine;
  onChange: (routine: FoodRoutine) => void;
}

const MEAL_TYPES = [
  { id: "breakfastItems", label: "Breakfast 🥞" },
  { id: "lunchItems", label: "Lunch 🍽️" },
  { id: "dinnerItems", label: "Dinner 🍷" },
  { id: "snacks", label: "Snacks 🍿" },
] as const;

export default function FoodRoutineForm({
  value = {},
  onChange,
}: FoodRoutineFormProps) {
  const [expandedMeal, setExpandedMeal] = useState<string | null>(
    "breakfastItems"
  );

  const handleMealItemChange = (
    mealType: string,
    index: number,
    field: keyof FoodItem,
    newValue: any
  ) => {
    const meal = (value[mealType as keyof FoodRoutine] || []) as FoodItem[];
    const updated = [...meal];
    updated[index] = { ...updated[index], [field]: newValue };

    onChange({
      ...value,
      [mealType]: updated,
    });
  };

  const addMealItem = (mealType: string) => {
    const meal = (value[mealType as keyof FoodRoutine] || []) as FoodItem[];
    onChange({
      ...value,
      [mealType]: [...meal, { name: "", quantity: "" }],
    });
  };

  const removeMealItem = (mealType: string, index: number) => {
    const meal = (value[mealType as keyof FoodRoutine] || []) as FoodItem[];
    onChange({
      ...value,
      [mealType]: meal.filter((_, i) => i !== index),
    });
  };

  return (
    <Column fillWidth gap="16">
      <Text variant="body-strong-m">
        Food & Nutrition
      </Text>

      {/* Water Intake */}
      <Input
        id="waterIntake"
        label="Water Intake (liters)"
        type="number"
        min="0"
        step="0.1"
        value={value.waterIntake?.toString() || ""}
        onChange={(e) =>
          onChange({
            ...value,
            waterIntake: e.target.value ? parseFloat(e.target.value) : undefined,
          })
        }
        placeholder="2.5"
      />

      {/* Meals */}
      {MEAL_TYPES.map(({ id, label }) => (
        <div key={id} className={styles.mealSection}>
          <button
            type="button"
            className={styles.mealHeader}
            onClick={() =>
              setExpandedMeal(expandedMeal === id ? null : id)
            }
          >
            <Text variant="body-strong-m">{label}</Text>
            <span>{expandedMeal === id ? "▼" : "▶"}</span>
          </button>

          {expandedMeal === id && (
            <div className={styles.mealItems}>
              {((value[id as keyof FoodRoutine] || []) as FoodItem[]).map(
                (item, index) => (
                  <Flex
                    key={index}
                    gap="8"
                    align="end"
                    className={styles.foodItem}
                  >
                    <Input
                      id={`food-name-${id}-${index}`}
                      label="Food Name"
                      placeholder="e.g., Eggs"
                      value={item.name}
                      onChange={(e) =>
                        handleMealItemChange(id, index, "name", e.target.value)
                      }
                    />
                    <Input
                      id={`food-quantity-${id}-${index}`}
                      label="Quantity"
                      placeholder="e.g., 2"
                      value={item.quantity}
                      onChange={(e) =>
                        handleMealItemChange(
                          id,
                          index,
                          "quantity",
                          e.target.value
                        )
                      }
                    />
                    <Input
                      id={`food-calories-${id}-${index}`}
                      label="Calories"
                      type="number"
                      placeholder="155"
                      value={item.calories?.toString() || ""}
                      onChange={(e) =>
                        handleMealItemChange(
                          id,
                          index,
                          "calories",
                          e.target.value
                            ? parseInt(e.target.value)
                            : undefined
                        )
                      }
                    />
                    <Button
                      variant="secondary"
                      size="s"
                      onClick={() => removeMealItem(id, index)}
                    >
                      Remove
                    </Button>
                  </Flex>
                )
              )}

              <Button
                variant="secondary"
                size="s"
                onClick={() => addMealItem(id)}
              >
                + Add Item
              </Button>
            </div>
          )}
        </div>
      ))}
    </Column>
  );
}
