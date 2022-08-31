export function run(main: () => Promise<void>): void {
    (async () => {
        try {
            await main();
        } catch (error) {
            console.error(error);
            process.exit(1);
        }
    })();
}