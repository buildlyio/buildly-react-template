import React from "react"

//entryPointForGulpStart
export const app = {
  appTitle: "My App",
  modules: [{"id":"products","title":"Products","description":"Add products to inventory"},{"id":"documents","title":"Documents","description":"Organizing docs and images"},{"id":"blueprint","title":"Blueprint","description":"Example blue print model"}]
};
//entryPointForGulpEnd

export const AppContext = React.createContext(app);
