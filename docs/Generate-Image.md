# Image generation

To generate an image and publish it to the default registry, it would be best to use the default GitHub Action.

Normally, the pipeline will trigger only for commits on the master branch, but it's possible to aggregate
values to the branch array in the GitHub action definition:

```yaml
    branches: [master, <add-branch-name-here>]
```

The name **must** correspond exactly to the name of the branch, and the build will be triggered every time there 
will be a commit. The image will the be published to the default registry, ready to be deployed.
