Let's discuss one of the core use-cases for `repost` -- microservice testing.

To be more specific, assume we have a variety of services -- dozens of 'em -- and they all have different hostnames, different authentication, etc.

Also, all of these services are running in a variety of environments -- they might be running locally, or in a Dockerized environment, or in staging, etc.

For this scenario, assume we care about three microservices (svc-A, svc-B, and svc-C), and two environments: "local" and "staging".

So, we have this matrix of "test suites":

```
          local         staging
  svc-A    svc-A-local    svc-A-staging
  svc-B    svc-B-local    svc-B-staging
  svc-C    svc-C-local    svc-C-staging
```

Our goal is to be able to concisely execute any of those test suites with a single command.

Of course, if we write a test request for svc-A, we want to be able to use that same request for svc-A-local testing as well as us-A-staging testing.

Let's see how we can accomplish this with `repost`.

First, we want to create collections to house our requests. In this case, we want one collection per service.

While we could put all those collections in a single place, it often makes sense to put each service's collection "into the service", e.g. by putting it in the service's Git repository. This way, all the service's developers can collaborate on a shared corpus of test requests.

For this scenario, we'll pretend to "check out" services by simply creating empty directories:

```bash
# In real life, these would be "git clone" commands
git init svc-A
git init svc-B
git init svc-C
```

Then, we can create a `requests` folder in each Git repository to hold our Repost collections.

Because Repost uses a hidden `.repost-collection` indicator file to detect collections, it also provides a `repost create collection` command that should be used to create collections:

```bash
repost create collection svc-A/requests
repost create collection svc-B/requests
repost create collection svc-C/requests
```

That gives us the following file structure:

```
svc-A/
  requests/
    .repost-collection
svc-B/
  requests/
    .repost-collection
svc-C/
  requests/
    .repost-collection
```

Next, we want to create our environments. The services are too different to share environments between them, so we'll create a `local` and `staging` environment for each service:

```bash
repost create env svc-A/requests/local
repost create env svc-A/requests/staging
repost create env svc-B/requests/local
repost create env svc-B/requests/staging
repost create env svc-C/requests/local
repost create env svc-C/requests/staging
```

This is getting a bit repetitive because of how many services we're trying to build out at once, but normally you won't have to create this many environments at the same time -- you can incrementally create and define environments as you develop new services.

Our new file structure is:

```
svc-A/
  requests/
    .repost-collection
    local.env.json
    staging.env.json
svc-B/
  requests/
    .repost-collection
    local.env.json
    staging.env.json
svc-C/
  requests/
    .repost-collection
    local.env.json
    staging.env.json
```

Next, we can start to configure the environments and create requests. For brevity, let's focus on working with a single service.
