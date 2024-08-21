"use strict";

const MinHeap = require('min-heap');

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