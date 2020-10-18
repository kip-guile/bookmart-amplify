import React from 'react'
import { Connect } from 'aws-amplify-react'
import { listStores } from '../graphql/queries'
import { ShopOutlined } from '@ant-design/icons'
import { onCreateStore } from '../graphql/subscriptions'
import { graphqlOperation } from 'aws-amplify'
import Error from './Error'
import { Card, Tag } from 'antd'
import { Loading, Icon } from 'element-react'
import { Link } from 'react-router-dom'
import { ShoppingCartOutlined } from '@ant-design/icons'

const StoreList = ({ searchResults }) => {
  const onNewStore = (prevQuery, newData) => {
    let updatedQuery = { ...prevQuery }
    const updatedStoreList = [
      newData.onCreateStore,
      ...prevQuery.listStores.items,
    ]
    updatedQuery.listStores.items = updatedStoreList
    return updatedQuery
  }
  return (
    <Connect
      query={graphqlOperation(listStores)}
      subscription={graphqlOperation(onCreateStore)}
      onSubscriptionMsg={onNewStore}
    >
      {({ data, loading, errors }) => {
        if (errors.length > 0) return <Error errors={errors} />
        if (loading || !data.listStores) return <Loading fullscreen={true} />
        const stores =
          searchResults.length > 0 ? searchResults : data.listStores.items

        return (
          <>
            {searchResults.length > 0 ? (
              <h2 className='text-green'>
                <Icon type='success' name='check' className='icon' />
                {searchResults.length} Results
              </h2>
            ) : (
              <div>
                <h2 className='header'>
                  <ShopOutlined style={{ fontSize: '2rem' }} />
                  Available Stores
                </h2>
              </div>
            )}
            <div
              div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}
            >
              {data.listStores &&
                stores.map((store) => (
                  <div key={store.id} className='my-2'>
                    <Card
                      title={
                        <span className='flex'>
                          <Link className='link' to={`/stores/${store.id}`}>
                            {store.name}
                          </Link>
                          <Tag color='magenta'>
                            {store.books.items.length} titles
                          </Tag>
                        </span>
                      }
                      extra={
                        <span>
                          <ShoppingCartOutlined
                            style={{ fontSize: '1.5rem' }}
                          />
                        </span>
                      }
                      style={{ width: 300, height: 200 }}
                    >
                      <div>
                        <span className='flex'></span>
                        <div
                          style={{
                            color: 'var(--lightSquidInk)',
                            marginBottom: '2rem',
                          }}
                        >
                          {store.owner}
                        </div>
                      </div>
                      <div>
                        {store.tags &&
                          store.tags.map((tag) => (
                            <Tag key={tag} color='green'>
                              {tag}
                            </Tag>
                          ))}
                      </div>
                    </Card>
                  </div>
                ))}
            </div>
          </>
        )
      }}
    </Connect>
  )
}

export default StoreList
