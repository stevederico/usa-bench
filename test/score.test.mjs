import { test } from "node:test";
import assert from "node:assert/strict";
import { scoreEntry, scoreHardware } from "../scripts/score.mjs";

const pulse = new Date(2026, 10, 1);
const noPenalties = [0, 0, 0, 0, 0];

function score(entry, penalties = noPenalties) {
  return scoreEntry({ model: "M", baseScore: 100, ...entry }, pulse, [], ...penalties);
}

test("only a full-open, US-taught, US-based, non-closed model can reach 100", () => {
  const clean = score({ fullOpen: true });
  assert.equal(clean.cap, 100);
  assert.equal(clean.score, 100);
});

test("missing fullOpen, a foreign teacher, a foreign base or closed weights cap the score at 99", () => {
  for (const flags of [{}, { fullOpen: true, foreignTeacher: true }, { fullOpen: true, closed: true }]) {
    const result = score(flags);
    assert.equal(result.cap, 99, JSON.stringify(flags));
    assert.equal(result.score, 99, JSON.stringify(flags));
  }
  assert.equal(score({ fullOpen: true, chinaBase: true }).cap, 99);
});

test("a foreign foundation is a hard 0 whatever the base score and penalty", () => {
  assert.equal(score({ fullOpen: true, chinaBase: true }).score, 0);
  assert.equal(score({ chinaBase: true, foreignTeacher: true }, [25, 15, 0, 0, 0]).score, 0);
});

test("a foreign SFT or synth teacher is only a soft penalty", () => {
  const result = score({ baseScore: 90, foreignTeacher: true }, [25, 15, 0, 0, 0]);
  assert.equal(result.foreignTeacherPenalty, 15);
  assert.equal(result.score, 75);
});

const hwWeights = { usParts: 40, finalAssembly: 20, boardAssembly: 10, chipFab: 15, display: 5, usDesign: 20 };
const allUS = {
  usContentPct: 100,
  finalAssemblyUS: true,
  boardAssemblyUS: true,
  chipFabUS: true,
  displayUS: true,
  usDesign: true,
};

test("hardware reaches 100 only when every part is US", () => {
  assert.equal(scoreHardware(allUS, hwWeights).score, 100);
});

test("hardware with any non-US part caps at 99", () => {
  const result = scoreHardware({ ...allUS, displayUS: false }, hwWeights);
  assert.equal(result.cap, 99);
  assert.equal(result.score, 99);
  assert.equal(scoreHardware({ ...allUS, usContentPct: 99 }, { ...hwWeights, usParts: 60 }).score, 99);
});
