```js static
import React from 'react'
import Crud, { CrudContext } from './Crud';

const handleItemDeleted = () => {
  console.log('the item has been deleted')
}
 
function CrudExample() {
  return (
    <Crud deleteAction="DELETE_ACTION" itemDeleted={handleItemDeleted}>
      {crud => (
        <button onClick={() => crud.deleteItem({id: 2})}/>
      )}
    </Crud>
  );
}
```