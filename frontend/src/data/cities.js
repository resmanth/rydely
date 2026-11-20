/**
 * cities.js — Canonical list of supported cities for the Rydely platform.
 *
 * This file is used in two places:
 *   1. The search/filter dropdowns on the Cars page (where users pick a city).
 *   2. The "Add Car" form (where owners select which city their car is in).
 *
 * IMPORTANT: The `value` field MUST match the exact string stored in `Car.location`
 * in the MongoDB database, because the backend matches cities with strict equality.
 *
 * This file also provides two helper functions:
 *   - matchCity(text)   — fuzzy-matches user input to a canonical city value
 *   - allCityValues()   — returns a plain array of all city value strings
 */

// --- City List ---
// Each city has a `label` (displayed in the UI) and a `value` (sent to the backend).
const CITIES = [
    { label: 'Mumbai', value: 'Mumbai' },
    { label: 'Delhi NCR', value: 'Delhi NCR' },
    { label: 'Bengaluru', value: 'Bengaluru' },
    { label: 'Goa', value: 'Goa' },
    { label: 'Pune', value: 'Pune' },
    { label: 'Hyderabad', value: 'Hyderabad' },
    { label: 'Chennai', value: 'Chennai' },
];

export default CITIES;

// ============================================================
// matchCity — Fuzzy-match free-text input to a canonical city value
// ============================================================
/**
 * Takes user-typed text like "mum", "Mumbai · Bandra", or "delhi"
 * and returns the matching canonical city value (e.g. "Mumbai", "Delhi NCR"),
 * or null if no city matches.
 *
 * Matching rules (case-insensitive):
 *   1. Exact match        — "Mumbai" matches "Mumbai"
 *   2. Starts-with match  — "mum" matches "Mumbai"
 *   3. Contains match     — "Mumbai · Bandra" contains "Mumbai"
 *
 * @param {string} text - The user's input text
 * @returns {string|null} - The canonical city value, or null if no match
 */
export function matchCity(text) {
    if (!text || !text.trim()) return null;

    const lowercaseInput = text.trim().toLowerCase();

    const match = CITIES.find(
        (city) =>
            city.value.toLowerCase() === lowercaseInput ||           // exact match
            city.value.toLowerCase().startsWith(lowercaseInput) ||   // starts-with match
            lowercaseInput.includes(city.value.toLowerCase())        // contains match
    );

    return match ? match.value : null;
}

// ============================================================
// allCityValues — Returns a plain array of all canonical city strings
// ============================================================
/**
 * Returns e.g. ["Mumbai", "Delhi NCR", "Bengaluru", "Goa", "Pune", "Hyderabad", "Chennai"]
 * Useful when you need just the values (not label/value objects).
 */
export function allCityValues() {
    return CITIES.map((city) => city.value);
}
