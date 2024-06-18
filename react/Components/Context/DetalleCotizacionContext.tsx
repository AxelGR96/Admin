import { create } from 'zustand'
import DetalleCotizacionType from '../Types/DetalleCotizacionType';

type CotizacionStore = {
  detalleCot: DetalleCotizacionType | null,
  loading: boolean,
  error: boolean,
  isDetalle: boolean,
  setIsDetalle: (isDetalle: boolean) => void,
  setDetalleCotizacion: (idCotizacion: string) => void,
}

const useDetalleCotizacionStore = create<CotizacionStore>()((set) => ({
  detalleCot: null,
  loading: false,
  error: false,
  isDetalle: false,
  setIsDetalle: (isDetalle: boolean) => set({ isDetalle: isDetalle }),
  setDetalleCotizacion: async (idCotizacion: string) => {
    set(({loading: true, isDetalle: true, error: false}))
    try {
      const response = await fetch('https://integraciones.cadeco.com.mx/vtex/api/cotizador/detalleVtex', {
        method: 'get',
        headers: {
          idCotizacion
        }
      })
      set({detalleCot: await response.json(), loading: false})
    } catch (error) {
      set({loading: false, error: true})
    }
  },
}))

export default useDetalleCotizacionStore
