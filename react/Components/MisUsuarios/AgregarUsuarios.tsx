import React, { FC,useEffect } from 'react'
import { Table  } from 'vtex.styleguide'
import { useState } from 'react'
import NuevoUsuario from './NuevoUsuario'
import EditScreen from './EditScreen'
import DeleteScreen from './DeleteScreen'
import getDocument from '../../graphql/getDocument.graphql'
import { useLazyQuery } from 'react-apollo'
import useUsuariosStore from '../Context/UsuariosContext'

type AgregarUsuariosProps ={
  userData: any
}

const AgregarUsuarios: FC<AgregarUsuariosProps> = ({userData}) => {
  const condition  = 'ClienteCadeco='+ userData.idCliente.toString();
    
    //Creo la variable que me contiene lo de mi Usuario Context
    const UsuariosStore = useUsuariosStore()
    //Estado para la pantalla de Nuevo Usuario
    const [newUserScreen, setNewUserScreen] = useState(0)

    //Estado para la pantalla de editar usuario
    const [edit,setEdit] = useState(0)

    //Estado para la pantalla de eliminar usuario
    const [deleteuser, setDeleteUser] = useState(0)

    const [userToDelete,setUserToDelete] = useState<any>(null)

    const [getData, { loading, error, data }] = useLazyQuery(getDocument);

    //const [listItems, setListITems] = useState([]);


    //JSON donde defino las columnas con sus propiedades para la tabla de Usuarios
    const jsonschema = {
        properties: {
            name:{
                title: 'Name',
                width: 350
            },
            email:{
                title: 'Email',
                width: 350
            },
            mfa: {
                title: 'MFA',
                width: 120
            },
            
        },
    }
     // items de prueba , le asigno RowData de tipo Array para vincularlo con los campos
    const items: RowData[] = [
        { id: 1, name: 'Juan Pérez', email: 'juan@example.com', mfa: 'Enabled' },
        { id: 2, name: 'María García', email: 'maria@example.com', mfa: 'Disabled' },
        { id: 3, name: 'Carlos López', email: 'carlos@example.com', mfa: 'Enabled' },
        { id: 4, name: 'Hernan García', email: 'hernan@example.com', mfa: 'Enabled' },
        { id: 5, name: 'Ramiro Silva', email: 'ramiro@example.com', mfa: 'Enabled' },
        { id: 6, name: 'Romero Garza', email: 'romero@example.com', mfa: 'Enabled' },
        { id: 7, name: 'Gonzalo Sora', email: 'gonzalo@example.com', mfa: 'Enabled' }
    ];

   
    //Degino rowData con los campos de las columnas
    type RowData = {
        id: number;
        name: string;
        email: string;
        mfa: string;
    };

    useEffect(() => {
      
      console.log("condition: ",condition)
      //Ejecuto el query
      getData({
          variables: {
            acronym: "CL",
            fields: ["firstName","lastName","email"],
            account: "cadecomx",
            schema: "v1",
            customer: "ClienteCadeco=175236"
          },
        })
    }, [])
/*
 const newUser = { name: 'John Doe', email: 'john.doe@example.com' };
    setUsers([...users, newUser]);
 */
//const newItems = {name: '',lastname: '',email: ''}

    useEffect(() => {
      console.log("segundo useEffect");
      console.log(loading)
      console.log("data",data);
      console.log("error",error);
      if(data){
        console.log("Data no esta vacio")
        //console.log(listItems);
      }
      if(!data){
        console.log("Mi data se envia vacio...");
        
      }

      if(error){
        console.log("Hubo un error")
      }
    }, [data])
    
    const tableData = items;

    //Defino el estado de mi variable que va ser el buscador de mi tabla
    const [searchTable, setSearchTable] = useState('')

    const [infoTabla, setInfoTabla] = useState({
        tableLength: 5,
        currentPage: 1,
        slicedData: tableData.slice(0, 5),
        currentItemFrom: 1,
        currentItemTo: 5,
        itemsLength: tableData.length,
      })
    
    //Defino las acciones que deseo para cada columna, asignandole el RowData
    const lineActions = [ 
        {
          label: () => 'Editar',
          onClick: ({ rowData }: { rowData: RowData }) => editUser(rowData),
        },
        {
          label: () => 'Eliminar',
          isDangerous: true,
          onClick: ({ rowData }: { rowData: RowData }) => deleteUser(rowData),
        },
      ]

    //Metodo para editar el usuario
    const editUser = (item: any) => {
      console.log("Edit User: ",item);
      setEdit(1)
    }

    //Metodo para eliminar el usuario
    const deleteUser = (item: any) => {
        console.log("Delete User: ", item);
        setUserToDelete(item)
        console.log(userToDelete)
        console.log(deleteuser)
        setDeleteUser(1)
    }

    //Funcion donde se hace el proceos al escribir en el search
    const SearchTableInput = (e: any) => {
      const value = e && e.target && e.target.value
      const regex = new RegExp(value, 'i')
      console.log(value)
      console.log(regex)
      if(!!value) {
        const searchData = value ? tableData.filter(data => regex.test(data.name) || regex.test(data.email) || regex.test(data.mfa))
        : tableData;
          setInfoTabla({
            tableLength: 5,
            currentPage: 1,
            slicedData: searchData.slice(0, 5),
            currentItemFrom: 1,
            currentItemTo: 5,
            itemsLength: searchData.length,
          })
      } else{
        setInfoTabla({
          tableLength: 5,
          currentPage: 1,
          slicedData: tableData.slice(0,5),
          currentItemFrom:1,
          currentItemTo: 5,
          itemsLength: tableData.length
        })
      }          
  }

    //Controlo el valor de campo de entrada del input Search de mi tabla
    const onChangeSearchTable = (e: any) => {
        console.log("OnChangeSearchTable");
        setSearchTable(e.target.value)
    }

    //Al darle la tachita en el input del search me lo resetea
    const onClearSearchInput = (_: any) => {
      setSearchTable('')
      setInfoTabla({
        tableLength: 5,
        currentPage: 1,
        slicedData: tableData.slice(0, 5),
        currentItemFrom: 1,
        currentItemTo: 5,
        itemsLength: tableData.length,
      })
    }

    // Función para la logica de agregar un nuevo usuario
    const handleNuevoUsuario = () => {
        console.log('Agregar nuevo usuarioo');
        setNewUserScreen(1)
    };

    //Me regresa a la pantalla de mis usuarios
    const backToUsers = () => {
      console.log("Regresandoooooooo....");
      setNewUserScreen(0)
    }

    //Funcionalidad de paginacion de siguiente de Table
    const onNextPage = () => {
        const newPage = infoTabla.currentPage + 1;
        const itemFrom = infoTabla.currentItemTo + 1;
        const itemTo = infoTabla.tableLength * newPage;
        const data = items.slice(itemFrom - 1, itemTo);
        goToPage(infoTabla.tableLength, newPage, itemFrom, itemTo, data);
    }

    //Funcionalidad de paginación de anterior de Table
    const onPrevPage = () => {
        if (infoTabla.currentPage === 1) return;
        const newPage = infoTabla.currentPage - 1;
        const itemFrom = infoTabla.currentItemFrom - infoTabla.tableLength;
        const itemTo = infoTabla.currentItemFrom - 1;
        const data = items.slice(itemFrom - 1, itemTo);
        goToPage(infoTabla.tableLength, newPage, itemFrom, itemTo, data);
    }
    
    const onRowsChange = (_ : any, value: any) => {
        const tableLength = +value;
        setInfoTabla({
            tableLength,
            currentPage: 1,
            currentItemFrom: 1,
            currentItemTo: tableLength,
            itemsLength: items.length,
            slicedData: items.slice(0, tableLength)
        });
    }

    const goToPage = (tableLength: any, currentPage: any, currentItemFrom: any, currentItemTo: any, slicedData: any) => {
        setInfoTabla({
            tableLength,
            currentPage,
            currentItemFrom,
            currentItemTo,
            itemsLength: items.length,
            slicedData,
        });
    }

    const editCancel = () => {
      console.log("EditCancel");
      setEdit(0)
    }

    const saveEdit = () => {
      console.log("SaveEdit");
      setEdit(0)
    }

    //Metodo del boton No de la pantalla Eliminar Usuario
    const cancelDelete = () => {
      setDeleteUser(0)
    }

    //Metodo del boton Si de la pantalla Eliminar Usuario
    const userDelete = () => {
      console.log("click en si",userToDelete)
      const response = UsuariosStore.setDeleteUserVtex(userToDelete.id,userToDelete.email)
      response.then((result: any) => {
        if(result.status === 200){
          console.log("Exito");
        }
        else{
          console.log("Error al eliminar usuario")
        }
        
      })
      setDeleteUser(0)
    }

  return (
    <div className="flex flex-row items-start ma4 pa4">
    <div className="flex flex-column w-90">

      {newUserScreen == 0 && edit == 0 && deleteuser == 0 && <Table
            fullWidth
            schema={jsonschema}
            items={infoTabla.slicedData}
            lineActions={lineActions}
            emptyStateLabel={'Sin datos...'}
            toolbar={{
                inputSearch: {
                    value: searchTable,
                    placeholder: 'Buscar Usuarios...',
                    onChange: onChangeSearchTable,
                    onSubmit: SearchTableInput,
                    onClear: onClearSearchInput
                },
                newLine: {
                    label: 'Nuevo Usuario',
                    handleCallback: handleNuevoUsuario
                  },
            }}
            pagination={{
              onNextClick: onNextPage,
              onPrevClick: onPrevPage,
              currentItemFrom: infoTabla.currentItemFrom,
              currentItemTo: infoTabla.currentItemTo,
              onRowsChange: onRowsChange,
              textShowRows: 'Filas',
              textOf: 'de',
              totalItems: infoTabla.itemsLength,
              rowsOptions: [5, 10, 15, 25],
          }}
        />}

       {newUserScreen == 1 && <NuevoUsuario userData={userData} screenUser={backToUsers} />} 
       {edit == 1 && <EditScreen editBack={editCancel} saveEdit={saveEdit} />}
       {deleteuser == 1 && <DeleteScreen user={userToDelete}  onDelete={userDelete} onCancel={cancelDelete} />}
    </div>
</div>
     )
}
export default AgregarUsuarios
