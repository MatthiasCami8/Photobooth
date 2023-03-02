# DeepFake Photobooth Frontend

In this folder the frontend code for the DeepFake Photobooth is located.
The frontend was built using the React javascript framework and Firebase


# Development 

To run a local instance of the frontend you can run in the project directory:
### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.
# Deployment

To deploy the frontend to the live url (https://photobooth.gener8.ai) perform the following two steps in sequence:

1.
### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

2. Deploy the static react build to firebase

### `firebase deploy`
