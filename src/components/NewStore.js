import React, { useState } from 'react'
import { API, graphqlOperation } from 'aws-amplify'
import { createStore } from '../graphql/mutations'
// prettier-ignore
import { Form, Button, Dialog, Input, Select, Notification } from 'element-react'

const NewStore = () => {
  const [addStoreDialog, setAddStoreDialog] = useState(false)
  const [name, setName] = useState('')

  const handleAddStore = async () => {
    try {
      setAddStoreDialog(false)
      const input = {
        name: name,
      }
      const result = await API.graphql(graphqlOperation(createStore, { input }))
      console.info(`Created mairket: id ${result.data.createStore.id}`)
    } catch (err) {
      Notification.error({
        title: 'Error',
        message: `${err.message || 'Error adding Market'}`,
      })
    }
  }
  return (
    <div>
      <div className='market-header'>
        <h1 className='market-title'>
          Create Your Store
          <Button
            type='text'
            icon='edit'
            className='market-title-button'
            onClick={() => setAddStoreDialog(true)}
          />
        </h1>
      </div>
      <Dialog
        title='Create new market'
        visible={addStoreDialog}
        onCancel={() => setAddStoreDialog(false)}
        size='large'
        customClass='dialog'
      >
        <Dialog.Body>
          <Form labelPosition='top'>
            <Form.Item label='Add Store Name'>
              <Input
                placeholder='Store name'
                trim={true}
                value={name}
                onChange={(name) => setName(name)}
              />
            </Form.Item>
          </Form>
        </Dialog.Body>
        <Dialog.Footer>
          <Button onClick={() => setAddStoreDialog(false)}>Cancel</Button>
          <Button
            type='primary'
            disabled={name.length <= 0}
            onClick={handleAddStore}
          >
            Add
          </Button>
        </Dialog.Footer>
      </Dialog>
    </div>
  )
}

export default NewStore
