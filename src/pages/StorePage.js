import React, { useEffect, useState } from 'react'
import { API, graphqlOperation } from 'aws-amplify'
import { Loading, Tabs, Icon } from 'element-react'
import { Link } from 'react-router-dom'
import NewBook from '../components/NewBook'
import Books from '../components/Books'

export const getStore = /* GraphQL */ `
  query GetStore($id: ID!) {
    getStore(id: $id) {
      id
      name
      books {
        items {
          id
          description
          price
          shipped
          owner
          file {
            key
          }
          createdAt
          updatedAt
        }
        nextToken
      }
      tags
      owner
      createdAt
      updatedAt
    }
  }
`

const StorePage = ({ storeId, user }) => {
  const [store, setStore] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isStoreOwner, setIsStoreOwner] = useState(false)
  console.log(store)
  const handleGetStore = async () => {
    const input = {
      id: storeId,
    }
    const result = await API.graphql(graphqlOperation(getStore, input))
    setStore(result.data.getStore)
    setIsLoading(false)
  }

  const checkStoreOwner = () => {
    if (user && store) {
      setIsStoreOwner(user.attributes.email === store.owner)
    }
  }

  useEffect(() => {
    handleGetStore()
  }, [])

  useEffect(() => {
    checkStoreOwner()
  }, [store, user])

  return isLoading ? (
    <Loading fullscreen={true} />
  ) : (
    <>
      <Link className='link' to='/'>
        Back to Stores List
      </Link>
      <span className='items-center pt-2'>
        <h2 className='mb-mr'>{store.name}</h2>- {store.owner}
      </span>
      <div className='items-center pt-2'>
        <span style={{ color: 'var(--lightSquidInk)', paddingBottom: '1em' }}>
          <Icon name='date' className='icon' />
          {store.createdAt}
        </span>
      </div>
      <Tabs type='border-card' value={isStoreOwner ? '1' : '2'}>
        {isStoreOwner && (
          <Tabs.Pane
            label={
              <>
                <Icon name='plus' className='icon' />
                Add Books
              </>
            }
            name='1'
          >
            <NewBook storeId={storeId} setStore={setStore} store={store} />
          </Tabs.Pane>
        )}
        <Tabs.Pane
          label={
            <>
              <Icon name='menu' className='icon' />
              Books ({store.books.items.length})
            </>
          }
          name='2'
        >
          <div className='product-list'>
            {store.books.items.map((book) => (
              <Books
                key={book.id}
                book={book}
                setStore={setStore}
                store={store}
              />
            ))}
          </div>
        </Tabs.Pane>
      </Tabs>
    </>
  )
}

export default StorePage
