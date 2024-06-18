import React, { useEffect } from 'react'
import { useQuery } from 'react-apollo'
import getProfile  from '../../graphql/getProfile.graphql'

const Garantias = () => {
  const {loading, data} = useQuery(getProfile)

  useEffect(() => {
    if(!loading)
      reDirectGarantias(data.profile.email,data.profile.customFields[0].value)
  }, [data])

  const reDirectGarantias = (correo: string, validador: string) => {
    console.log(correo,validador)
    window.open(`https://servicioalcliente.cadeco.com.mx/SolicitudGarantia/MiCuenta/Login?email=${correo}&validador=${validador}`, '_blank')
    window.location.hash = "#/profile"
  }

  return(
    <>
    </>
  )
}

export default Garantias
