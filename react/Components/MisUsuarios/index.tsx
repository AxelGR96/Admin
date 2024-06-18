import React from 'react'
import { PageHeader } from 'vtex.styleguide'
import MisUsuario from './MisUsuarios'

const MisUsuarios = () => {

    return(
        <>
            <PageHeader
                title='Mis Correos'
                linkLabel='ATRÁS'
                onLinkClick={() => {
                window.location.hash = "#/profile"
                }}
            />
            <MisUsuario/>
        </>
    )
}

export default MisUsuarios
