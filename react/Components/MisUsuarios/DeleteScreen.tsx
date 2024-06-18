import React, { FC } from 'react'
import {Button,IconDelete,IconSuccess} from 'vtex.styleguide'

type DeleteScreenProps = {
    onDelete: () => void,
    onCancel: () => void,
    user: any,
}

const DeleteScreen: FC<DeleteScreenProps> = ({onDelete, onCancel,user}) => {
    console.log("useeeeeer en componete delete",user)
  return (
    <>
        <div className='flex flex-row justify-center'>
            <div className='flex flex-column'>
                <div>
                    <span className='f3'>¿Esta seguro que desea eliminar el usuario?</span>
                </div>

                <div className='flex flex-row justify-center mt5'>
                    <div className='ma2'>
                        <Button  variation="primary" onClick={onCancel}>
                            <div className="flex flex-row items-center">
                                <div><IconDelete color="red" /> </div>
                                <div className='ml2 mb1'><span>No</span></div>
                            </div>
                        </Button>
                    </div>
                    
                    <div className='ma2'>
                        <Button  variation="primary" onClick={onDelete}>
                            <div className='flex flex-row items-center'>
                                <div><IconSuccess color="green" /></div>
                                <div className='ml2 mb2'><span>Si</span></div>
                            </div>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default DeleteScreen
