return {
    preparse: (run, execution) => {

        // Hooks can access properties on the Execution, including global logger
        execution.console.log(`In hook for ${run.name}!`);

        // Hooks can mutate environments
        run.env.root_url = 'https://github.com';
    }
}