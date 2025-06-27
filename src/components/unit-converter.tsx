"use client";

import { useState, useCallback, ChangeEvent } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { categories } from "@/lib/units";
import type { Unit } from "@/lib/units";

const dataUnits = categories.find(c => c.name === "Data")?.units.filter(u => u.symbol !== 'b') || [];

function formatValue(value: number): string {
    if (isNaN(value) || value === null) return "";
    if (value === 0) return "0";

    if (Number.isInteger(value)) {
        return value.toString();
    }
    
    let stringValue = value.toFixed(10);
    stringValue = stringValue.replace(/(\.[0-9]*[1-9])0+$/, "$1"); 
    stringValue = stringValue.replace(/\.0+$/, "");

    return stringValue;
}

export function UnitConverter() {
    const { toast } = useToast();
    const [baseValueInBytes, setBaseValueInBytes] = useState(1024 * 1024); 
    const [editingUnitSymbol, setEditingUnitSymbol] = useState<string | null>(null);

    const handleValueChange = useCallback((valueStr: string, fromUnit: Unit) => {
        const numValue = parseFloat(valueStr);
        if (!isNaN(numValue)) {
            const asBytes = fromUnit.to_base(numValue) / 8;
            setBaseValueInBytes(asBytes);
        } else if (valueStr === "") {
            setBaseValueInBytes(0);
        }
    }, []);
    
    const handleStep = useCallback((unit: Unit, direction: 'up' | 'down') => {
        const currentValue = unit.from_base(baseValueInBytes * 8);
        const step = direction === 'up' ? 1 : -1;
        
        let nextValue = currentValue + step;
        if(nextValue < 0) nextValue = 0;
        
        const asBytes = unit.to_base(nextValue) / 8;
        setBaseValueInBytes(asBytes);
    }, [baseValueInBytes]);

    const handleCopy = useCallback((textToCopy: string) => {
        if (!textToCopy) return;
        navigator.clipboard.writeText(textToCopy).then(() => {
            toast({
                title: "Copied to clipboard",
                description: `Value "${textToCopy}" has been copied.`,
            });
        }).catch(err => {
            console.error("Failed to copy text: ", err);
            toast({
                variant: "destructive",
                title: "Copy failed",
                description: "Could not copy text to clipboard.",
            });
        });
        setEditingUnitSymbol(null); // Exit edit mode after copy
    }, [toast]);

    const orderedSymbols = ['B', 'KB', 'MB', 'GB', 'TB'];
    const orderedUnits = orderedSymbols.map(symbol => 
        dataUnits.find(u => u.symbol === symbol)
    ).filter((u): u is Unit => u !== undefined);

    return (
        <Card className="w-full shadow-xl border rounded-2xl bg-card">
            <CardContent className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-6 justify-items-center">
                    {orderedUnits.map((unit) => {
                        const convertedValue = unit.from_base(baseValueInBytes * 8);
                        const displayValue = formatValue(convertedValue);
                        return (
                            <div key={unit.symbol} className="flex flex-col items-center gap-2 w-full max-w-[160px]">
                                <Input
                                    type="text"
                                    value={editingUnitSymbol === unit.symbol && convertedValue === 0 ? '' : displayValue}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleValueChange(e.target.value, unit)}
                                    className="text-center text-lg h-12 bg-muted/50 border-input rounded-lg font-mono cursor-pointer"
                                    aria-label={`${unit.name} value`}
                                    readOnly={editingUnitSymbol !== unit.symbol}
                                    onClick={() => setEditingUnitSymbol(unit.symbol)}
                                    onDoubleClick={() => handleCopy(displayValue)}
                                    onBlur={() => setEditingUnitSymbol(null)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === 'Escape') {
                                            setEditingUnitSymbol(null);
                                            e.currentTarget.blur();
                                        }
                                    }}
                                />
                                <span className="font-semibold text-muted-foreground">{unit.name}</span>
                                <div className="flex gap-2">
                                    <Button variant="default" size="icon" className="h-9 w-9" onClick={() => handleStep(unit, 'up')}>
                                        <ChevronUp className="h-5 w-5" />
                                    </Button>
                                    <Button variant="default" size="icon" className="h-9 w-9" onClick={() => handleStep(unit, 'down')}>
                                        <ChevronDown className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
