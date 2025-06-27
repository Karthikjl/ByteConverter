import { UnitConverter } from "@/components/unit-converter";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-4xl">
        <header className="mb-8 text-center">
          <h1 className="font-headline text-4xl font-bold text-foreground sm:text-5xl">
            Byte Converter
          </h1>
          <p className="mt-2 text-muted-foreground">
            Convert bytes quickly and easily.
          </p>
        </header>
        <UnitConverter />
      </div>
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>© 2025 Unit Converter. All rights reserved.</p>
      </footer>
    </main>
  );
}
