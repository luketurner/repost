// Example of an environment that includes functions, not just data.
return {
    method: 'GET',
    root_url() {
        return "https://github.com"
    }
}