import React from 'react'
import { PageHeader } from 'vtex.styleguide'
import MiCredito from './MiCredito'

const MiCreditoPage = () => {
  return (
    <>
      <PageHeader
        title='Mi Crédito'
        linkLabel='ATRÁS'
        onLinkClick={() => {
          window.location.hash = "#/profile"
        }}
      />
      <MiCredito/>
    </>
  )
}

export default MiCreditoPage