     ```js
     <Crud createAction={action} deleteAction="DELETE_ACTION" itemDeleted={handleItemDeleted}>
        <CrudContext.Consumer>{ crud => (
           <button onClick={() => crud.deleteItem({name: 'andrew'})}/>``
          )}
        </CrudContext.Consumer>
      </Crud>```
