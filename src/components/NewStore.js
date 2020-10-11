import React, { useState } from 'react'
import { API, graphqlOperation } from 'aws-amplify'
import { createStore } from '../graphql/mutations'
// prettier-ignore
import { Form, Button, Dialog, Input, Select, Notification, isSearching } from 'element-react'
import { Consumer } from '../App'

const NewStore = ({
  handleSearch,
  searchTerm,
  handleSearchChange,
  handleClearSearch,
}) => {
  const [addStoreDialog, setAddStoreDialog] = useState(false)
  const [name, setName] = useState('')
  const [tags] = useState(['Fantasy', 'Scifi', 'Horror'])
  const [selectedTags, setSelectedTags] = useState([])
  const [options, setOptions] = useState([])

  const handleAddStore = async (user) => {
    try {
      setAddStoreDialog(false)
      const input = {
        name: name,
        tags: selectedTags,
        owner: user.attributes.email,
      }
      const result = await API.graphql(graphqlOperation(createStore, { input }))
      console.info(`Created mairket: id ${result.data.createStore.id}`)
      setName('')
      setSelectedTags([])
    } catch (err) {
      console.error('Error adding new store', err)
      Notification.error({
        title: 'Error',
        message: `${err.message || 'Error adding Market'}`,
      })
    }
  }
  const handleFilterTags = (query) => {
    const options = tags
      .map((tag) => ({ value: tag, label: tag }))
      .filter((tag) => tag.label.toLowerCase().includes(query.toLowerCase()))
    setOptions(options)
  }
  return (
    <Consumer>
      {({ user }) => (
        <>
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
              <Form onSubmit={handleSearch} inline={true}>
                <Form.Item>
                  <Input
                    onChange={handleSearchChange}
                    value={searchTerm}
                    onIconClick={handleClearSearch}
                    placeholder='Search Markets...'
                    icon='circle-cross'
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    loading={isSearching}
                    type='info'
                    icon='search'
                    onClick={handleSearch}
                  >
                    Search
                  </Button>
                </Form.Item>
              </Form>
            </div>

            <Dialog
              title='Create new store'
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
                  <Form.Item label='Add Tags'>
                    <Select
                      multiple={true}
                      filterable={true}
                      placeholder='Genre Tags'
                      onChange={(selectedTags) => setSelectedTags(selectedTags)}
                      remoteMethod={handleFilterTags}
                      remote={true}
                    >
                      {options.map((option) => (
                        <Select.Option
                          key={option.value}
                          label={option.label}
                          value={option.value}
                        />
                      ))}
                    </Select>
                  </Form.Item>
                </Form>
              </Dialog.Body>
              <Dialog.Footer>
                <Button onClick={() => setAddStoreDialog(false)}>Cancel</Button>
                <Button
                  type='primary'
                  disabled={name.length <= 0}
                  onClick={() => handleAddStore(user)}
                >
                  Add
                </Button>
              </Dialog.Footer>
            </Dialog>
          </div>
        </>
      )}
    </Consumer>
  )
}

export default NewStore
