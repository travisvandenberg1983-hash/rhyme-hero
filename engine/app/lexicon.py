"""Which rhyme candidates are worth showing a learner, and in what order.

The CMU dictionary behind ``pronouncing`` is full of surnames and junk tokens
(kaneshiro, yamashiro, co., ...). We keep a word only if it is a lowercase entry
in Webster's 2nd (so proper nouns drop out) and used at least occasionally in
modern English. Survivors are sorted rarer-first to push the learner's vocabulary
(see the build plan, Step 4).
"""

from functools import lru_cache

from english_words import get_english_words_set
from wordfreq import zipf_frequency

# Zipf scale: 3 is roughly once per million words. Below 2.5 it's mostly archaic or noise.
MIN_ZIPF = 2.5


@lru_cache(maxsize=1)
def _lowercase_dictionary() -> frozenset[str]:
    return frozenset(w for w in get_english_words_set(["web2"], alpha=True) if w.islower())


def frequency(word: str) -> float:
    return zipf_frequency(word, "en")


def rank_for_vocab(candidates: list[str]) -> list[str]:
    """Keep dictionary words (no proper nouns) above MIN_ZIPF, rarest first."""
    lexicon = _lowercase_dictionary()
    keep = {
        w
        for w in (c.lower() for c in candidates)
        if len(w) > 1 and w in lexicon and frequency(w) >= MIN_ZIPF
    }
    return sorted(keep, key=lambda w: (frequency(w), w))
