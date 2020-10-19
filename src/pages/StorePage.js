import React, { useEffect, useState } from 'react'
import { API, graphqlOperation } from 'aws-amplify'
import { Tabs } from 'antd'
import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { Loading, Icon } from 'element-react'
import { Link } from 'react-router-dom'
import NewBook from '../components/NewBook'
import Books from '../components/Books'
import { formatProductDate } from '../utils'

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

const { TabPane } = Tabs

const StorePage = ({ storeId, user, userAttributes }) => {
  const [store, setStore] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isStoreOwner, setIsStoreOwner] = useState(false)
  const [isEmailVerified, setIsEmailVerified] = useState(false)

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

  const checkEmailVerified = () => {
    if (userAttributes) {
      setIsEmailVerified(userAttributes.email_verified)
    }
  }

  useEffect(() => {
    handleGetStore()
  }, [])

  useEffect(() => {
    checkStoreOwner()
  }, [store, user])

  useEffect(() => {
    checkEmailVerified()
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
          {formatProductDate(store.createdAt)}
        </span>
      </div>
      <Tabs
        style={{ display: 'flex' }}
        mode='horizontal'
        selectedKeys={isStoreOwner ? '1' : '2'}
      >
        {isStoreOwner && (
          <TabPane key='1' tab='Add Books' icon={<MailOutlined />}>
            {isEmailVerified ? (
              <NewBook storeId={storeId} setStore={setStore} store={store} />
            ) : (
              <Link to='/profile' className='header'>
                Verify your email before adding products
              </Link>
            )}
          </TabPane>
        )}
        <TabPane key='2' tab='Books' icon={<AppstoreOutlined />}>
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
        </TabPane>
      </Tabs>
    </>
  )
}

export default StorePage
