import React from 'react'
import { Alert } from 'vtex.styleguide'

const ErrorMyAccount = (mensaje: string, callback: Function) => {
  const closeAlert = () => {
    callback()
  }

  return (
    <div className='flex flex-column items-center justify-center w-100'>
      <Alert type="error" onClose={closeAlert}>
        {mensaje}
      </Alert>
    </div>
  )
}

export default ErrorMyAccount
