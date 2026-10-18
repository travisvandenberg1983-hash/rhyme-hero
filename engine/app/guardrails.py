"""Coaching guardrails.

Rhyme Hero is a skill coach: it may hand out single words, word banks, patterns,
stress markers, pauses and questions - never finished lines or verses. Every list
of suggestions the engine returns must pass through ``single_words``.
"""

import re

_SINGLE_WORD = re.compile(r"^[A-Za-z][A-Za-z'\-]*$")


def single_words(candidates: list[str], limit: int = 40) -> list[str]:
    """Keep only single-word suggestions (no spaces, no phrases), deduplicated."""
    seen: set[str] = set()
    out: list[str] = []
    for c in candidates:
        w = c.strip().lower()
        if _SINGLE_WORD.match(w) and w not in seen:
            seen.add(w)
            out.append(w)
        if len(out) >= limit:
            break
    return out
