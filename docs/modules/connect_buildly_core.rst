.. _connect_buildly_core:

Connection to Buildly Core
==========================

Buildly React Template uses the Redux-Saga middleware library to handle interactions with
Buildly Core. A store configuration is defined in the `/src/redux` directory and
connected at the root level `index.js` file.

The `/src/redux` directory contains sub-directories for each entity. These contains the related
`.actions.js`, `.reducer.js` and `.sagas.js` files.

Actions are dispatched directly by components. Each client has a separate `.actions.js`
file which contains actions to create, read, update and delete.

Generator functions defined in the client's `.saga.js` file watch for actions to be
dispatched. When this happens, they call another function that uses the services
provided in `/src/modules`. These services are responsible for commnunicating
with the API. All sagas must be imported into the `index.js` file in this directory.

The `.reducer.js` files update the state with the responses from the server. All
reducers should be imported into the `index.js` file within this directory.
