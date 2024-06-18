import { create } from 'zustand'
import NotaCreditoType from '../Types/NotaCreditoType'

type NotaCreditoStore = {
  notasCredito: NotaCreditoType[] | null,
  loading: boolean,
  error: boolean,
  setNotasCredito: (email: string, fechaInicio: string, fechaFin: string) => void,
  zipNotasCredito: (body: string) => void,
  setNotasCreditoVtex: (notas: NotaCreditoType[] | null) => void
  setLoading: (isLoading: boolean) => void
  setError: (isError: boolean) => void
}

const useNotaCreditoStore = create<NotaCreditoStore>()((set) => ({
  notasCredito: null,
  loading: false,
  error: false,
  setNotasCredito: async (email: string, fechaInicio: string, fechaFin: string) => {
    set(({loading: true, error: false}))
    try {
      const response = await fetch('https://integraciones.cadeco.com.mx/vtex/api/usuario/notas-credito', {
        method: 'get',
        headers: {
          email,
          fechaInicio,
          fechaFin
        }
      })
      set({notasCredito: await response.json(), loading: false})
    } catch (error) {
      set({loading: false, error: true})
    }
  },
  zipNotasCredito: async (body: string) => {
    set(({loading: true, error: false}))
    try {
      const response = await fetch('https://integraciones.cadeco.com.mx/vtex/api/usuario/notas-credito/descarga/arrayb64', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body
      })
      set({loading: false})
      const resp = await response.json()
      const a = document.createElement('a')
      a.href = `data:application/zip;base64,${resp.arreglo}`
      a.download = resp.nombre
      a.click()
      a.remove()
    } catch (error) {
      set({loading: false, error: true})
    }
  },
  setNotasCreditoVtex: (notas: NotaCreditoType[] | null) => {
    set({ notasCredito: notas, loading: false, error: false})
  },
  setLoading: (isLoading: boolean) => {
    set({loading: isLoading})
  },
  setError: (isError: boolean) => {
    set({error: isError})
  },
}))

export default useNotaCreditoStore
