from fastapi.testclient import TestClient

from app.guardrails import single_words
from app.main import app

client = TestClient(app)


def test_health():
    assert client.get("/health").json() == {"status": "ok"}


def test_word_bank_returns_only_single_words():
    res = client.get("/api/v1/word-bank", params={"word": "hero"})
    assert res.status_code == 200
    body = res.json()
    assert body["word"] == "hero"
    assert body["perfect"], "expected some rhymes for 'hero'"
    assert all(" " not in w for w in body["perfect"])


def test_word_bank_rejects_phrases():
    assert client.get("/api/v1/word-bank", params={"word": "save the day"}).status_code == 422


def test_guardrail_drops_phrases():
    assert single_words(["night", "in the night", "Light", "light"]) == ["night", "light"]
