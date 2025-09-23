// Forces English (Latin) digits for number and date localization across the app
// Applies only when locale is missing or Arabic; otherwise respects the passed locale.
(function enforceEnglishDigits() {
  const normalizeLocale = (locales: any) => {
    if (!locales) return 'en-US';
    if (typeof locales === 'string' && locales.toLowerCase().startsWith('ar')) return 'en-US';
    if (Array.isArray(locales) && locales.length && String(locales[0]).toLowerCase().startsWith('ar')) return 'en-US';
    return locales;
  };

  const numToLocale = Number.prototype.toLocaleString;
  Number.prototype.toLocaleString = function (locales?: any, options?: Intl.NumberFormatOptions) {
    return numToLocale.call(this, normalizeLocale(locales), options);
  };

  const dateToLocale = Date.prototype.toLocaleString;
  Date.prototype.toLocaleString = function (locales?: any, options?: Intl.DateTimeFormatOptions) {
    return dateToLocale.call(this, normalizeLocale(locales), options);
  };

  const dateToLocaleDate = Date.prototype.toLocaleDateString;
  Date.prototype.toLocaleDateString = function (locales?: any, options?: Intl.DateTimeFormatOptions) {
    return dateToLocaleDate.call(this, normalizeLocale(locales), options);
  };

  const dateToLocaleTime = Date.prototype.toLocaleTimeString;
  Date.prototype.toLocaleTimeString = function (locales?: any, options?: Intl.DateTimeFormatOptions) {
    return dateToLocaleTime.call(this, normalizeLocale(locales), options);
  };
})();
