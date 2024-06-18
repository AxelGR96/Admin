import { create } from 'zustand'
import FacturaSaldoType from '../Types/FacturaSaldoType'

type FacturaSaldoStore = {
  facturasSaldo: FacturaSaldoType[] | null,
  loading: boolean,
  error: boolean,
  setFacturasSaldo: (email: string, fechaInicio: string, fechaFin: string) => void,
  zipFacturasSaldo: (body: string) => void,
  setFacturaSaldoVtex: (facturas: FacturaSaldoType[] | null) => void
  setLoading: (isLoading: boolean) => void
  setError: (isError: boolean) => void
}

const useFacturaSaldoStore = create<FacturaSaldoStore>()((set) => ({
  facturasSaldo: null,
  loading: false,
  error: false,
  setFacturasSaldo: async (email: string, fechaInicio: string, fechaFin: string) => {
    set(({loading: true, error: false}))
    try {
      const response = await fetch('https://integraciones.cadeco.com.mx/vtex/api/usuario/facturas/saldoVtex', {
        method: 'get',
        headers: {
          email,
          fechaInicio,
          fechaFin
        }
      })
      set({facturasSaldo: await response.json(), loading: false})
    } catch (error) {
      set({loading: false, error: true})
    }
  },
  zipFacturasSaldo: async (body: string) => {
    set(({loading: true, error: false}))
    try {
      const response = await fetch('https://integraciones.cadeco.com.mx/vtex/api/usuario/facturas/saldo/zip', {
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
      a.download = 'FacturasConSaldo.zip'
      a.click()
      a.remove()
    } catch (error) {
      set({loading: false, error: true})
    }
  },
  setFacturaSaldoVtex: (facturas: FacturaSaldoType[] | null) => {
    set(({facturasSaldo: facturas, loading: false, error: false}))
  },
  setLoading: (isLoading: boolean) => {
    set(({loading: isLoading}))
  },
  setError: (isError: boolean) => {
    set(({error: isError}))
  },
}))

export default useFacturaSaldoStore
