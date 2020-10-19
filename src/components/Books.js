import React, { useState } from 'react'
import { Card } from 'antd'
import { CarOutlined, MailOutlined } from '@ant-design/icons'
import { S3Image } from 'aws-amplify-react'
import { API, graphqlOperation } from 'aws-amplify'
import { Link } from 'react-router-dom'
// prettier-ignore
import { Notification, Popover, Button, Dialog, Form, Input, Radio } from "element-react";
import { convertCentsToDollars, convertDollarsToCents } from '../utils'
import { Consumer } from '../App'
import { updateBook, deleteBook } from '../graphql/mutations'
import PayButton from './PayButton'

const { Meta } = Card

const Books = ({ book, setStore, store }) => {
  const [updatedBookDialog, setUpdatedBookDialog] = useState(false)
  const [DeleteBookDialog, setDeleteDBookDialog] = useState(false)
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [shipped, setShipped] = useState(false)
  // console.log(store)

  const handleSetState = () => {
    setUpdatedBookDialog(true)
    setDescription(book.description)
    setPrice(convertCentsToDollars(book.price))
    setShipped(book.shipped)
  }

  const handleUpdateBook = async (bookId) => {
    try {
      setUpdatedBookDialog(false)
      const input = {
        id: bookId,
        description,
        shipped,
        price: convertDollarsToCents(price),
      }
      const result = await API.graphql(graphqlOperation(updateBook, { input }))
      console.log({ result })
      const updatedBook = result.data.updateBook
      const updatedBookIndex = store.books.items.findIndex(
        (item) => item.id === updatedBook.id
      )
      const updatedBooks = [
        ...store.books.items.slice(0, updatedBookIndex),
        updatedBook,
        ...store.books.items.slice(updatedBookIndex + 1),
      ]
      const newStore = { ...store }
      newStore.books.items = updatedBooks
      setStore(newStore)
      Notification({
        title: 'Success',
        message: 'Book successfully updated!',
        type: 'success',
        duration: 2000,
      })
      // setTimeout(() => window.location.reload(), 4000)
    } catch (err) {
      console.error(`Failed to update book with id: ${bookId}`, err)
    }
  }
  const handleDeleteBook = async (bookId) => {
    try {
      setDeleteDBookDialog(false)
      const input = {
        id: bookId,
      }
      const result = await API.graphql(graphqlOperation(deleteBook, { input }))
      const deletedBookId = result.data.deleteBook.id
      const updatedBooks = store.books.items.filter(
        (item) => item.id !== deletedBookId
      )
      const newStore = { ...store }
      newStore.books.items = updatedBooks
      setStore(newStore)
      Notification({
        title: 'Success',
        message: 'Book successfully deleted!',
        type: 'success',
        duration: 2000,
      })
    } catch (err) {
      console.error(`Failed to delete book with id ${bookId}`, err)
    }
  }
  return (
    <Consumer>
      {({ user, userAttributes }) => {
        const isProductOwner =
          userAttributes && userAttributes.email === store.owner

        const isEmailVerified = userAttributes && userAttributes.email_verified

        return (
          <div className='card-container'>
            <Card
              hoverable
              style={{ width: 240 }}
              cover={
                <S3Image
                  imgKey={book.file.key}
                  // onLoad={(url) => console.log(url)}
                  theme={{
                    photoImg: { maxWidth: '100%', maxHeight: '100%' },
                  }}
                />
              }
            >
              <Meta
                title={book.description}
                description={
                  <div className='card-body'>
                    <div className='items-center'>
                      {book.shipped ? <CarOutlined /> : <MailOutlined />}
                      {book.shipped ? 'Shipped' : 'Emailed'}
                    </div>
                    <div className='text-right'>
                      <span className='mx-1'>
                        ${convertCentsToDollars(book.price)}
                      </span>
                      {isEmailVerified ? (
                        !isProductOwner && (
                          <PayButton
                            book={book}
                            userAttributes={userAttributes}
                          />
                        )
                      ) : (
                        <Link to='/profile' className='link'>
                          Verify Email
                        </Link>
                      )}
                    </div>
                  </div>
                }
              />
            </Card>
            <div className='text-center'>
              {isProductOwner && (
                <>
                  <Button
                    type='warning'
                    icon='edit'
                    className='m-1'
                    onClick={handleSetState}
                  />
                  <Popover
                    placement='top'
                    width='160'
                    trigger='click'
                    visible={DeleteBookDialog}
                    content={
                      <>
                        <p>Do you want to delete this?</p>
                        <div className='text-right'>
                          <Button
                            size='mini'
                            type='text'
                            className='m-1'
                            onClick={() => setDeleteDBookDialog(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            type='primary'
                            size='mini'
                            className='m-1'
                            onClick={() => handleDeleteBook(book.id)}
                          >
                            Confirm
                          </Button>
                        </div>
                      </>
                    }
                  >
                    <Button
                      onClick={() => setDeleteDBookDialog(true)}
                      type='danger'
                      icon='delete'
                    />
                  </Popover>
                </>
              )}
            </div>
            <Dialog
              title='Update Book'
              size='large'
              customClass='dialog'
              visible={updatedBookDialog}
              onCancel={() => setUpdatedBookDialog(false)}
            >
              <Dialog.Body>
                <Form labelPosition='top'>
                  <Form.Item label='Update Description'>
                    <Input
                      icon='information'
                      placeholder='Book Description'
                      value={description}
                      trim={true}
                      onChange={(description) => setDescription(description)}
                    />
                  </Form.Item>
                  <Form.Item label='Update Price'>
                    <Input
                      type='number'
                      icon='plus'
                      placeholder='Price ($USD)'
                      value={price}
                      onChange={(price) => setPrice(price)}
                    />
                  </Form.Item>
                  <Form.Item label='Update Shipping'>
                    <div className='text-center'>
                      <Radio
                        value='true'
                        checked={shipped === true}
                        onChange={() => setShipped(true)}
                      >
                        Shipped
                      </Radio>
                      <Radio
                        value='false'
                        checked={shipped === false}
                        onChange={() => setShipped(false)}
                      >
                        Emailed
                      </Radio>
                    </div>
                  </Form.Item>
                </Form>
              </Dialog.Body>
              <Dialog.Footer>
                <Button onClick={() => setUpdatedBookDialog(false)}>
                  Cancel
                </Button>
                <Button
                  type='primary'
                  onClick={() => handleUpdateBook(book.id)}
                >
                  Update
                </Button>
              </Dialog.Footer>
            </Dialog>
          </div>
        )
      }}
    </Consumer>
  )
}

export default Books
