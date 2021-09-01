const GoogleSheet = require("./GoogleSheet");
const logger = require("./Logger");

class GoogleSpreadsheetComparator {
  /**
   *
   * @param {GoogleSheet} banSheet
   * @param {GoogleSheet} searchingSheet
   *
   * @param {Object} banColor
   * @param {number} banColor.red
   * @param {number} banColor.green
   * @param {number} banColor.blue
   */
  constructor(banSheet, searchingSheet, banColor, maxLoadCells = 100) {
    this.MAX_LOAD_CELLS = maxLoadCells;
    this.banColor = banColor;

    this.banSheet = banSheet;
    this.searchingSheet = searchingSheet;
  }

  async compare() {
    let banSheetHasData = true;
    this.banIndices = [];
    while (banSheetHasData) {
      banSheetHasData = await this.banSheet.loadRows(this.MAX_LOAD_CELLS);
      logger.info("banSheetHasData", { banSheetHasData });

      const banValues = this.banSheet.getAllAvailableData();
      logger.info("banValues", { banValues });

      const banMap = banValues.reduce((acc, item) => {
        acc[String(item.value)] = item.index;
        return acc;
      }, {});

      let searchSheetHasData = true;
      while (searchSheetHasData) {
        searchSheetHasData = await this.searchingSheet.loadRows(
          this.MAX_LOAD_CELLS
        );
        const searchValues = this.searchingSheet.getAllAvailableData();
        searchValues.forEach((item) => {
          if (banMap[String(item.value)] !== undefined) {
            const banIndex = item.index;
            this.searchingSheet.setCellColor(banIndex, this.banColor);

            this.banIndices.push(banIndex);
          }
        });
      }
      await this.searchingSheet.resetRows();
    }

    return this.banIndices;
  }
}

module.exports = GoogleSpreadsheetComparator;
