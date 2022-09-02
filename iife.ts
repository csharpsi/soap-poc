export function run(main: (args: Set<string>) => Promise<void>): void {
    (async () => {
        try {
            const args = process.argv.slice(2);
            await main(new Set(args));
        } catch (error) {
            console.error(error);
            process.exit(1);
        }
    })();
}