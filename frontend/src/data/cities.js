/**
 * Canonical city list for search and add-car dropdown.
 *
 * The `value` MUST match the exact string stored in `Car.location`
 * in the database (backend matches with strict equality).
 */
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

/**
 * Maps free-text input like "mum", "Mumbai · Bandra", "delhi"
 * to the canonical city value, or null if no match.
 */
export function matchCity(text) {
    if (!text || !text.trim()) return null;
    const lower = text.trim().toLowerCase();
    const match = CITIES.find(
        (c) =>
            c.value.toLowerCase() === lower ||
            c.value.toLowerCase().startsWith(lower) ||
            lower.includes(c.value.toLowerCase())
    );
    return match ? match.value : null;
}

/** Returns all canonical city values. */
export function allCityValues() {
    return CITIES.map((c) => c.value);
}
