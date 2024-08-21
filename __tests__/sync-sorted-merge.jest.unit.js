const heapMerge = require('../solution/sync-sorted-merge');

describe('Heap Merge Function', () => {
    let logSources;
    let printer;

    beforeEach(() => {
        logSources = [
            {
                pop: jest.fn()
                    .mockReturnValueOnce({date: new Date('2024-08-19T12:00:00Z')})
                    .mockReturnValueOnce({date: new Date('2024-08-19T12:01:00Z')})
                    .mockReturnValueOnce(null),
            },
            {
                pop: jest.fn()
                    .mockReturnValueOnce({date: new Date('2024-08-19T12:00:30Z')})
                    .mockReturnValueOnce({date: new Date('2024-08-19T12:01:30Z')})
                    .mockReturnValueOnce(null),
            },
        ];

        printer = {
            print: jest.fn(),
            done: jest.fn().mockReturnValue(true),
        };
    });

    test('should merge and print logs in the correct order', async () => {
        await heapMerge(logSources, printer);

        expect(printer.print).toHaveBeenCalledTimes(4);
        expect(printer.print.mock.calls[0][0].date).toEqual(new Date('2024-08-19T12:00:00Z'));
        expect(printer.print.mock.calls[1][0].date).toEqual(new Date('2024-08-19T12:00:30Z'));
        expect(printer.print.mock.calls[2][0].date).toEqual(new Date('2024-08-19T12:01:00Z'));
        expect(printer.print.mock.calls[3][0].date).toEqual(new Date('2024-08-19T12:01:30Z'));
    });

    test('should handle empty log sources', async () => {
        logSources = [
            {
                pop: jest.fn().mockReturnValue(null),
            },
        ];

        await heapMerge(logSources, printer);

        expect(printer.print).not.toHaveBeenCalled();
    });

    test('should call printer.done when finished', async () => {
        await heapMerge(logSources, printer);

        expect(printer.done).toHaveBeenCalled();
    });

    test('should handle logs from multiple sources', async () => {
        logSources = [
            {
                pop: jest.fn()
                    .mockReturnValueOnce({date: new Date('2024-08-19T12:00:00Z')})
                    .mockReturnValueOnce(null),
            },
            {
                pop: jest.fn()
                    .mockReturnValueOnce({date: new Date('2024-08-19T12:00:30Z')})
                    .mockReturnValueOnce({date: new Date('2024-08-19T12:01:00Z')})
                    .mockReturnValueOnce(null),
            },
            {
                pop: jest.fn()
                    .mockReturnValueOnce({date: new Date('2024-08-19T12:00:15Z')})
                    .mockReturnValueOnce(null),
            },
        ];

        await heapMerge(logSources, printer);

        expect(printer.print).toHaveBeenCalledTimes(4);
        expect(printer.print.mock.calls[0][0].date).toEqual(new Date('2024-08-19T12:00:00Z'));
        expect(printer.print.mock.calls[1][0].date).toEqual(new Date('2024-08-19T12:00:15Z'));
        expect(printer.print.mock.calls[2][0].date).toEqual(new Date('2024-08-19T12:00:30Z'));
        expect(printer.print.mock.calls[3][0].date).toEqual(new Date('2024-08-19T12:01:00Z'));
    });

    test('should handle all logs correctly', async () => {
        logSources = [
            {
                pop: jest.fn()
                    .mockReturnValueOnce({date: new Date('2024-08-19T12:00:00Z')})
                    .mockReturnValueOnce({date: new Date('2024-08-19T12:00:30Z')})
                    .mockReturnValueOnce(null),
            },
            {
                pop: jest.fn()
                    .mockReturnValueOnce({date: new Date('2024-08-19T12:00:15Z')})
                    .mockReturnValueOnce(null),
            },
        ];

        await heapMerge(logSources, printer);

        expect(printer.print).toHaveBeenCalledTimes(3);
        expect(printer.print.mock.calls[0][0].date).toEqual(new Date('2024-08-19T12:00:00Z'));
        expect(printer.print.mock.calls[1][0].date).toEqual(new Date('2024-08-19T12:00:15Z'));
        expect(printer.print.mock.calls[2][0].date).toEqual(new Date('2024-08-19T12:00:30Z'));
    });
});