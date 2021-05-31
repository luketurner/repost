return {
    // Async hooks work!
    preparse: async (run, execution) => {
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                run.env.root_url = 'https://github.com';
                resolve();
            }, 1);
        });
    }
}