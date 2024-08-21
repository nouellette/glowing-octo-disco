const heapMerge = require('../solution/async-sorted-merge');

describe('Heap Merge Function', () => {
    let logSources;
    let printer;

    beforeEach(() => {
        logSources = [
            {
                popAsync: jest.fn().mockImplementationOnce(async () => ({ date: new Date('2024-08-19T12:00:00Z') }))
                    .mockImplementationOnce(async () => ({ date: new Date('2024-08-19T12:01:00Z') }))
                    .mockImplementationOnce(async () => null),
            },
            {
                popAsync: jest.fn().mockImplementationOnce(async () => ({ date: new Date('2024-08-19T12:00:30Z') }))
                    .mockImplementationOnce(async () => ({ date: new Date('2024-08-19T12:01:30Z') }))
                    .mockImplementationOnce(async () => null),
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
                popAsync: jest.fn().mockResolvedValue(null),
            },
        ];

        await heapMerge(logSources, printer);

        expect(printer.print).not.toHaveBeenCalled();
    });

    test('should call printer.done when finished', async () => {
        await heapMerge(logSources, printer);

        expect(printer.done).toHaveBeenCalled();
    });

    test('should handle asynchronous logs correctly', async () => {
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        logSources = [
            {
                popAsync: jest.fn()
                    .mockImplementationOnce(async () => { await delay(10); return { date: new Date('2024-08-19T12:00:00Z') }; })
                    .mockImplementationOnce(async () => { await delay(20); return { date: new Date('2024-08-19T12:01:00Z') }; })
                    .mockImplementationOnce(async () => null),
            },
            {
                popAsync: jest.fn()
                    .mockImplementationOnce(async () => { await delay(5); return { date: new Date('2024-08-19T12:00:30Z') }; })
                    .mockImplementationOnce(async () => { await delay(15); return { date: new Date('2024-08-19T12:01:30Z') }; })
                    .mockImplementationOnce(async () => null),
            },
        ];

        await heapMerge(logSources, printer);

        expect(printer.print).toHaveBeenCalledTimes(4);
        expect(printer.print.mock.calls[0][0].date).toEqual(new Date('2024-08-19T12:00:00Z'));
        expect(printer.print.mock.calls[1][0].date).toEqual(new Date('2024-08-19T12:00:30Z'));
        expect(printer.print.mock.calls[2][0].date).toEqual(new Date('2024-08-19T12:01:00Z'));
        expect(printer.print.mock.calls[3][0].date).toEqual(new Date('2024-08-19T12:01:30Z'));
    });
});