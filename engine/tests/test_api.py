from fastapi.testclient import TestClient

from app.guardrails import single_words
from app.lexicon import MIN_ZIPF, frequency, rank_for_vocab
from app.main import app

client = TestClient(app)


def wordbank(word: str) -> list[str]:
    return client.get("/api/v1/wordbank", params={"word": word}).json()["perfect"]


def test_health():
    assert client.get("/health").json() == {"status": "ok"}


def test_wordbank_returns_only_single_words():
    res = client.get("/api/v1/wordbank", params={"word": "hero"})
    assert res.status_code == 200
    body = res.json()
    assert body["word"] == "hero"
    assert body["perfect"], "expected some rhymes for 'hero'"
    assert all(" " not in w for w in body["perfect"])


def test_wordbank_drops_proper_nouns():
    bank = wordbank("hero")
    assert "zero" in bank
    for name in ["shapiro", "nero", "kaneshiro", "yamashiro", "deniro"]:
        assert name not in bank
    assert "dwight" not in wordbank("night")


def test_wordbank_puts_rarer_words_first():
    bank = wordbank("fire")
    scores = [frequency(w) for w in bank]
    assert scores == sorted(scores)
    assert all(s >= MIN_ZIPF for s in scores)
    assert bank.index("pyre") < bank.index("desire")


def test_rank_for_vocab_drops_single_letters_and_punctuation():
    assert rank_for_vocab(["o", "co.", "non-zero", "zero"]) == ["zero"]


def test_wordbank_rejects_phrases():
    assert client.get("/api/v1/wordbank", params={"word": "save the day"}).status_code == 422


def test_guardrail_drops_phrases():
    assert single_words(["night", "in the night", "Light", "light"]) == ["night", "light"]
