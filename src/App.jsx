import React, { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import ListingForm from './components/ListingForm'
import ListingsGrid from './components/ListingsGrid'
import MapView from './components/MapView'
import { geocodeAddress } from './utils/geocoding'

function App() {
  const [listings, setListings] = useState([])
  const [selectedListing, setSelectedListing] = useState(null)
  const [coordinates, setCoordinates] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('view')
  const [listingsWithCoords, setListingsWithCoords] = useState([])

  useEffect(() => {
    fetchListings()
  }, [])

  useEffect(() => {
    // Geocode all listings when they change
    const geocodeListings = async () => {
      const geocoded = await Promise.all(
        listings.map(async (listing) => {
          const coords = await geocodeAddress(listing.address)
          return {
            ...listing,
            coordinates: coords
          }
        })
      )
      setListingsWithCoords(geocoded.filter(l => l.coordinates))
    }
    
    if (listings.length > 0) {
      geocodeListings()
    }
  }, [listings])

  const fetchListings = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setListings(data || [])
    } catch (error) {
      console.error('Error fetching listings:', error)
      alert('Error fetching listings. Check your Supabase configuration.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddListing = async (formData) => {
    try {
      // Convert empty strings to null for numeric fields
      const processedFormData = {
        ...formData,
        rent: formData.rent === '' ? null : formData.rent,
        extra_costs: formData.extra_costs === '' ? null : formData.extra_costs,
        total_rent: formData.total_rent === '' ? null : formData.total_rent
      }
      
      const { data, error } = await supabase
        .from('listings')
        .insert([processedFormData])
        .select()

      if (error) throw error
      
      if (data) {
        setListings([data[0], ...listings])
      }
    } catch (error) {
      console.error('Error adding listing:', error)
      alert('Error adding listing. Check your Supabase configuration.')
    }
  }

  const handleDeleteListing = async (id) => {
    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id)

      if (error) throw error

      setListings(listings.filter(listing => listing.id !== id))
      
      if (selectedListing?.id === id) {
        setSelectedListing(null)
        setCoordinates(null)
      }
    } catch (error) {
      console.error('Error deleting listing:', error)
      alert('Error deleting listing.')
    }
  }

  const handleUpdateListing = async (id, updates) => {
    try {
      // Convert empty strings to null for numeric fields
      const processedUpdates = {
        ...updates,
        rent: updates.rent === '' ? null : updates.rent,
        extra_costs: updates.extra_costs === '' ? null : updates.extra_costs,
        total_rent: updates.total_rent === '' ? null : updates.total_rent
      }
      
      const { data, error } = await supabase
        .from('listings')
        .update(processedUpdates)
        .eq('id', id)
        .select()

      if (error) throw error

      if (data) {
        setListings(listings.map(listing => 
          listing.id === id ? data[0] : listing
        ))
        
        if (selectedListing?.id === id) {
          setSelectedListing(data[0])
        }
      }
    } catch (error) {
      console.error('Error updating listing:', error)
      alert('Error updating listing.')
    }
  }

  const handleSelectListing = async (listing) => {
    // If listing already has coordinates (from map click), use those
    if (listing.coordinates) {
      setSelectedListing(listing)
      setCoordinates(listing.coordinates)
    } else {
      // Otherwise geocode the address
      const coords = await geocodeAddress(listing.address)
      setSelectedListing({
        ...listing,
        coordinates: coords
      })
      setCoordinates(coords)
    }
  }

  const handleDeselectListing = () => {
    setSelectedListing(null)
    setCoordinates(null)
  }

  return (
    <main className="container app-container" onClick={handleDeselectListing}>
      <header className="app-header" onClick={(e) => e.stopPropagation()}>
        <h1>Flat Finder</h1>
      </header>

      <div className="tabs" onClick={(e) => e.stopPropagation()}>
        <button 
          className={`tab ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          Wohnung hinzufügen
        </button>
        <button 
          className={`tab ${activeTab === 'view' ? 'active' : ''}`}
          onClick={() => setActiveTab('view')}
        >
          Wohnungen anzeigen
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'add' ? (
          <section className="add-listing-section" onClick={(e) => e.stopPropagation()}>
            <ListingForm onSubmit={(data) => {
              handleAddListing(data)
              setActiveTab('view')
            }} />
          </section>
        ) : (
          <div className="view-listings-content">
            <div className="listings-section" onClick={(e) => e.stopPropagation()}>
              <h2>Potentielle Wohnungen</h2>
              {loading ? (
                <p>Lade Wohnungen...</p>
              ) : (
                <ListingsGrid
                  listings={listings}
                  onDelete={handleDeleteListing}
                  onUpdate={handleUpdateListing}
                  onSelectListing={handleSelectListing}
                  onDeselectListing={handleDeselectListing}
                  selectedListingId={selectedListing?.id}
                />
              )}
            </div>

            <div className="map-section">
              <MapView 
                listings={listingsWithCoords}
                selectedListing={selectedListing}
                onSelectListing={handleSelectListing}
                onDeselectListing={handleDeselectListing}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default App