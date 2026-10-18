import { useEffect, useState, type FormEvent } from "react";
import { health, wordBank, type WordBank } from "./api/engine";

type EngineState = "checking" | "online" | "offline";

export default function App() {
  const [engine, setEngine] = useState<EngineState>("checking");
  const [word, setWord] = useState("");
  const [bank, setBank] = useState<WordBank | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    health()
      .then(() => setEngine("online"))
      .catch(() => setEngine("offline"));
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const w = word.trim();
    if (!w) return;
    setLoading(true);
    setError(null);
    try {
      setBank(await wordBank(w));
    } catch (err) {
      setBank(null);
      setError(err instanceof Error ? err.message : "Something went KABLOOEY");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="halftone min-h-screen px-4 py-6 sm:py-10">
      <main className="mx-auto grid max-w-3xl gap-6">
        <header className="panel bg-hero-red p-5 text-center">
          <h1 className="font-display text-5xl tracking-wide text-hero-yellow [-webkit-text-stroke:2px_var(--color-ink)] sm:text-7xl">
            Rhyme Hero
          </h1>
          <p className="mt-1 font-bold text-white">You write the lines. We train the skills.</p>
        </header>

        <section className="panel p-5">
          <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="word">
              Target word
            </label>
            <input
              id="word"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="Pick a word to rhyme with..."
              className="flex-1 border-4 border-ink bg-white px-4 py-3 text-lg font-bold shadow-comic-sm outline-none focus:bg-hero-yellow/30"
            />
            <button
              type="submit"
              disabled={loading || engine === "offline"}
              className="border-4 border-ink bg-hero-blue px-6 py-3 font-display text-2xl tracking-wider text-white shadow-comic-sm transition active:translate-x-[3px] active:translate-y-[3px] active:shadow-none disabled:opacity-50"
            >
              {loading ? "Zzzap..." : "Power up!"}
            </button>
          </form>
          <p className="mt-3 text-sm font-bold">
            Engine:{" "}
            <span
              className={
                engine === "online" ? "text-hero-blue" : engine === "offline" ? "text-hero-red" : ""
              }
            >
              {engine}
            </span>
          </p>
        </section>

        {error && (
          <div className="text-center">
            <span className="burst text-3xl">KRAK!</span>
            <p className="mt-2 font-bold">{error}</p>
          </div>
        )}

        {bank && (
          <section className="panel grid gap-6 p-5">
            <div className="flex items-center gap-4">
              <span className="burst text-3xl">POW!</span>
              <div>
                <p className="font-display text-3xl tracking-wide">{bank.word}</p>
                {bank.stress && (
                  <p className="text-sm font-bold">
                    Stress: <code>{bank.stress}</code> · Syllables: {bank.syllables}
                  </p>
                )}
              </div>
            </div>
            <div className="speech-bubble">
              {bank.perfect.length > 0 ? (
                <>
                  <p className="mb-2 font-bold">Word bank - now YOU build the line:</p>
                  <ul className="flex flex-wrap gap-2">
                    {bank.perfect.map((w) => (
                      <li key={w} className="border-2 border-ink bg-hero-yellow px-2 py-0.5 font-bold">
                        {w}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="font-bold">No perfect rhymes found. Which vowel sound could you match instead?</p>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
