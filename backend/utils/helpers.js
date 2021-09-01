function getIdFromSheetUrl(url) {
  const result = url.match(/[-\w]{25,}/);
  if (result) {
    return result[0];
  }
  return null;
}

module.exports = { getIdFromSheetUrl };
