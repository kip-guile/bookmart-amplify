import React from 'react'
import { Connect } from 'aws-amplify-react'
import { listStores } from '../graphql/queries'
import { graphqlOperation } from 'aws-amplify'
import Error from './Error'
import { Loading, Card, Icon, Tag } from 'element-react'
import { Link } from 'react-router-dom'

const StoreList = () => {
  return (
    <Connect query={graphqlOperation(listStores)}>
      {({ data, loading, errors }) => {
        console.log(data)
        if (errors.length > 0) return <Error errors={errors} />
        if (loading || !data.listStores) return <Loading fullscreen={true} />

        return (
          <>
            <h2 className='header'>
              <img
                className='large-icon'
                src='https://icon.now.sh/store_mall_directory/527FFF'
                alt='store-icon'
              />
            </h2>
            {data.listStores &&
              data.listStores.items.map((store) => (
                <div key={store.id} className='my-2'>
                  <Card
                    bodyStyle={{
                      padding: '0.7em',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <span className='flex'>
                        <Link className='link' to={`/stores/${store.id}`}>
                          {store.name}
                        </Link>
                        <span style={{ color: 'var(--darkAmazonOrange)' }}>
                          {store.books.items.length}
                        </span>
                        <img
                          src='https://icon.now.sh/shopping_cart/f60'
                          alt='Shopping Cart'
                        />
                      </span>
                      <div style={{ color: 'var(--lightSquidInk)' }}>
                        {store.owner}
                      </div>
                    </div>
                    <div>
                      {store.tags &&
                        store.tags.map((tag) => (
                          <Tag key={tag} type='danger' className='mx-1'>
                            {tag}
                          </Tag>
                        ))}
                    </div>
                  </Card>
                </div>
              ))}
          </>
        )
      }}
    </Connect>
  )
}

export default StoreList
