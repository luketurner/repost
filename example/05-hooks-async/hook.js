return {
    // Async hooks work!
    // (Note: sleep() is a utility function provided in global scope by Repost)
    preparse: async (run, execution) => {
        await sleep(1);
        run.env.root_url = 'https://github.com';
    }
}