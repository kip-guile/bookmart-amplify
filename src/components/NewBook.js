import React, { useState } from 'react'
// prettier-ignore
import {PhotoPicker} from 'aws-amplify-react'
import {
  Form,
  Button,
  Input,
  Notification,
  Radio,
  Progress,
} from 'element-react'

const NewBook = () => {
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [shipped, setShipped] = useState(false)
  const [imagePreview, setImagePreview] = useState('')
  const [image, setImage] = useState('')

  const clearForm = () => {
    setDescription('')
    setPrice('')
    setImagePreview('')
    setImagePreview('')
  }

  const handleAddBook = () => {
    console.log({ description, price, shipped, imagePreview, image })
    clearForm()
  }

  return (
    <div className='flex-center'>
      <h2 className='header'>Add new book</h2>
      <div>
        <Form className='market-header'>
          <Form.Item label='Set Book Description'>
            <Input
              value={description}
              type='text'
              icon='information'
              placeholder='Description'
              onChange={(description) => setDescription(description)}
            />
          </Form.Item>
          <Form.Item label='Set Book Price'>
            <Input
              value={price}
              type='number'
              icon='plus'
              placeholder='Price ($USD)'
              onChange={(price) => setPrice(price)}
            />
          </Form.Item>
          <Form.Item label='Is the book shipped or emailed'>
            <div className='text-center'>
              <Radio
                value='true'
                checked={shipped === true}
                onChange={() => setShipped(true)}
              >
                Shipped
              </Radio>
              <Radio
                value='true'
                checked={shipped === false}
                onChange={() => setShipped(false)}
              >
                Emailed
              </Radio>
            </div>
          </Form.Item>
          {imagePreview && (
            <img
              className='image-preview'
              src={imagePreview}
              alt='book preview'
            />
          )}
          <PhotoPicker
            // title='Book Image'
            preview='hidden'
            onPick={(file) => setImage(file)}
            onLoad={(url) => setImagePreview(url)}
            theme={{
              formContainer: {
                margin: 0,
                padding: '0.8em',
              },
              formSection: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              },
              sectionBody: {
                margin: 0,
                width: '250px',
              },
              sectionHeader: {
                padding: '0.2em',
                color: 'var(--darkAmazonOrange)',
              },
              photoPickerButton: {
                // display: 'none',
                marginTop: '0.5em',
              },
            }}
          />
          <Form.Item>
            <Button
              disabled={!image || !description || !price}
              type='primary'
              onClick={handleAddBook}
            >
              Add Book
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default NewBook
