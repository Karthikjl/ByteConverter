"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { ArrowRightLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import useLocalStorage from "@/hooks/use-local-storage";
import { categories, findUnit, type Unit, type Category } from "@/lib/units";
import { AiSuggestions } from "./ai-suggestions";

type PastConversion = { fromUnit: string; toUnit: string };

export function UnitConverter() {
  const { toast } = useToast();

  const [categoryName, setCategoryName] = useLocalStorage("category", "Data");
  const [fromUnitSymbol, setFromUnitSymbol] = useLocalStorage("fromUnit", "MB");
  const [toUnitSymbol, setToUnitSymbol] = useLocalStorage("toUnit", "KB");
  const [pastConversions, setPastConversions] = useLocalStorage<PastConversion[]>("pastConversions", []);

  const [value1, setValue1] = useState("1");
  const [value2, setValue2] = useState("");
  const [activeInput, setActiveInput] = useState<"value1" | "value2">("value1");

  const selectedCategory = useMemo(
    () => categories.find((c) => c.name === categoryName) || categories[0],
    [categoryName]
  );
  
  const fromUnit = useMemo(
    () => findUnit(fromUnitSymbol) || selectedCategory.units[0],
    [fromUnitSymbol, selectedCategory]
  );

  const toUnit = useMemo(
    () => findUnit(toUnitSymbol) || selectedCategory.units[1] || selectedCategory.units[0],
    [toUnitSymbol, selectedCategory]
  );

  const convert = useCallback((value: number, from: Unit, to: Unit): string => {
    if (isNaN(value)) return "";
    const baseValue = from.to_base(value);
    const convertedValue = to.from_base(baseValue);
    
    if (Math.abs(convertedValue) < 1e-9 && convertedValue !== 0) {
        return convertedValue.toExponential(4);
    }
    
    const str = convertedValue.toLocaleString(undefined, { maximumFractionDigits: 10 });
    // avoid -0
    if (str === "-0") return "0";
    return str;
  }, []);

  useEffect(() => {
    const val1 = parseFloat(value1.replace(/,/g, ''));
    if (activeInput === "value1") {
      setValue2(convert(val1, fromUnit, toUnit));
    }
  }, [value1, fromUnit, toUnit, activeInput, convert]);

  useEffect(() => {
    const val2 = parseFloat(value2.replace(/,/g, ''));
    if (activeInput === "value2") {
      setValue1(convert(val2, toUnit, fromUnit));
    }
  }, [value2, fromUnit, toUnit, activeInput, convert]);
  
  const handleCategoryChange = (newCategoryName: string) => {
    setCategoryName(newCategoryName);
    const newCategory = categories.find(c => c.name === newCategoryName);
    if (newCategory) {
      setFromUnitSymbol(newCategory.units[0].symbol);
      setToUnitSymbol(newCategory.units[1] ? newCategory.units[1].symbol : newCategory.units[0].symbol);
    }
  };
  
  const handleUnitChange = (setter: (symbol: string) => void) => (symbol: string) => {
      setter(symbol);
      setPastConversions(prev => [{ fromUnit: fromUnitSymbol, toUnit: toUnitSymbol }, ...prev].slice(0, 10));
  }

  const handleSwapUnits = () => {
    const currentFrom = fromUnitSymbol;
    setFromUnitSymbol(toUnitSymbol);
    setToUnitSymbol(currentFrom);
    setActiveInput("value1");
  };

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    toast({
      title: "Copied to clipboard!",
      description: `Value: ${value}`,
    });
  };

  return (
    <>
    <Card className="w-full shadow-lg">
      <CardContent className="p-4 sm:p-6">
        <div className="grid grid-cols-11 gap-2 items-center">
            {/* Input 1 */}
            <div className="col-span-5 flex flex-col gap-2">
                <Input
                    type="text"
                    value={value1}
                    onChange={(e) => {
                      setValue1(e.target.value);
                      setActiveInput("value1");
                    }}
                    onDoubleClick={() => handleCopy(value1)}
                    className="text-lg h-12 text-center font-mono bg-card"
                    aria-label="Input value"
                />
                 <Select value={fromUnit.symbol} onValueChange={handleUnitChange(setFromUnitSymbol)}>
                    <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                        {selectedCategory.units.map(unit => (
                            <SelectItem key={unit.symbol} value={unit.symbol}>{unit.name} ({unit.symbol})</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            {/* Swap Button */}
            <div className="col-span-1 flex justify-center">
                <Button variant="ghost" size="icon" onClick={handleSwapUnits} className="rounded-full" aria-label="Swap units">
                    <ArrowRightLeft className="h-5 w-5 text-muted-foreground transition-transform duration-300 hover:scale-110 hover:text-accent"/>
                </Button>
            </div>
            {/* Input 2 */}
            <div className="col-span-5 flex flex-col gap-2">
                <Input
                    type="text"
                    value={value2}
                    onChange={(e) => {
                        setValue2(e.target.value);
                        setActiveInput("value2");
                    }}
                    onDoubleClick={() => handleCopy(value2)}
                    className="text-lg h-12 text-center font-mono bg-card"
                    aria-label="Output value"
                />
                <Select value={toUnit.symbol} onValueChange={handleUnitChange(setToUnitSymbol)}>
                    <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                        {selectedCategory.units.map(unit => (
                            <SelectItem key={unit.symbol} value={unit.symbol}>{unit.name} ({unit.symbol})</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Tabs value={categoryName} onValueChange={handleCategoryChange} className="w-auto">
            <TabsList>
              {categories.map((cat: Category) => (
                <TabsTrigger key={cat.name} value={cat.name} className="gap-2 px-3">
                  <cat.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{cat.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </CardContent>
    </Card>
    <AiSuggestions
        inputValue={activeInput === 'value1' ? value1 : value2}
        inputUnit={activeInput === 'value1' ? fromUnit.symbol : toUnit.symbol}
        pastConversions={pastConversions}
        onSuggestionSelect={(unitSymbol) => {
            if(activeInput === 'value1') setToUnitSymbol(unitSymbol)
            else setFromUnitSymbol(unitSymbol)
        }}
    />
    </>
  );
}
