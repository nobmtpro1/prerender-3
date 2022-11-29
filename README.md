## SUNDORA

### HOW TO RUN

#### REQUIREMENT

```
 - node > 12.1
 - yarn > 1.2

```

#### STEP 1

```
    git clone https://gitlab.23c.se/sundora/sundora.git

    yarn install
```

##### STEP 2

```
    CHOOSE HOW TO OPEN
    - yarn start
    - Open http://localhost:3000 to view it in the browser.
```

### MORE

```
- settings.json need the following lines among the rest of your preferences:
.vscode/settings.json

// set the default formatter for VSC
"editor.defaultFormatter": "esbenp.prettier-vscode",

// run ESLint on save
"editor.codeActionsOnSave": {
"source.fixAll.eslint": true
},

// format the code on save
"editor.formatOnSave": true,
// ...
```

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## LEARN MORE

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
