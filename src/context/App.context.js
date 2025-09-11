// Import the React library, which is necessary to create components, contexts, etc.
import React from 'react';

// Define a constant object `app` that holds global application configuration or metadata.
// In this case, it only contains a `title` key with the name of the application.
export const app = {
  title: 'Transparent Path spc', // Application title, can be used throughout the app (e.g., in the header or document title).
};

// Create a React Context named `AppContext` with a default value of the `app` object.
// React Context allows passing data deeply through the component tree without having to manually pass props at every level.
// This is useful for global app data such as user information, themes, or app configuration.
export const AppContext = React.createContext(app);

// The `AppContext` can now be used in the component tree by wrapping components in a `Provider`
// and accessing context values with `useContext(AppContext)` in child components.
