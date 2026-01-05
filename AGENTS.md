AI Maintenance & Logic Guide

Overview

This document serves as a reference for AI agents tasked with maintaining, debugging, or extending the Biblical Feast Calculator. It outlines the core mathematical algorithms, critical logic constraints, and external dependencies required to preserve the tool's accuracy.

Core Mathematical Logic

1. The "Closest Conjunction" Rule (Nisan 1)

The defining feature of this calendar is that the New Year (1 Nisan) is anchored to the Vernal Equinox, but not strictly after it. It is anchored to the closest New Moon conjunction.

Algorithm:

Calculate Vernal Equinox ($T_{eq}$):

Use Astronomy.Seasons(Year).mar_equinox.

Locate Candidate Moons:

$T_{prev}$: The New Moon conjunction strictly $\le T_{eq}$.

$T_{next}$: The New Moon conjunction strictly $> T_{prev}$.

Determine Distance:

$\Delta_{prev} = |T_{eq} - T_{prev}|$

$\Delta_{next} = |T_{eq} - T_{next}|$

Selection:

IF $\Delta_{prev} \le \Delta_{next}$: 1 Nisan is set by $T_{prev}$.

ELSE: 1 Nisan is set by $T_{next}$.

2. Feast Date Calculations

Once 1 Nisan is established, other dates are derived relative to it or via subsequent lunations.

Passover (14 Nisan): Date(Nisan 1) + 13 days

Unleavened Bread (15 Nisan): Date(Nisan 1) + 14 days

Wave Sheaf Offering:

Find 15 Nisan.

If 15 Nisan is a Sunday -> Wave Sheaf is 15 Nisan.

Else -> Advance to the next Sunday.

Pentecost (Shavuot):

Date(Wave Sheaf) + 49 days (Total 50 days inclusive).

Trumpets (1 Tishri):

Iterate 6 lunations forward from the Nisan 1 conjunction.

Constraint: Must find the actual 7th New Moon conjunction, not just add 177 days.

Atonement (10 Tishri): Date(Tishri 1) + 9 days

Tabernacles (15 Tishri): Date(Tishri 1) + 14 days

Critical Code Constraints

Time Zone Separation

Determination Phase: All calculations for "Day 1" must effectively happen in Jerusalem Time. The code uses Intl.DateTimeFormat with timeZone: 'Asia/Jerusalem' to convert an astronomical timestamp into a calendar date.

Why: A conjunction happening at 23:00 UTC might be 01:00 (+1 day) in Jerusalem. The Jerusalem date determines the feast day.

Display Phase: The UI allows toggling between Local Time and Jerusalem Time. This affects only the text string shown to the user, never the underlying date determination.

The "Next Moon" Loop Bug

When iterating through moons (e.g., finding Tishri), simple searches starting at the exact time of a previous moon can result in returning the same moon due to floating-point precision.

Requirement: Always add a buffer (e.g., +5 days) to the start time when searching for the next moon phase.

// Correct Pattern
searchStart.setDate(currentMoon.getDate() + 5);
nextMoon = Astronomy.SearchMoonPhase(0, searchStart, ...);


External Dependencies

Library: astronomy-engine (via jsDelivr CDN).

Docs: GitHub - cosnek/astronomy-engine

Status: The library is stable. Do not replace with a less precise library (e.g., simple epoch math) as this will fail the "Closest Conjunction" checks which often come down to minutes.

Reference Source

This logic is derived from the Christian Churches of God (CCG) calendar study.

Source URL: http://ccg.org/Calendar/Gods_Calendar.htm
