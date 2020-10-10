import React, { useState } from 'react'
import NewStore from '../components/NewStore'
import StoreList from '../components/StoreList'

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearchChange = (searchTerm) => setSearchTerm(searchTerm)
  const handleClearSearch = () => {
    setSearchTerm('')
    setSearchResults([])
  }
  const handleSearch = (event) => {
    event.preventDefault()
    console.log(searchTerm)
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
      <StoreList />
    </>
  )
}

export default HomePage
