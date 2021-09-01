const { GoogleSpreadsheet } = require("google-spreadsheet");

const serviceAccountCreds = require("../serviceAccountCreds");
const logger = require("./Logger");

class GoogleSheet {
  constructor(id, sheetName, columnName) {
    this.doc = new GoogleSpreadsheet(id);
    this.id = id;

    this.columnName = columnName;
    this.sheetName = sheetName;

    this.currentStartRow = 1;
    this.currentEndRow = 1;

    this.cellIndex = 1;
  }

  async init() {
    this.doc.useServiceAccountAuth(serviceAccountCreds);
    await this.doc.loadInfo();

    const sheetIndex = this.doc.sheetsByIndex.findIndex(
      ({ title }) => title === this.sheetName
    );

    if (sheetIndex === -1) {
      throw new Error(`${this.sheetName} is wrong sheet name for ${this.id}`);
    }

    this.sheet = this.doc.sheetsByIndex[sheetIndex];
    await this.sheet.loadHeaderRow();

    this.columnIndex = this.sheet.headerValues.findIndex(
      (name) => name === this.columnName
    );

    if (this.columnIndex === -1) {
      throw new Error(`${this.columnName} is wrong column name for ${this.id}`);
    }

    if (!this.rowCount) {
      this.rowsCount = this.sheet.rowCount;
    }
  }

  async loadRows(amount) {
    this.currentStartRow = this.currentEndRow;
    this.currentEndRow = this.currentEndRow + amount;
    logger.info("loadRows", {
      currentStartRow: this.currentStartRow,
      currentEndRow: this.currentEndRow,
      sheet: this.sheetName,
      column: this.columnName,
    });

    await this.#loadCells();

    const hasMore = this.currentEndRow + amount < this.rowsCount;
    return hasMore;
  }

  async resetRows() {
    await this.sheet.saveUpdatedCells();
    this.sheet.resetLocalCache(true);

    this.currentStartRow = 1;
    this.currentEndRow = 1;
    this.cellIndex = 1;
  }

  getNextCell() {
    if (this.cellIndex >= this.currentEndRow) {
      return -1;
    }

    const value = this.sheet.getCell(this.cellIndex, this.columnIndex)?.value;

    const index = this.cellIndex;
    this.cellIndex += 1;
    return { index, value };
  }

  getAllAvailableData() {
    const availableData = [];
    let cellData = -1;
    do {
      cellData = this.getNextCell();
      if (cellData === -1) break;

      if (cellData.value) {
        availableData.push(cellData);
      }
    } while (cellData !== -1);

    // if whole read array is empty than it means that there is no more data
    if (availableData.length === 0) {
      this.rowsCount = this.currentEndRow;
    }

    return availableData;
  }

  async #loadCells(retry = false) {
    try {
      await this.sheet.saveUpdatedCells();
      this.sheet.resetLocalCache(true);

      await this.sheet.loadCells({
        startRowIndex: this.currentStartRow,
        endRowIndex: this.currentEndRow,
        startColumnIndex: this.columnIndex,
        endColumnIndex: this.columnIndex + 1,
      });
    } catch (err) {
      logger.error("loadCellsError", err);
      logger.info("loadCellsError", { retry });
      if (err?.response?.statusText === "Too Many Requests" && !retry) {
        logger.info("loadCells googleSheetApi cooldown 60 sec");
        await new Promise((resolve) => setTimeout(resolve, 60000));
        await this.init();

        await this.#loadCells(true);
      }
    }
  }

  /**
   *
   * @param {number} index
   * @param {Object} rgbColor
   * @param {number} rgbColor.red
   * @param {number} rgbColor.green
   * @param {number} rgbColor.blue
   */
  setCellColor(index, rgbColor) {
    const colorObject = {
      red: rgbColor.red / 255,
      green: rgbColor.green / 255,
      blue: rgbColor.blue / 255,
      alpha: 1,
    };

    const cell = this.sheet.getCell(index, this.columnIndex);
    cell.backgroundColor = colorObject;
  }

  get spreadsheet() {
    return this.sheet;
  }
}

module.exports = GoogleSheet;
