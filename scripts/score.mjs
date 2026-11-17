const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function parseDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function monthsBetween(released, pulse) {
  return (
    (pulse.getFullYear() - released.getFullYear()) * 12 +
    (pulse.getMonth() - released.getMonth())
  );
}

function recencyPenalty(months, decayTable) {
  for (const row of decayTable) {
    if (row.maxMonths === null || months <= row.maxMonths) {
      return row.penalty;
    }
  }
  return decayTable.at(-1).penalty;
}

export function formatReleased(iso) {
  const d = parseDate(iso);
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function stars(score) {
  if (score >= 95) return "⭐⭐⭐";
  if (score >= 80) return "⭐⭐";
  if (score >= 60) return "⭐";
  return "";
}

function entryNotes(entry, ageMonths, releasedLabel) {
  let text;
  if (entry.chinaBase) {
    text = `❌ Foreign base: ${entry.chinaBaseLabel} • ${entry.whyFlagged ?? ""}`;
  } else if (entry.foreignTeacher) {
    text = `⚠️ Foreign teacher: ${entry.foreignTeacherLabel} • ${entry.whyFlagged ?? entry.notes ?? ""}`;
  } else {
    text = entry.notes ?? "";
  }
  if (entry.released && text.includes("⚠️ aging") && ageMonths !== null) {
    text = text.replace(/⚠️ aging(?:\s*\(~\d+\s*mo\))?/, `⚠️ aging (~${ageMonths} mo)`);
  }
  text = text.trim();
  if (releasedLabel) {
    text = text ? `Released ${releasedLabel} • ${text}` : `Released ${releasedLabel}`;
  }
  return text || "—";
}

export function isForeignDisqualified(entry) {
  return Boolean(entry.chinaBase);
}

export function scoreEntry(entry, pulse, decayTable, chinaBasePenalty, foreignTeacherPenalty, fullOpenBonus, permissiveBonus, closedPenalty) {
  let recency = 0;
  let ageMonths = null;

  if (entry.released) {
    const released = parseDate(entry.released);
    ageMonths = monthsBetween(released, pulse);
    recency = recencyPenalty(ageMonths, decayTable);
  }

  let score = entry.baseScore;
  const fullOpen = entry.fullOpen ? fullOpenBonus : 0;
  const permissive = entry.permissive ? permissiveBonus : 0;
  const bonuses = fullOpen + permissive;
  const cap = entry.fullOpen && !entry.foreignTeacher && !entry.chinaBase && !entry.closed ? 100 : 99;
  score = Math.min(cap, score + bonuses);

  const china = entry.chinaBase ? chinaBasePenalty : 0;
  const teacher = entry.foreignTeacher && !entry.chinaBase ? foreignTeacherPenalty : 0;
  const totalPenalty = recency + china + teacher;

  score -= totalPenalty;
  const closed = entry.closed ? closedPenalty : 0;
  score -= closed;
  score = Math.max(0, Math.min(cap, score));
  if (isForeignDisqualified(entry)) score = 0;

  const openLabel = entry.openSource ? "Yes" : "No";

  return {
    ...entry,
    score,
    cap,
    recencyPenalty: recency,
    chinaPenalty: china,
    foreignTeacherPenalty: teacher,
    closedPenalty: closed,
    totalPenalty,
    fullOpenBonus: fullOpen,
    permissiveBonus: permissive,
    bonuses,
    ageMonths,
    releasedLabel: entry.released ? formatReleased(entry.released) : null,
    starLabel: stars(score),
    openLabel,
    notes: entryNotes(
      entry,
      ageMonths,
      entry.released ? formatReleased(entry.released) : null
    ),
  };
}

export function scoreHardware(h, w) {
  const parts = Math.round(w.usParts * (h.usContentPct ?? 0) / 100);
  const built = {
    finalAssembly: h.finalAssemblyUS ? w.finalAssembly : 0,
    boardAssembly: h.boardAssemblyUS ? w.boardAssembly : 0,
    chipFab: h.chipFabUS ? w.chipFab : 0,
    display: h.displayUS ? w.display : 0,
    usDesign: h.usDesign ? w.usDesign : 0,
  };
  const allUS = h.usContentPct === 100 && h.finalAssemblyUS && h.boardAssemblyUS && h.chipFabUS && h.displayUS && h.usDesign;
  const cap = allUS ? 100 : 99;
  const score = Math.max(0, Math.min(cap, parts + Object.values(built).reduce((a, b) => a + b, 0)));
  return { ...h, score, cap, partsPoints: parts, builtPoints: built, starLabel: stars(score) };
}
