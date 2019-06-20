import React from "react"

//entryPointForGulpStart
export const app = {
  appTitle: "My App",
  modules: [{"id":"products","title":"Products"},{"id":"documents","title":"Documents"},{"id":"blueprint","title":"Blueprint"}]
};
//entryPointForGulpEnd

export const AppContext = React.createContext(app);
