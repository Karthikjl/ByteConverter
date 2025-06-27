import { UnitConverter } from "@/components/unit-converter";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-2xl">
        <header className="mb-8 text-center">
          <h1 className="font-headline text-4xl font-bold text-foreground sm:text-5xl">
            ByteConverter
          </h1>
          <p className="mt-2 text-muted-foreground">
            A real-time unit converter with AI-powered suggestions.
          </p>
        </header>
        <UnitConverter />
      </div>
    </main>
  );
}
