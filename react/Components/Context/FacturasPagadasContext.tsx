import { create } from 'zustand'
import FacturaPagadaType from '../Types/FacturaPagadaType'

type FacturaPagadaStore = {
  facturasPagadas: FacturaPagadaType[] | null,
  loading: boolean,
  error: boolean,
  setFacturasPagadas: (email: string, fechaInicio: string, fechaFin: string) => void,
  zipFacturasPagadas: (body: string) => void,
  setFacturaPagadasVtex: (facturas: FacturaPagadaType[] | null) => void
  setLoading: (isLoading: boolean) => void
  setError: (isError: boolean) => void
}

const useFacturaPagadaStore = create<FacturaPagadaStore>()((set) => ({
  facturasPagadas: null,
  loading: false,
  error: false,
  setFacturasPagadas: async (email: string, fechaInicio: string, fechaFin: string) => {
    set(({loading: true, error: false}))
    try {
      const response = await fetch('https://integraciones.cadeco.com.mx/vtex/api/usuario/facturas/pagadas', {
        method: 'get',
        headers: {
          email,
          fechaInicio,
          fechaFin
        }
      })
      set({facturasPagadas: await response.json(), loading: false})
    } catch (error) {
      set({loading: false, error: true})
    }
  },
  zipFacturasPagadas: async (body: string) => {
    set(({loading: true, error: false}))
    try {
      const response = await fetch('https://integraciones.cadeco.com.mx/vtex/api/usuario/facturas/pagadas/zip', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body
      })
      set({loading: false})
      const a = document.createElement("a")
      a.href = window.URL.createObjectURL(await response.blob())
      a.download = 'FacturasPagadas.zip'
      a.click()
      a.remove()
    } catch (error) {
      set({loading: false, error: true})
    }
  },
  setFacturaPagadasVtex: (facturas: FacturaPagadaType[] | null) => {
    set(({facturasPagadas: facturas, loading: false, error: false}))
  },
  setLoading: (isLoading: boolean) => {
    set(({loading: isLoading}))
  },
  setError: (isError: boolean) => {
    set(({error: isError}))
  },
}))

export default useFacturaPagadaStore
