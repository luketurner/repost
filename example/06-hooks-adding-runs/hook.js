return {
    // Async hooks work!
    preparse: async (run, execution) => {
        run.env.root_url = 'https://github.com';
        if (execution.runs.length === 1) {
            addRun(execution, {
                request: 'added-request.http',
                env: {
                    root_url: 'https://github.com'
                }
            })
        }
    }
}