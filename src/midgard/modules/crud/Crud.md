 ```js
import React from 'react'
import Crud, { CrudContext } from './Crud';

 const handleItemDeleted = () => {
    console.log('the item has been deleted')
 }
 
 function CrudExample({children}) {
   return (
     <Crud deleteAction="DELETE_ACTION" itemDeleted={handleItemDeleted}>
         <CrudContext.Consumer>{ crud => (
            <button onClick={() => crud.deleteItem({name: 'user'})}/>``
           )}
         </CrudContext.Consumer>
     </Crud>
   );
 }
  ```
