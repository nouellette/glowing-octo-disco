"use strict";

const MinHeap = require('min-heap');

/**
 *  Heap merge
 *
 * Different delays (https://github.com/sesolabor/glowing-octo-disco/blob/master/lib/log-source.js#L47)
 * ===========================================
 * Logs printed:            24260
 * Time taken (s):          113.475 (delay 8)
 * Logs/s:                  213.7915840493501
 *
 * Logs printed:            23866
 * Time taken (s):          60.906 (delay 4)
 * Logs/s:                  391.8497356582274
 *
 * Logs printed:            23778
 * Time taken (s):          37.485 (delay 2)
 * Logs/s:                  634.3337334933974
 *
 * Logs printed:            23899
 * Time taken (s):          28.602 (delay 0)
 * Logs/s:                  835.5709390951681
 * ===========================================
 */

module.exports = async (logSources, printer) => {
  const heap = new MinHeap((a, b) => a.log.date - b.log.date);

  const promises = logSources.map(async (source, idx) => {
    const log = await source.popAsync();
    if (log) {
      heap.insert({ log, idx });
    }
  });

  await Promise.all(promises);

  while (heap.size) {
    const { log, idx } = heap.removeHead();
    printer.print(log);

    const nextLog = await logSources[idx].popAsync();
    if (nextLog) {
      heap.insert({ log: nextLog, idx });
    }
  }

  return new Promise((resolve) => {
    resolve(printer.done());
  });
};