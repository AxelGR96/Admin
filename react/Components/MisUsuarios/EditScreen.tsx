import React, { useState } from 'react';
import { Table, Checkbox,Button} from 'vtex.styleguide';

type BackScreen = {
  editBack: () => void;
  saveEdit: () => void;
}

const EditScreen: React.FC<BackScreen> = ({editBack,saveEdit}) => {
  //Creo el estado de mis columnas, ya que iran cambiando constantemente
  const [items, setItems] = useState([
    { name: 'Cotizador', checked: false },
    { name: 'Mis Facturas', checked: false },
    { name: 'Mis notas de Credito', checked: false },
    { name: 'Mi Credito', checked: false },
    { name: 'Mis cotizaciones', checked: false },
    { name: 'Complementos de Pago', checked: false },
    { name: 'Complementos de Pago', checked: false },
  ]);

  //Creo el estado en caso de que todos los checks sean seleccionados
  const [allChecked, setAllChecked] = useState(false); 

  //Metodo donde controlo cuando son seleccionados los checks
  const handleSelectAllChange = () => {
    const newCheckedState = !allChecked;
    const updatedItems = items.map(item => ({ ...item, checked: newCheckedState }));
    setItems(updatedItems);
    setAllChecked(newCheckedState);
  };

  //JSOn de las columnas de la tabla donde dibujo aqui mismo los checkbos
  const jsonschema = {
    properties: {
      checkbox: {
        title: 
        <Checkbox
        checked={allChecked}
        onChange={handleSelectAllChange}
      />,
        width: 50,
        cellRenderer: ({ rowData }: { rowData: any }) => (
          <Checkbox
            checked={rowData.checked}
            onChange={() => handleCheckboxChange(rowData)}
          />
        ),
      },
      name: {
        title: 'Name',
        width: 670,
      },
    },
  };

  //Metodo donde controlo cuando es elegido cada checkbox
  const handleCheckboxChange = (rowData: any) => {
    //Condicional donde verifico los de la tabla y los recibidos y verifico si ha cambiado el checkbox con negación
    const updatedItems = items.map(item =>
      item.name === rowData.name ? {...item, checked: !item.checked } : item
    );
    setItems(updatedItems);
    setAllChecked(updatedItems.every(item => item.checked));
  };


  return (
    <div className="flex flex-row">
      <div className="flex flex-column w-80">
        <div>
          <span className="f4">Agregar Roles</span>
        </div>
        <div className="mt5">
          <Table
            fullWidth
            schema={jsonschema}
            items={items}
            emptyStateLabel="Sin Roles"
          />
        </div>

        <div>
          <div className='flex flex-row justify-end mt5'>
            
            <div className='mr7'>
              <Button variation="secondary" onClick={editBack}>
              Cancelar
              </Button>
            </div>

            <div>
              <Button variation="primary" onClick={saveEdit}>
              Guardar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditScreen;
