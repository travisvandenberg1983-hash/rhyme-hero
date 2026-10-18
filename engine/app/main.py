import os

import pronouncing
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.guardrails import single_words

app = FastAPI(title="Rhyme Hero Engine", version="0.1.0")

# The web UI is a separate origin and reaches the engine only over HTTP.
_origins = os.getenv("RHYME_HERO_CORS_ORIGINS", "http://localhost:5173,http://localhost:4173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in _origins.split(",") if o.strip()],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


class WordBank(BaseModel):
    word: str
    perfect: list[str]
    stress: str | None
    syllables: int | None


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/v1/word-bank", response_model=WordBank)
def word_bank(word: str = Query(..., min_length=1, max_length=40)) -> WordBank:
    target = word.strip().lower()
    if " " in target:
        raise HTTPException(status_code=422, detail="Send a single word.")

    phones = pronouncing.phones_for_word(target)
    stress = pronouncing.stresses(phones[0]) if phones else None
    syllables = pronouncing.syllable_count(phones[0]) if phones else None

    return WordBank(
        word=target,
        perfect=single_words(pronouncing.rhymes(target)),
        stress=stress,
        syllables=syllables,
    )
