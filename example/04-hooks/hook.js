return {
    preparse: (run, execution) => {
        execution.console.log(`In hook for ${run.name}!`);
        run.env.root_url = 'https://github.com';
    }
}