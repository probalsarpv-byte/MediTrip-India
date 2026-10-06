/* Pure logic shared by the UI and unit tests. No AI, network, diagnosis or clinical ranking. */
(function (scope) {
  function filterHospitals(items, filter, language, translations) {
    const query = (filter.query || '').trim().toLocaleLowerCase();
    return items.filter(h => {
      if (filter.city && h.city !== filter.city) return false;
      if (filter.specialty && !h.specialties.includes(filter.specialty)) return false;
      if (filter.stay && !h.hotels.length && !h.hotelSearch) return false;
      if (!query) return true;
      const haystack = [h.name[language], h.name.en, h.branch[language], h.address[language],
        translations['city.' + h.city], ...h.specialties.map(s => translations['sp.' + s])].join(' ').toLocaleLowerCase();
      return haystack.includes(query);
    });
  }
  function matchHospitals(items, preferences) {
    const selectedWeights = (preferences.city ? 40 : 0) + (preferences.specialty ? 40 : 0) + (preferences.stay ? 20 : 0);
    return filterHospitals(items, { ...preferences, query: '' }, 'en', {}).map(h => {
      const reasons = [];
      let points = 0;
      if (preferences.city) { points += 40; reasons.push('cityReason'); }
      if (preferences.specialty) { points += 40; reasons.push('specialtyReason'); }
      if (preferences.stay) { points += 20; reasons.push('hotelReason'); }
      return { hospital: h, fit: selectedWeights ? Math.round(points / selectedWeights * 100) : null, reasons };
    }); // Equal matches retain editorial directory order, never imply superiority.
  }
  const LIMITS = { days: 365, roomRate: 1000000, meals: 1000000, treatment: 100000000,
    transport: 100000000, extra: 100000000, rate: 1000, buffer: 100 };
  function normaliseBudget(input) {
    const out = {};
    Object.keys(LIMITS).forEach(key => {
      const value = Number(input[key]);
      out[key] = Number.isFinite(value) ? Math.max(0, Math.min(LIMITS[key], value)) : 0;
    });
    out.days = Math.floor(out.days);
    return out;
  }
  function calculateBudget(input) {
    const b = normaliseBudget(input);
    const subtotal = b.days * (b.roomRate + b.meals) + b.treatment + b.transport + b.extra;
    const inr = subtotal * (1 + b.buffer / 100);
    return { inr, bdt: b.rate > 0 ? inr * b.rate : null, subtotal };
  }
  function validatePlan(input, data, checklist) {
    if (!input || input.schema !== 'meditrip-plan-v1') throw new Error('schema');
    const allowed = new Set([...data.hospitals, ...data.hotels].map(x => x.id));
    const allowedChecks = new Set(checklist.map(x => x.id));
    if (!Array.isArray(input.saved) || !Array.isArray(input.done)) throw new Error('shape');
    return { saved: [...new Set(input.saved.filter(x => typeof x === 'string' && allowed.has(x)))],
      done: [...new Set(input.done.filter(x => typeof x === 'string' && allowedChecks.has(x)))],
      budget: normaliseBudget(input.budget || {}) };
  }
  function speechChunks(text, maxLength = 1000) {
    const out = [];
    let remaining = String(text);
    while (remaining.length) {
      let end = Math.min(remaining.length, Math.max(1, maxLength));
      if (end < remaining.length) {
        const whitespace = remaining.lastIndexOf(" ", end);
        if (whitespace > end / 2) end = whitespace + 1;
      }
      out.push(remaining.slice(0, end)); remaining = remaining.slice(end);
    }
    return out;
  }
  const api = { speechChunks, filterHospitals, matchHospitals, normaliseBudget, calculateBudget, validatePlan, LIMITS };
  scope.MediCore = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
