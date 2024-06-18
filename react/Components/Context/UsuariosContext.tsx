import { create } from 'zustand'
import ClienteType from '../Types/ClienteType'

type UsuariosStore = {
  clientes: ClienteType[] | null,
  correos: String[] | null,
  loading: boolean,
  error: boolean,
  setClientesVtex: (clientes: ClienteType[]) => void,
  setCorreosVtex: (correos: String[]) => void,
  setCreateUserVtex: (email: string, idCliente: number, esPropietario: boolean) =>  Promise<Response>,
  setDeleteUserVtex: (idCliente: number, email: string) => Promise<Response>,
  setLoading: (isLoading: boolean) => void,
  setError: (isError: boolean) => void
}

const useUsuariosStore = create<UsuariosStore>()((set) => ({
  clientes: null,
  correos: null,
  loading: false,
  error: false,
  setClientesVtex: (clientes: ClienteType[]) => {
    set({clientes: clientes, loading: false, error: false})
  },
  setCorreosVtex: (correos: String[]) => {
    set({correos: correos, loading: false, error: false})
  },
  setCreateUserVtex: async (email: string, idCliente: number, esPropietario: boolean) => {
    set({loading: false, error: false})

    try {
      const response = await fetch('https://integraciones.cadeco.com.mx/vtex/api/usuario/cliente-asignado',{
        method: 'post',
        headers: {
          'Content-Type': 'application/json', 
          'email': email.toString(),
          'idCliente': idCliente.toString(),
          'esPropietario': esPropietario.toString()
        }
    })
     if(response.status === 200){
      set({loading: false, error: false})
      return response
     }else{
      set({loading: false, error: false})
      return response
     }
    } catch (error) {
      set({loading: false, error: true})
      throw error 
    }

  },
  setDeleteUserVtex: async (idCliente: number, email: string) => {
    set({loading: false, error: false})

    try{
      const response = await fetch('https://integraciones.cadeco.com.mx/vtex/api/usuario/cliente-asignado',{
        method: 'delete',
        headers:{
          'Content-Type': 'application/json', 
          'idCliente': idCliente.toString(),
          'email': email.toString()
        }
      })
      if(response.status === 200){
        set({loading: false, error: false})
        return response
       }else{
        set({loading: false, error: false})
        return response
       }
    } catch(error){
      set({loading: false, error: true})
      throw error
    }

  },
  setLoading: (isLoading: boolean) => {
    set({loading: isLoading})
  },
  setError: (isError: boolean) => {
    set({error: isError})
  },
}))

export default useUsuariosStore