(function(global) {
    let Astronomy;

    // Handle different environments
    if (typeof global.Astronomy !== 'undefined') {
        Astronomy = global.Astronomy;
    } else if (typeof require !== 'undefined') {
        // In Node.js environment
        try {
            Astronomy = require('astronomy-engine');
        } catch (e) {
            console.warn("Astronomy Engine not found via require. Ensure it's installed or available globally.");
        }
    }

    function getJerusalemDateObject(dateObj) {
        const options = { timeZone: 'Asia/Jerusalem', year: 'numeric', month: 'numeric', day: 'numeric' };
        const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(dateObj);
        const y = parts.find(p => p.type === 'year').value;
        const m = parts.find(p => p.type === 'month').value;
        const d = parts.find(p => p.type === 'day').value;
        return new Date(y, m - 1, d);
    }

    function formatFeastDate(dateObj) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return dateObj.toLocaleDateString('en-US', options);
    }

    function addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    function getFeastsForYear(year) {
        if (!Astronomy) {
            throw new Error("Astronomy Engine is not loaded.");
        }

        // 1. Calculate Vernal Equinox
        const equinox = Astronomy.Seasons(year).mar_equinox;
        const equinoxDate = equinox.date;

        // 2. Find Closest New Moon to Equinox
        const searchStart = new Date(equinoxDate);
        searchStart.setDate(searchStart.getDate() - 25);

        const nm1 = Astronomy.SearchMoonPhase(0, searchStart, 30); // Moon Before or At
        const nm2 = Astronomy.SearchMoonPhase(0, nm1.date, 30); // Next Moon

        // Calculate differences in Milliseconds
        const diff1 = Math.abs(nm1.date - equinoxDate);
        const diff2 = Math.abs(nm2.date - equinoxDate);

        let nisan1Conjunction;
        const diff1Hours = (diff1 / 36e5).toFixed(1);
        const diff2Hours = (diff2 / 36e5).toFixed(1);

        const logicData = {
            equinox: equinoxDate,
            nm1: nm1.date,
            nm2: nm2.date,
            diff1: diff1Hours,
            diff2: diff2Hours,
            chosen: null
        };

        if (diff1 <= diff2) {
            nisan1Conjunction = nm1;
            logicData.chosen = 'prev';
        } else {
            nisan1Conjunction = nm2;
            logicData.chosen = 'next';
        }

        // Determine the "Day" of 1 Nisan based on Jerusalem Conjunction Time
        const nisan1ConjunctionDate = new Date(nisan1Conjunction.date);
        const nisan1JerusalemDate = getJerusalemDateObject(nisan1ConjunctionDate);

        // --- Generate Row Data ---
        const rows = [];

        // 1. New Year (1 Nisan)
        rows.push({
            name: "New Year (Rosh Chodesh Nisan)",
            dateObj: nisan1JerusalemDate,
            endDateObj: null,
            bDate: "1 Nisan",
            logicType: "equinox",
            logicData: logicData,
            verse: "Exodus 12:2, Deut 16:1"
        });

        // 2. Lord's Supper (14 Nisan - Evening of)
        const nisan14 = addDays(nisan1JerusalemDate, 13);
        rows.push({
            name: "Lord's Supper",
            dateObj: nisan14,
            bDate: "14 Nisan (Evening)",
            logicType: "simple",
            logicText: `Count 14 days from 1 Nisan. Observed the evening prior (start of 14th).`,
            verse: "Leviticus 23:5"
        });

        // 3. Passover / NTBMO (15 Nisan)
        const nisan15 = addDays(nisan1JerusalemDate, 14);
        rows.push({
            name: "Passover / Night To Be Much Observed",
            dateObj: nisan15,
            bDate: "15 Nisan",
            logicType: "simple",
            logicText: `Count 15 days from 1 Nisan. Beginning of Unleavened Bread.`,
            verse: "Leviticus 23:6"
        });

        // 4. Feast of Unleavened Bread (15-21 Nisan)
        const nisan21 = addDays(nisan1JerusalemDate, 20);
        rows.push({
            name: "Feast of Unleavened Bread",
            dateObj: nisan15,
            endDateObj: nisan21,
            bDate: "15 Nisan – 21 Nisan",
            logicType: "simple",
            logicText: `Seven days starting from 15 Nisan.`,
            verse: "Leviticus 23:6-8"
    });

        // 5. Wave Sheaf Offering
        let waveSheafDate = new Date(nisan15);
        while (waveSheafDate.getDay() !== 0) { // 0 is Sunday
            waveSheafDate.setDate(waveSheafDate.getDate() + 1);
        }

        let wsLogic = "";
        if (waveSheafDate.getTime() === nisan15.getTime()) {
            wsLogic = "15 Nisan falls on a Sunday.";
        } else {
            const diff = Math.round((waveSheafDate - nisan15) / (1000 * 60 * 60 * 24));
            wsLogic = `15 Nisan is ${formatFeastDate(nisan15).split(',')[0]}. Next Sunday is +${diff} days.`;
        }

        rows.push({
            name: "Wave Sheaf Offering",
            dateObj: waveSheafDate,
            bDate: "First Sunday of ULB",
            logicType: "simple",
            logicText: `${wsLogic} The Morrow after the Sabbath.`,
            verse: "Leviticus 23:10-11"
        });

        // 6. Pentecost
        const pentecost = addDays(waveSheafDate, 49);
        rows.push({
            name: "Pentecost (Shavuot)",
            dateObj: pentecost,
            bDate: "Variable (Sivan)",
            logicType: "simple",
            logicText: `Count exactly 50 days from Wave Sheaf Sunday. Target is always a Sunday.`,
            verse: "Leviticus 23:15-16"
        });

        // 7. Trumpets (1 Tishri)
        let currentMoon = nisan1Conjunction;
        for(let i=0; i<6; i++) {
            // Buffer to find next lunation
            const searchFrom = new Date(currentMoon.date);
            searchFrom.setDate(searchFrom.getDate() + 5);
            currentMoon = Astronomy.SearchMoonPhase(0, searchFrom, 35);
        }
        const tishri1Conjunction = currentMoon;
        const tishri1Date = new Date(tishri1Conjunction.date);
        const tishri1JerusalemDate = getJerusalemDateObject(tishri1Date);

        rows.push({
            name: "Feast of Trumpets (Rosh Hashanah)",
            dateObj: tishri1JerusalemDate,
            bDate: "1 Tishri",
            logicType: "moon",
            logicData: { moon: tishri1Date },
            logicText: "7th New Moon Conjunction (6 lunations after Nisan 1).",
            verse: "Leviticus 23:24"
        });

        // 8. Atonement (10 Tishri)
        const tishri10 = addDays(tishri1JerusalemDate, 9);
        rows.push({
            name: "Day of Atonement (Yom Kippur)",
            dateObj: tishri10,
            bDate: "10 Tishri",
            logicType: "simple",
            logicText: `1 Tishri + 9 days.`,
            verse: "Leviticus 23:27"
        });

        // 9. Tabernacles (15 Tishri)
        const tishri15 = addDays(tishri1JerusalemDate, 14);
        const tishri21 = addDays(tishri1JerusalemDate, 20);
        rows.push({
            name: "Feast of Tabernacles (Sukkot)",
            dateObj: tishri15,
            endDateObj: tishri21,
            bDate: "15 Tishri – 21 Tishri",
            logicType: "simple",
            logicText: `Seven days starting 15 Tishri.`,
            verse: "Leviticus 23:34"
        });

        // 10. Last Great Day (22 Tishri)
        const tishri22 = addDays(tishri1JerusalemDate, 21);
        rows.push({
            name: "The Last Great Day",
            dateObj: tishri22,
            bDate: "22 Tishri",
            logicType: "simple",
            logicText: `The day immediately following Tabernacles.`,
            verse: "Leviticus 23:36"
        });

        return rows;
    }

    const Calculator = {
        getFeastsForYear,
        addDays,
        getJerusalemDateObject,
        formatFeastDate
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Calculator;
    } else {
        global.BiblicalCalculator = Calculator;
    }

})(typeof window !== 'undefined' ? window : this);
