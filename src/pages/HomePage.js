import React, { useState } from 'react'
import { API, graphqlOperation } from 'aws-amplify'
import NewStore from '../components/NewStore'
import StoreList from '../components/StoreList'
import { searchStores } from '../graphql/queries'

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearchChange = (searchTerm) => setSearchTerm(searchTerm)
  const handleClearSearch = () => {
    setSearchTerm('')
    setSearchResults([])
  }
  const handleSearch = async (event) => {
    try {
      event.preventDefault()
      setIsSearching(true)
      const result = await API.graphql(
        graphqlOperation(searchStores, {
          filter: {
            or: [
              { name: { match: searchTerm } },
              { owner: { match: searchTerm } },
              { tags: { match: searchTerm } },
            ],
          },
          // sort: {
          //   field: 'createdAt',
          //   direction: 'desc',
          // },
        })
      )
      setSearchResults(result.data.searchStores.items)
      setIsSearching(false)
    } catch (err) {
      console.error(err)
    }
  }
  return (
    <>
      <NewStore
        isSearching={isSearching}
        handleSearch={handleSearch}
        searchTerm={searchTerm}
        handleClearSearch={handleClearSearch}
        handleSearchChange={handleSearchChange}
      />
      <StoreList searchResults={searchResults} />
    </>
  )
}

export default HomePage
