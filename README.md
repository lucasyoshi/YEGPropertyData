# DMIT 2015 - Course Project

## Tech Stack

- **Frontend:** React with Tailwind CSS
- **Backend:** Express JS with Node
- **Database:** Microsoft SQL Server

## Creating the project

1. Create the root folder of your project
2. Initialize Express.js Project:
    - Create a new directory for your project and navigate into it.
    - Run `npm init -y` to initialize a new Node.js project.
    - Run `npx express-generator project_name` to create a base project.
    - Navigate to your Express JS folder using `cd api` and install dependencies using `npm install`
    - Run `npm start` to start the project at http://localhost:3000
    - Install other dependencies such as: `npm install express mssql cors body-parser jsonwebtoken`
3. Create a React app with Typescript
   1. Create the react app using npx `npx create-react-app app`
   2. Navigate your React folder `cd app`
   3. Run `npm install -D tailwindcss` and `npx tailwindcss init` to install the tailwind.config.js
   4. Configure Tailwind CSS with your React app
      1. In your `tailwind.config.js` file, ensure the purge array points to any files that may use Tailwind classes.
      2. In your `src/index.css` file, import Tailwind's `base`, `components`, and `utilities` styles by adding the following lines at the top of your CSS file:
         ```css
         @import 'tailwindcss/base';
         @import 'tailwindcss/components';
         @import 'tailwindcss/utilities';
         ```
      3. Run `npx tailwindcss build src/index.css -o src/tailwind.css` to build your CSS.
      4. In your `src/index.js` file, replace the `index.css` import with `tailwind.css`.
   5. Start your React app
      1. Run `npm start` to start the React app. Your app will be available at http://localhost:3000.

## Backend setup

Most of the setup is done in the `app.js` in the root folder and the API endpoints are located under the folder `routes`.

### Setting up JWT Authentication

To set up JWT (JSON Web Tokens) in Express.js, we use the `jsonwebtoken` package. This package allows us to sign tokens to authenticated users and verify those tokens on subsequent requests.

1. Install the package with `npm install jsonwebtoken`.
2. In your authentication route, sign a token to the user upon successful login:
   ```javascript
   const jwt = require('jsonwebtoken');
   const token = jwt.sign({ id: user.id }, 'yourSecretKey', { expiresIn: '1h' });
   ```
3. In your middleware, verify the token on incoming requests:
    ```javascript
    const jwt = require('jsonwebtoken');
    const token = req.headers['authorization'];
    jwt.verify(token, 'yourSecretKey', (err, user) => {
        if (err) return res.sendStatus(403);
            req.user = user;
            next();
    });
    ```

### Login

There is an endpoint for user login at `/login/enter`. This endpoint accepts POST requests with a JSON body containing `username` and `password` fields. Upon successful authentication, it returns a JWT token which should be used for authenticated requests to other endpoints.

### Logging Out or Revoking a JWT Token

To log out or revoke a JWT token, you can delete the JWT from wherever you're storing it (e.g., in memory, local storage, etc.). Note that this doesn't actually invalidate the JWT. To invalidate the JWT, you would need to implement a token blacklist on the server and check it in the `verifyToken` function.

### Setting up MSSQL in Express JS

To set up MSSQL (Microsoft SQL Server) in Express.js, we use the mssql package. This package allows us to connect to a MSSQL database and execute queries.

1. Install the package with npm install mssql.
2. Set up a connection to your database:
    ```javascript
   const sql = require('mssql');
    const config = {
        user: 'username',
        password: 'password',
        server: 'localhost',
        database: 'mydatabase',
    };
    sql.connect(config, err => {
        if (err) console.log(err);
    });
    ```

### CRUD Operations

CRUD operations (Create, Read, Update, Delete) are done through API endpoints on the `properties.js` resource. These endpoints are:


#### GET /query

This endpoint accepts the following query parameters: `houseNumber`, `streetName`, and `suite`. It returns the first record from the `lhashimoto2EdmontonPropertyAssessmentData` table that matches the provided parameters.

#### GET /assessedValue

This endpoint accepts the following query parameters: `neighbourhood`, `minValue`, and `maxValue`. It returns all records from the `lhashimoto2EdmontonPropertyAssessmentData` table where the `neighbourhood` matches the provided value and the `assessedValue` is between `minValue` and `maxValue`.

#### GET /allRecords

This endpoint requires a JWT token for authentication. It returns the top 100 records from the `lhashimoto2EdmontonPropertyAssessmentData` table, ordered by `accountNumber` in descending order.

#### POST /addProperty

This endpoint requires a JWT token for authentication. It accepts a JSON body with the details of the property to be added to the `lhashimoto2EdmontonPropertyAssessmentData` table.

#### DELETE /deleteProperty/:id

This endpoint requires a JWT token for authentication. It deletes the record with the provided `id` from the `lhashimoto2EdmontonPropertyAssessmentData` table.

#### PUT /updateProperty/:id

This endpoint requires a JWT token for authentication. It accepts a JSON body with the updated details of the property and updates the record with the provided `id` in the `lhashimoto2EdmontonPropertyAssessmentData` table.

## Frontend Setup

The frontend of the application is built using React, Tailwind CSS and uses React Router for routing. The layout of the frontend is as follows:

1. **Login Page (`/login`)**: This is the entry point of the application. Users are required to authenticate themselves here. Upon successful login, users are redirected to the Single Query page. The user information is stored locally so the application can verify if the user is allowed to navigate in the application.

2. **Single Query Page (`/query`)**: This page allows users to perform a single query by entering `houseNumber`, `streetName`, and `suite`. The results are displayed on the same page.

3. **List Query Page (`/query-list`)**: This page allows users to perform a list query by entering `neighbourhood`, `minValue`, and `maxValue`. The results are displayed in a list format on the same page.

4. **Single Page CRUD (`/properties`)**: This page displays a secure page operation where only authorized users can execute CRUD operations to the database

The routes are defined in a `Router` component in the `AppRoutes.js` file. Each route is associated with a component that renders the respective page.

Remember to protect the routes that require authentication by checking if the user is authenticated before rendering the component. If the user is not authenticated, redirect them to the Login page.

### Fetching data and performing CRUD operations

Fetching specific property data from a REST API involves sending a HTTP GET request to the API endpoint with query parameters. Here's an example of how to fetch specific property data:

```javascript
export async function getPropertyData(houseNumber, streetName, suite) {
  const URL = `${API_URL}/properties/query?houseNumber=${houseNumber}&streetName=${streetName}&suite=${suite}`;
  const response = await fetch(URL);
  const data = await response.json();
  return data;
}
```
In this example, `houseNumber, streetName, and suite`  are passed as query parameters to the API endpoint. Then you call the methods created in a separate file e.g. `\repository\propertyData.js` in your component to perform the desired action. 

### Posting Property Data to a REST API

Posting property data to a REST API involves sending a HTTP POST request to the API endpoint with a body containing the data to be posted. Here's an example of how to post property data:
```javascript
export async function addProperty(token, formData) {
  const URL = `${API_URL}/properties/addProperty`;
  const response = await fetch(URL, {
    method: "POST",
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  });
  const data = await response.json();
  return data;
}
```

### Using API Functions in Your Components

Once you've defined your API functions, you can use them in your components to fetch data. Here's an example of how to use the `getPropertyData` function in a React component:

```javascript
import React, { useEffect, useState } from 'react';
import { getPropertyData } from './repository/propertyData';

function PropertyComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getPropertyData('10205', '120 Street NW', '3202').then(data => setData(data));
  }, []);

  // render the data
}
```

In this example, the `useState` and `useEffect` hooks from React are used to fetch the data when the component is mounted and store it in the component's state. The `getPropertyData` function is called with the house number, street name, and suite as arguments. The returned promise is then resolved and the data is stored in the state using the `setData` function.

```javascript
import { addProperty } from './api';

async function addNewProperty() {
  const token = 'your_jwt_token'; // replace with your actual JWT token
  const formData = {
    suite: '3202',
    houseNumber: '10205',
    streetName: '120 Street NW',
    garage: true,
    neighbourhoodId: 1,
    neighbourhood: 'Oliver',
    ward: 'Ward 6',
    assessedValue: 150000,
    latitude: 53.5461,
    longitude: -113.4938,
    assessmentClass1: 'Residential'
  };

  try {
    const data = await addProperty(token, formData);
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}

addNewProperty();
```
In this example, `addNewProperty` is an async function that calls addProperty with a JWT token and a formData object. The formData object contains the data to be posted. The `addProperty` function returns a promise that resolves to the data returned by the API. If the promise is rejected, the catch block will log the error. You can call this method inside a function that handles the submit event in a form, instead of calling in somewhere else.

