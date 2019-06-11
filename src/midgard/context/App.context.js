import React from "react"

//entryPointForGulpStart
export const app = {
  appTitle: "My App",
  modules: [{"id":"products","title":"Products"},{"id":"blueprint","title":"Blueprint"}]
};
//entryPointForGulpEnd

export const AppContext = React.createContext(app);
