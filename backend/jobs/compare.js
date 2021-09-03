const Queue = require("bull");

const logger = require("../services/Logger.js");
const GoogleSheet = require("../services/GoogleSheet");
const GoogleSheetComparator = require("../services/GoogleSheetComparator");

const { getIdFromSheetUrl } = require("../utils/helpers");

const compareQueue = new Queue("compare", process.env.REDIS_URL);

compareQueue.process(async (job, done) => {
  // const startCompareTime = logger.info("comparePayload", job.data);
  // const { checkTable, blackListTable, color } = job.data;

  // const checkTableId = getIdFromSheetUrl(checkTable.url);
  // const blackListId = getIdFromSheetUrl(blackListTable.url);
  // const blackListSheet = new GoogleSheet(
  //   blackListId,
  //   blackListTable.sheetName,
  //   blackListTable.columnName
  // );
  // await blackListSheet.init();
  // logger.info("blackListSheet initialized");
  // const checkSheet = new GoogleSheet(
  //   checkTableId,
  //   checkTable.sheetName,
  //   checkTable.columnName
  // );
  // await checkSheet.init();
  // logger.info("checkSheet initialized");
  // const comparator = new GoogleSheetComparator(
  //   blackListSheet,
  //   checkSheet,
  //   color
  // );

  // const indexes = await comparator.compare();
  // const endCompareTime = logger.info("compare indexes", indexes);
  // logger.info("createComparePairTime", {
  //   time: (endCompareTime - startCompareTime) / 1000,
  // });

  done();
});

module.exports = compareQueue;
