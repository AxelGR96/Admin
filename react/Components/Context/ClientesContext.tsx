import { create } from 'zustand'
import ClienteType from '../Types/ClienteType';


type ClienteStore = {
  clientes: ClienteType[] | null,
  loading: boolean,
  error: boolean,
  addCliente: boolean,
  openAddCliente: (addCliente: boolean) => void,
  setClientes: (email: string) => void,
  deleteCliente: (email: string, idCliente: string) => void,
  setMisClientesVtex: (cliente: ClienteType[] | null) => void
  setLoading: (isLoading: boolean) => void
  setError: (isError: boolean) => void
}

const useClientesStore = create<ClienteStore>()((set,get) => ({
  clientes: null,
  loading: false,
  error: false,
  addCliente: false,
  openAddCliente: (addCliente: boolean) => set({ addCliente: addCliente }),
  setClientes: async (email: string) => {
    set(({loading: true, error: false}))
    try {
      const response = await fetch('https://integraciones.cadeco.com.mx/vtex/api/usuario/clientes-asignados', {
        method: 'get',
        headers: {
          email
        }
      })
      set({clientes: await response.json(), loading: false})
    } catch (error) {
      set({loading: false, error: true})
    }
  },
  deleteCliente: async (email: string, idCliente: string) => {
    set(({loading: true, error: false}))
    try {
      const response = await fetch('https://integraciones.cadeco.com.mx/vtex/api/usuario/cliente-asignado', {
        method: 'delete',
        headers: {
          idCliente,
          email
        }
      })
      if(response.status == 200)
        get().setClientes(email)
    } catch (error) {
      set({loading: false, error: true})
    }
  },
  setMisClientesVtex: (clientes: ClienteType[] | null) => {
    set({ clientes: clientes, loading: false, error: false})
  },
  setLoading: (isLoading: boolean) => {
    set({loading: isLoading})
  },
  setError: (isError: boolean) => {
    set({error: isError})
  },
}))

export default useClientesStore
