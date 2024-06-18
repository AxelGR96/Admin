import { create } from 'zustand'
import CreditoType from '../Types/CreditoType'

type CreditoStore = {
  credito: CreditoType | null,
  loading: boolean,
  error: boolean,
  setCreditos: (email: string) => void,
}

const useCreditoStore = create<CreditoStore>()((set) => ({
  credito: null,
  loading: false,
  error: false,
  setCreditos: async (email: string) => {
    set(({loading: true, error: false}))
    try {
      const response = await fetch('https://integraciones.cadeco.com.mx/vtex/api/usuario/cliente', {
        method: 'get',
        headers: {
          email
        }
      })
      set({credito: await response.json(), loading: false})
    } catch (error) {
      set({loading: false, error: true})
    }
  }
}))

export default useCreditoStore
