import { create } from 'zustand'
import AgregarClienteType from '../Types/AgregarClienteType';
import TokenClienteType from '../Types/TokenClienteType';

type AgregarClienteStore = {
  clientesAsignados: AgregarClienteType[] | null,
  loading: boolean,
  exito: boolean,
  error: boolean,
  mensaje: string,
  token: TokenClienteType | null
  setAgregarCliente: (rfc: string) => void,
  postGenerarToken: (idCliente: string, email: string) => void,
  postValidarToken: (idEmailToken: string, token: string, idCliente: string, email: string) => void,
  postLigarCliente: (idCliente: string, email: string, esPropietario: string) => void,
  limpiarStore: () => void,
}

const useAgregarClienteStore = create<AgregarClienteStore>()((set,get) => ({
  clientesAsignados: null,
  loading: false,
  exito: false,
  error: false,
  mensaje: '',
  token: null,
  setAgregarCliente: async (rfc: string) => {
    set(({error: false}))
    try {
      const response = await fetch('https://integraciones.cadeco.com.mx/vtex/api/usuario/clientes-por-rfc', {
        method: 'get',
        headers: {
          rfc
        }
      })
      set({clientesAsignados: await response.json()})
    } catch (error) {
      set({error: true, clientesAsignados: null})
    }
  },
  postGenerarToken: async (idCliente: string, email: string) => {
    set(({loading: true, error: false}))
    try {
      const response = await fetch('https://integraciones.cadeco.com.mx/vtex/api/usuario/generar-token', {
        method: 'post',
        headers: {
          email,
          idCliente
        }
      })
      set({token: await response.json(), loading: false})
    } catch (error) {
      set({loading: false, error: true})
    }
  },
  postValidarToken: async (idEmailToken: string, token: string, idCliente: string, email: string) => {
    set(({loading: true, error: false}))
    try {
      const response = await fetch('https://integraciones.cadeco.com.mx/vtex/api/usuario/validar-email-token', {
        method: 'post',
        headers: {
          idEmailToken,
          token
        }
      })
      const data = await response.json()
      if (data.descripcion == 'El código se ha validado correctamente.')
        get().postLigarCliente(idCliente, email, 'false')
      else
        set({loading: false, error: true})
    } catch (err) {
      set({loading: false, error: true})
    }
  },
  postLigarCliente: async (idCliente: string, email: string, esPropietario: string) => {
    set(({loading: true, error: false}))
    try {
      const response = await fetch('https://integraciones.cadeco.com.mx/vtex/api/usuario/cliente-asignado', {
        method: 'post',
        headers: {
          idCliente,
          email,
          esPropietario
        }
      })
      const data = await response.json()
      console.log(data)
      set({exito: true, loading: false, error: false})
    } catch (error) {
      set({exito: true, loading: false, error: true})
    }
  },
  limpiarStore: () => {
    set({exito: false, loading: false, error: false, mensaje: '', token: null, clientesAsignados: null})
  },
}))

export default useAgregarClienteStore
