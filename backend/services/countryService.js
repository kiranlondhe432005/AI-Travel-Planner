/**
 * Service to fetch country details from REST Countries API.
 * Uses native fetch available in Node.js v18+.
 */
export const getCountryDetails = async (countryName) => {
  if (!countryName) return null;

  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`
    );

    // Fallback if fullText search fails (sometimes names don't match exactly)
    let data;
    if (!response.ok) {
      const fallbackResponse = await fetch(
        `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`
      );
      if (!fallbackResponse.ok) {
        return null;
      }
      data = await fallbackResponse.json();
    } else {
      data = await response.json();
    }

    if (!data || data.length === 0) return null;

    const country = data[0];

    // Format currency details
    let currency = 'N/A';
    if (country.currencies) {
      const currencyKeys = Object.keys(country.currencies);
      if (currencyKeys.length > 0) {
        const cur = country.currencies[currencyKeys[0]];
        currency = `${cur.name} (${cur.symbol || currencyKeys[0]})`;
      }
    }

    // Format languages
    let languages = 'N/A';
    if (country.languages) {
      languages = Object.values(country.languages).join(', ');
    }

    return {
      currency,
      languages,
      capital: country.capital ? country.capital[0] : 'N/A',
      flag: country.flags ? country.flags.svg || country.flags.png : '',
      flagEmoji: country.flag || '',
    };
  } catch (error) {
    console.error('REST Countries API error:', error.message);
    return null;
  }
};
