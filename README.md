Biblical Feast Calculator

Overview

The Biblical Feast Calculator is a web-based tool designed to accurately determine the dates of the Biblical Feasts (Holy Days) for any given Gregorian year. Unlike fixed calculation methods such as the Rabbinic Hillel calendar, this calculator utilizes real-time astronomical data to apply the specific observational rules mandated by scripture.

Background & Methodology

The determination of the Biblical calendar relies on two primary astronomical events: the Vernal Equinox and the New Moon conjunctions.

The Core Rule: 1 Nisan

The start of the Biblical year (1 Nisan) is determined by the New Moon conjunction that is closest in time to the Vernal Equinox (Spring Equinox in the Northern Hemisphere).

This conjunction can occur before or after the Equinox.

If the New Moon before the Equinox is closer in time than the New Moon after, the year begins earlier.

This method ensures the calendar remains aligned with the solar year and the seasons, as originally intended.

Why This Tool Exists

Many modern calendars rely on mathematical averages or fixed cycles (like the 19-year Metonic cycle used in the Hillel calendar) which can drift from the actual astronomical events over centuries. This calculator was built to:

Restore Accuracy: Use precise astronomical algorithms (astronomy-engine) to find the exact moment of the Equinox and Conjunctions.

Transparancy: Provide a "Demonstration/Logic" column that explicitly shows the math (e.g., "The previous moon was 15 hours closer to the Equinox than the next moon"), allowing users to verify the dates for themselves.

Jerusalem Focus: All calculations are rooted in Jerusalem Standard Time, observing the biblical precedent of Jerusalem as the center of the calendar.

Scriptural Basis

The calculator follows the commands found in the Torah for the timing of the festivals:

Passover & Unleavened Bread: Leviticus 23:5-8

Wave Sheaf & Pentecost: Leviticus 23:10-16

Trumpets, Atonement, & Tabernacles: Leviticus 23:24-36

Source & References

This project is based on the calendar rules and biblical studies provided by the Christian Churches of God (CCG).

For a detailed explanation of the theological and historical background of this calendar system, please refer to:

God's Calendar

Technical Details

Engine: Astronomy Engine (JS) for high-precision celestial calculations.

Time Zone: Calculations are performed in Jerusalem time; the UI allows toggling between Jerusalem and Local time for ease of use.
