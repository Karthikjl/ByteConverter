import type { ComponentType } from "react";
import { Ruler, Weight, Thermometer, Database, type LucideProps } from "lucide-react";

export type Unit = {
  name: string;
  symbol: string;
  to_base: (value: number) => number;
  from_base: (value: number) => number;
};

export type Category = {
  name: string;
  icon: ComponentType<LucideProps>;
  units: Unit[];
};

export const categories: Category[] = [
  {
    name: "Data",
    icon: Database,
    units: [
      { name: "Bit", symbol: "b", to_base: (v) => v, from_base: (v) => v },
      { name: "Bytes", symbol: "B", to_base: (v) => v * 8, from_base: (v) => v / 8 },
      { name: "KB", symbol: "KB", to_base: (v) => v * 8 * 1024, from_base: (v) => v / (8 * 1024) },
      { name: "MB", symbol: "MB", to_base: (v) => v * 8 * 1024 ** 2, from_base: (v) => v / (8 * 1024 ** 2) },
      { name: "GB", symbol: "GB", to_base: (v) => v * 8 * 1024 ** 3, from_base: (v) => v / (8 * 1024 ** 3) },
      { name: "TB", symbol: "TB", to_base: (v) => v * 8 * 1024 ** 4, from_base: (v) => v / (8 * 1024 ** 4) },
    ],
  },
  {
    name: "Length",
    icon: Ruler,
    units: [
      { name: "Meter", symbol: "m", to_base: (v) => v, from_base: (v) => v },
      { name: "Kilometer", symbol: "km", to_base: (v) => v * 1000, from_base: (v) => v / 1000 },
      { name: "Centimeter", symbol: "cm", to_base: (v) => v / 100, from_base: (v) => v * 100 },
      { name: "Millimeter", symbol: "mm", to_base: (v) => v / 1000, from_base: (v) => v * 1000 },
      { name: "Mile", symbol: "mi", to_base: (v) => v * 1609.34, from_base: (v) => v / 1609.34 },
      { name: "Yard", symbol: "yd", to_base: (v) => v * 0.9144, from_base: (v) => v / 0.9144 },
      { name: "Foot", symbol: "ft", to_base: (v) => v * 0.3048, from_base: (v) => v / 0.3048 },
      { name: "Inch", symbol: "in", to_base: (v) => v * 0.0254, from_base: (v) => v / 0.0254 },
    ],
  },
  {
    name: "Weight",
    icon: Weight,
    units: [
      { name: "Kilogram", symbol: "kg", to_base: (v) => v, from_base: (v) => v },
      { name: "Gram", symbol: "g", to_base: (v) => v / 1000, from_base: (v) => v * 1000 },
      { name: "Milligram", symbol: "mg", to_base: (v) => v / 1e6, from_base: (v) => v * 1e6 },
      { name: "Pound", symbol: "lb", to_base: (v) => v * 0.453592, from_base: (v) => v / 0.453592 },
      { name: "Ounce", symbol: "oz", to_base: (v) => v * 0.0283495, from_base: (v) => v / 0.0283495 },
    ],
  },
  {
    name: "Temperature",
    icon: Thermometer,
    units: [
      { name: "Celsius", symbol: "°C", to_base: (v) => v, from_base: (v) => v },
      { name: "Fahrenheit", symbol: "°F", to_base: (v) => (v - 32) * 5/9, from_base: (v) => (v * 9/5) + 32 },
      { name: "Kelvin", symbol: "K", to_base: (v) => v - 273.15, from_base: (v) => v + 273.15 },
    ],
  },
];

export const findUnit = (symbol: string): Unit | undefined => {
  for (const category of categories) {
    const unit = category.units.find(u => u.symbol === symbol);
    if (unit) return unit;
  }
  return undefined;
};
