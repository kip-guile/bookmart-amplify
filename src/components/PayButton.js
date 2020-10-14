import React from 'react'
import { API, graphqlOperation } from 'aws-amplify'
import { getUser } from '../graphql/queries'
import { createOrder } from '../graphql/mutations'
import StripeCheckout from 'react-stripe-checkout'
import { history } from '../App'
import { Notification, Message } from 'element-react'

const stripeConfig = {
  currency: 'USD',
  publishableAPIKey:
    'pk_test_51HX5ZDCL7GpJ4pzeC4XFUauhK39MKrqtSCQnKYBsScrcAqjSMl8HtJVRCLyw3zm6UMxUgwVwtXDFweCqu3kilNGT00UtiCeLt9',
}

const PayButton = ({ book, userAttributes }) => {
  const getOwnerEmail = async (ownerId) => {
    try {
      const input = { id: ownerId }
      const result = await API.graphql(graphqlOperation(getUser, input))
      return result.data.getUser.email
    } catch (err) {
      console.error(`Error fetching book owner's email`, err)
    }
  }

  const createShippingAddress = (source) => ({
    city: source.address_city,
    country: source.address_country,
    address_line1: source.address_line1,
    address_state: source.address_state,
    address_zip: source.address_zip,
  })

  const handleCharge = async (token) => {
    try {
      const ownerEmail = await getOwnerEmail(book.owner)
      const result = await API.post('orderlambda', '/charge', {
        body: {
          token,
          charge: {
            currency: stripeConfig.currency,
            amount: book.price,
            description: book.description,
          },
          email: {
            customerEmail: userAttributes.email,
            ownerEmail,
            shipped: book.shipped,
          },
        },
      })
      console.log({ result })
      if (result.charge.status === 'succeeded') {
        let shippingAddress = null
        if (book.shipped) {
          shippingAddress = createShippingAddress(result.charge.source)
        }
        const input = {
          orderUserId: userAttributes.sub,
          orderProductId: book.id,
          shippingAddress,
        }
        const order = await API.graphql(
          graphqlOperation(createOrder, { input })
        )
        console.log({ order })
        Notification({
          title: 'Success',
          message: `${result.message}`,
          type: 'success',
          duration: 3000,
        })
        setTimeout(() => {
          history.push('/')
          Message({
            type: 'info',
            message: 'Check your verified email for order details',
            duration: 5000,
            showClose: true,
          })
        }, 3000)
      }
    } catch (err) {
      console.error(err)
      Notification.error({
        title: 'Error',
        message: `${err.message || 'Error processing order'}`,
      })
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
