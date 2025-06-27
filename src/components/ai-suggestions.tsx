"use client";

import { useState } from "react";
import { Lightbulb } from "lucide-react";
import { suggestConversions } from "@/ai/flows/suggest-conversions";
import type { SuggestConversionsOutput } from "@/ai/flows/suggest-conversions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AiSuggestionsProps {
  inputValue: string;
  inputUnit: string;
  pastConversions: { fromUnit: string; toUnit: string }[];
  onSuggestionSelect: (unitSymbol: string) => void;
}

export function AiSuggestions({ inputValue, inputUnit, pastConversions, onSuggestionSelect }: AiSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<SuggestConversionsOutput>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const getSuggestions = async () => {
    setIsLoading(true);
    setShowSuggestions(true);
    try {
      const result = await suggestConversions({
        inputValue,
        inputUnit,
        pastConversions,
      });
      setSuggestions(result);
    } catch (error) {
      console.error("Failed to get AI suggestions:", error);
      // Optionally, show a toast notification for the error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <div className="text-center">
        <Button onClick={getSuggestions} disabled={isLoading} variant="ghost" className="text-accent-foreground/80 hover:text-accent-foreground">
          <Lightbulb className="mr-2 h-4 w-4" />
          {isLoading ? "Thinking..." : "Get AI Suggestions"}
        </Button>
      </div>

      {showSuggestions && (
        <Card className="mt-4 bg-transparent border-dashed">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-center">Suggested Conversions</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                   <div key={i} className="h-10 w-full animate-pulse rounded-md bg-muted/50"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto flex-col items-start justify-start p-3 text-left transition-all hover:border-accent"
                    onClick={() => onSuggestionSelect(suggestion.toUnit)}
                  >
                    <p className="font-bold text-primary-foreground">Convert to {suggestion.toUnit}</p>
                    <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                  </Button>
                ))}
              </div>
            )}
            {suggestions.length === 0 && !isLoading && (
              <p className="text-center text-sm text-muted-foreground">No suggestions available. Try another unit.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
