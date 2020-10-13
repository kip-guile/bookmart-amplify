import React from 'react'
import { API } from 'aws-amplify'
import StripeCheckout from 'react-stripe-checkout'
// import { Notification, Message } from "element-react";

const stripeConfig = {
  currency: 'USD',
  publishableAPIKey:
    'pk_test_51HX5ZDCL7GpJ4pzeC4XFUauhK39MKrqtSCQnKYBsScrcAqjSMl8HtJVRCLyw3zm6UMxUgwVwtXDFweCqu3kilNGT00UtiCeLt9',
}

const PayButton = ({ book, userAttributes }) => {
  const handleCharge = async (token) => {
    try {
      const result = await API.post('orderlambda', '/charge', {
        body: {
          token,
          charge: {
            currency: stripeConfig.currency,
            amount: book.price,
            description: book.description,
          },
        },
      })
      console.log({ result })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <StripeCheckout
      token={handleCharge}
      currency={stripeConfig.currency}
      name={book.description}
      amount={book.price}
      email={userAttributes.email}
      shippingAddress={book.shipped}
      billingAddress={book.shipped}
      stripeKey={stripeConfig.publishableAPIKey}
      locale='auto'
      allowRememberMe={false}
    />
  )
}

export default PayButton
