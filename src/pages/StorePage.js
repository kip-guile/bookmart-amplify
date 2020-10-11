import React, { useEffect, useState } from 'react'
import { API, graphqlOperation } from 'aws-amplify'
import { getStore } from '../graphql/queries'
import { Loading, Tabs, Icon } from 'element-react'
import { Link } from 'react-router-dom'
import NewBook from '../components/NewBook'
import Books from '../components/Books'

const StorePage = ({ storeId, user }) => {
  const [store, setStore] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isStoreOwner, setIsStoreOwner] = useState(false)
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
            <NewBook />
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
          {/* <div className='products-list'>
            {store.books.items.map(book => (
              <Books book={book} />
            ))}
          </div> */}
        </Tabs.Pane>
      </Tabs>
    </>
  )
}

export default StorePage
