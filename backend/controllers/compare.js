const { Request, Response } = require("express");

const logger = require("../services/Logger.js");
const GoogleSheet = require("../services/GoogleSheet.js");

const compareQueue = require("../jobs/compare");
const { getIdFromSheetUrl } = require("../utils/helpers");

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
const createComparePair = async (req, res) => {
  try {
    const { interval, blackListTable, checkTable } = req.body;
    logger.error("createComparePair", req.body);

    await Promise.all([
      new GoogleSheet(
        getIdFromSheetUrl(blackListTable.url),
        blackListTable.sheetName,
        blackListTable.columnName
      ).init(),
      new GoogleSheet(
        getIdFromSheetUrl(checkTable.url),
        checkTable.sheetName,
        checkTable.columnName
      ).init(),
    ]);

    const id = Date.now().toString();
    await compareQueue.add(
      { id, ...req.body },
      {
        repeat: { every: Number(interval) * 60 * 1000 },
        removeOnComplete: true,
        removeOnFail: true,
        jobId: id,
      }
    );

    res.json({ ...req.body, id });
  } catch (err) {
    logger.error("createComparePairError", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
const getAllPairs = async (req, res) => {
  try {
    logger.error("getAllPairs");

    const jobs = await compareQueue.getJobs();

    const pairs = [];
    for (const job of jobs) {
      const { id, data } = job;
      if (data.id === id) {
        pairs.push({ id, ...data });
      }
    }

    res.json({ pairs });
  } catch (err) {
    logger.error("getAllPairsError", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
const deletePair = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info("deletePair", { id });

    const job = await compareQueue.getJob(id);

    await compareQueue.removeRepeatable({ jobId: id, ...job.opts.repeat });
    await compareQueue.removeJobs(id);

    res.json({ id });
  } catch (err) {
    logger.error("deletePairError", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createComparePair, getAllPairs, deletePair };
