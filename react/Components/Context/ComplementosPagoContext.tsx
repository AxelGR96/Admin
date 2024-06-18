import { create } from 'zustand'
import ComplementoPagoType from '../Types/ComplementoPagoType'

type ComplementoPagoStore = {
  complementosPago: ComplementoPagoType[] | null,
  loading: boolean,
  error: boolean,
  //setComplementosPago: (email: string, fechaInicio: string, fechaFin: string) => void,
  zipComplementosPago: (body: string) => void,
  setComplementosPagoVtex: (complementos: ComplementoPagoType[] | null) => void
  setLoading: (isLoading: boolean) => void
  setError: (isError: boolean) => void
}

const useComplementoPagoStore = create<ComplementoPagoStore>()((set) => ({
  complementosPago: null,
  loading: false,
  error: false,
  setComplementosPagoVtex: (complementos: ComplementoPagoType[] | null) => {
    set({ complementosPago: complementos, loading: false, error: false})
  },
  setLoading: (isLoading: boolean) => {
    set({loading: isLoading})
  },
  setError: (isError: boolean) => {
    set({error: isError})
  },
  zipComplementosPago: async (body: string) => {
    set(({loading: true, error: false}))
    try {
      const response = await fetch('https://integraciones.cadeco.com.mx/vtex/api/usuario/comprobantes-pago/descarga/arrayb64', {
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
}))

export default useComplementoPagoStore
