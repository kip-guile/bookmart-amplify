import React, { useState } from 'react'
// prettier-ignore
import {PhotoPicker} from 'aws-amplify-react'
import { createBook } from '../graphql/mutations'
import { Storage, Auth, API, graphqlOperation } from 'aws-amplify'
import {
  Form,
  Button,
  Input,
  Notification,
  Radio,
  Progress,
} from 'element-react'
import aws_exports from '../aws-exports'
import { convertDollarsToCents } from '../utils'

const NewBook = ({ storeId, store, setStore }) => {
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [shipped, setShipped] = useState(false)
  const [imagePreview, setImagePreview] = useState('')
  const [image, setImage] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [percentUploaded, setPercentUploaded] = useState(false)

  const clearForm = () => {
    setDescription('')
    setPrice('')
    setImagePreview('')
    setImagePreview('')
    setIsUploading(false)
  }

  const handleAddBook = async () => {
    try {
      setIsUploading(true)
      const visibility = 'public'
      const { identityId } = await Auth.currentCredentials()
      const filename = `/${visibility}/${identityId}/${Date.now()}-${
        image.name
      }`
      const uploadedFile = await Storage.put(filename, image.file, {
        contentType: image.type,
        progressCallback: (progress) => {
          console.log(`Uploaded: ${progress.loaded}/${progress.total}`)
          const percentUploaded = Math.round(
            (progress.loaded / progress.total) * 100
          )
          setPercentUploaded(percentUploaded)
        },
      })
      const file = {
        key: uploadedFile.key,
        bucket: aws_exports.aws_user_files_s3_bucket,
        region: aws_exports.aws_project_region,
      }
      const input = {
        bookStoreId: storeId,
        description: description,
        shipped: shipped,
        price: convertDollarsToCents(price),
        file,
      }
      const result = await API.graphql(graphqlOperation(createBook, { input }))
      console.log('Created book', result)
      const createdBook = result.data.createBook
      const prevBooks = store.books.items.filter(
        (item) => item.id !== createdBook.id
      )
      const updatedBooks = [createdBook, ...prevBooks]
      const newStore = { ...store }
      newStore.books.items = updatedBooks
      setStore(newStore)

      Notification({
        title: 'Success',
        message: 'Book successfully created!',
        type: 'success',
      })
      clearForm()
    } catch (err) {
      console.error('Error adding book', err)
    }
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
          {percentUploaded > 0 && (
            <Progress
              type='circle'
              className='progress'
              percentage={percentUploaded}
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
              disabled={!image || !description || !price || isUploading}
              type='primary'
              onClick={handleAddBook}
              loading={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Add Book'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default NewBook
