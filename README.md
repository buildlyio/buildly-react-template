+++
title = "Midgard-React"
+++

# Midgard-React

## Summary

Midgard-React is a [React](https://reactjs.org/) web app that implements the core features of [Midgard](https://docs.walhall.io/walhall/midgard).

Midgard-React is your **app root repository.** When you create a [Walhall app](https://docs.walhall.io/walhall), Walhall forks Midgard-React to your GitHub account and gives it the same name as your app. It comes pre-configured to communicate with your app's API via [BiFrost](https://docs.walhall.io/walhall/bifrost). This is where you develop your Walhall app.

Current React version: **vX.X.X.**

## Setup

### Initialize the app

[Instructions]

### Build app

[Instructions]

### Run development server

[Instructions]

### Run tests

[Instructions]

## Features

### File tree

- `/directory`: Description
- `/directory`: Description
- `/directory`: Description

### Core interfaces

Midgard-React provides the following core user interfaces:

- **Login screen:** Uses the OAuth library from midgard-core for the OAuth password-flow authentication process with BiFrost.
- **Register screen:** A form where the user can register an account with the app. They will also be redirected to this screen after accepting an invitation from a super user.
- **User management:** A screen where an administrator can manage users, update their own profile, and handle permissions in the app.
- **Settings:** A screen for configuring app settings.

These can be found under `LOCATION`, and they have routes that are specified in `LOCATION`.

### Connection to BiFrost

[How does Midgard-React connect to BiFrost?]

### Store module

[What is this and how is it implemented?]

#### Reducers & Epics

[What is this and how is it implemented?]

### HttpService

[What is this and how is it implemented?]

### CRUD Module

[What is this and how is it implemented?]

### Translation module

[What is this and how is it implemented?]

### OAuth module

The OAuth module connects to the OAuth implementation in midgard-core and provides functionalities related to authentication, e.g., logging in using the password flow, logging out, retrieving and saving the access token.

[How is this implemented?]

## License

Copyright &#169;2019 Humanitec GmbH.

This code is released under the Humanitec Affero GPL. See the **LICENSE** file for details.
