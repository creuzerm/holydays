const fs = require('fs');
const path = require('path');
const { getFeastsForYear } = require('../src/calculator');

// Load reference data
const referenceDataPath = path.join(__dirname, 'reference_data.json');
const referenceData = JSON.parse(fs.readFileSync(referenceDataPath, 'utf8'));

// Helper to format date as YYYY-MM-DD for comparison
function formatDate(date) {
    const d = new Date(date);
    const month = '' + (d.getMonth() + 1);
    const day = '' + d.getDate();
    const year = d.getFullYear();

    return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
}

let passed = 0;
let failed = 0;

console.log("Starting Biblical Feast Calculation Tests...\n");

referenceData.forEach(yearData => {
    const year = yearData.year;
    console.log(`Testing Year: ${year}`);

    let calculatedFeasts;
    try {
        calculatedFeasts = getFeastsForYear(year);
    } catch (e) {
        console.error(`Error calculating feasts for year ${year}:`, e);
        failed++;
        return;
    }

    yearData.feasts.forEach(refFeast => {
        const calcFeast = calculatedFeasts.find(f => f.name === refFeast.name);

        if (!calcFeast) {
            console.error(`  [FAIL] Feast not found: ${refFeast.name}`);
            failed++;
            return;
        }

        const calcDateStr = formatDate(calcFeast.dateObj);

        // Check Date
        if (calcDateStr === refFeast.expectedDate) {
            console.log(`  [PASS] ${refFeast.name}: ${calcDateStr}`);
            passed++;
        } else {
            console.error(`  [FAIL] ${refFeast.name}: Expected ${refFeast.expectedDate}, Got ${calcDateStr}`);
            failed++;
        }

        // Check Day of Week (optional, implied by date, but good for verify)
        const calcDay = calcFeast.dateObj.toLocaleDateString('en-US', { weekday: 'long' });
        if (calcDay !== refFeast.expectedDay) {
            console.error(`         Day mismatch: Expected ${refFeast.expectedDay}, Got ${calcDay}`);
        }
    });
    console.log("");
});

console.log(`Tests Completed. Passed: ${passed}, Failed: ${failed}`);

if (failed > 0) {
    process.exit(1);
}
