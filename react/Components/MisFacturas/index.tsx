import React from 'react'
import { Spinner } from 'vtex.styleguide'
import Loading from '../Utils/Loading'
import ListFacturas from './ListFacturas'

const MisFacturas = () => {
  const loading = false

  return(
    <>
      {loading && (
          <div className='flex flex-column items-center justify-center w-100'><Spinner /></div>
        )}
      {loading && <Loading />}
      {!loading && <ListFacturas/>}
    </>
  )
}

export default MisFacturas
