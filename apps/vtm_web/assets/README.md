# App Front End

This folder hosts the front end app.

The app is written in React using [Flow](https://flow.org/), a static type checker similar to Typescript but not
that invasive. There are currently plugins for Flow for JetBrains IDEs and Visual Studio Code.

To install dependencies, compile the app and run it, **yarn** will be necessary as there is no support for *npm*.
To start the client app, in this assets folder run these commands:

```bash
yarn install
yarn start
```

To run and develop the client app it is possible to point the proxy to the remote test environment located at:

https://test.bostonbynight-gdr.it

Although this is a way of developing the app without starting the back end locally, the default value for the
proxy in the `package.json` file will have to remain **http://localhost:4000**. Pull Request with another value will
not be accepted.

### GraphQL

The app communicate with the back end using GraphQL, but the client code is autogenerated by calling the back end.
The client development will not take GraphQL into consideration at all, this is back end development responsibility,
so Pull Request with manual modifications to generated file will not be taken into consideration and considered 
wrong.

### Images

For performance reasons, the only image extension allowed to be pushed to main will be **webp**. There are a good 
number of online tools that can convert from traditional image extensions to webp.
