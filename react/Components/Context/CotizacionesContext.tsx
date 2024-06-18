import { create } from 'zustand'
import ListCotizacionesType from '../Types/ListCotizacionesType'

type CotizacionStore = {
  cotizaciones: ListCotizacionesType[] | null,
  antCotizaciones: ListCotizacionesType[] | null,
  loading: boolean,
  error: boolean
  setCotizaciones: (email: string, fechaInicial: string, fechaFinal: string, noParte: string) => void
  setAntCotizaciones: () => void
  setCotizacionesVtex: (cotizaciones: ListCotizacionesType[] | null) => void
  setLoading: (isLoading: boolean) => void
  setError: (isError: boolean) => void
}

const useCotizacionStore = create<CotizacionStore>()((set, get) => ({
  cotizaciones: null,
  antCotizaciones: null,
  loading: false,
  error: false,
  setCotizaciones: async (email: string, fechaInicial: string, fechaFinal: string, noParte: string) => {
    set(({ loading: true, error: false }))
    try {
      const response = await fetch('https://integraciones.cadeco.com.mx/vtex/api/usuario/cotizacionesVtex', {
        method: 'get',
        headers: {
          email,
          fechaInicial,
          fechaFinal,
          noParte,
        }
      })
      set(({antCotizaciones: get().cotizaciones}))
      set(({ cotizaciones: await response.json(), loading: false }))
    } catch (error) {
      set(({ error: true, loading: false }))
    }
  },
  setAntCotizaciones: () => {
    if(get().antCotizaciones != null)
      set(({cotizaciones: get().antCotizaciones}))
  },
  setCotizacionesVtex: (cotizaciones: ListCotizacionesType[] | null) => {
    set(({antCotizaciones: get().cotizaciones}))
    set(({cotizaciones: cotizaciones, loading: false, error: false}))
  },
  setLoading: (isLoading: boolean) => {
    set(({loading: isLoading}))
  },
  setError: (isError: boolean) => {
    set(({error: isError}))
  },
}))

export default useCotizacionStore
