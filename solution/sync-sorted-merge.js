"use strict";

const MinHeap = require('min-heap');

/**
 *  Heap merge
 *
 *  Processing
 *  O(n log k), n is number of elements across all lists and k is the number of lists.
 *
 *  Memory
 *  O(k)
 *
 * 3 Random runs
 * ===========================================
 * Logs printed:            24294
 * Time taken (s):          0.352
 * Logs/s:                  69017.04545454546
 *
 * Logs printed:            23968
 * Time taken (s):          0.359
 * Logs/s:                  66763.23119777159
 *
 * Logs printed:            23591
 * Time taken (s):          0.295
 * Logs/s:                  79969.49152542373
 * ===========================================
 */

module.exports = async (logSources, printer) => {
  const heap = new MinHeap((a, b) => a.log.date - b.log.date);
  logSources.forEach((source, idx) => {
    const log = source.pop();
    if (log) {
      heap.insert({ log, idx });
    }
  })

  while (heap.size) {
    const { log, idx } = heap.removeHead();
    printer.print(log);

    const nextLog = logSources[idx].pop();
    if (nextLog) {
      heap.insert({ log: nextLog, idx });
    }
  }

  await printer.done();
};