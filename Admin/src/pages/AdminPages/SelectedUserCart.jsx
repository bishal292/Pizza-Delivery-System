import React from 'react'
import { useParams } from 'react-router-dom'

const SelectedUserCart = () => {
    const {cartId} = useParams();
    console.log(cartId);
  return (
    <div>
      User Cart with id : {cartId}
    </div>
  )
}

export default SelectedUserCart
