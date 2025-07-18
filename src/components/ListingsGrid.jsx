import React, { useEffect, useRef } from 'react'
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'
import ListingCard from './ListingCard'

const ListingsGrid = ({ listings, onDelete, onUpdate, onSelectListing, onDeselectListing, selectedListingId }) => {
  const cardRefs = useRef({})
  
  useEffect(() => {
    if (selectedListingId && cardRefs.current[selectedListingId]) {
      cardRefs.current[selectedListingId].scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }
  }, [selectedListingId])
  if (listings.length === 0) {
    return (
      <div className="listings-grid">
        <p>Noch keine Wohnungen. Füge deine erste Wohnung hinzu!</p>
      </div>
    )
  }

  return (
    <SimpleBar className="listings-scrollbar" onClick={onDeselectListing}>
      <div className="listings-grid" onClick={(e) => e.stopPropagation()}>
        {listings.map(listing => (
          <div
            key={listing.id}
            ref={el => cardRefs.current[listing.id] = el}
          >
            <ListingCard
              listing={listing}
              onDelete={onDelete}
              onUpdate={onUpdate}
              onClick={onSelectListing}
              isSelected={selectedListingId === listing.id}
            />
          </div>
        ))}
      </div>
    </SimpleBar>
  )
}

export default ListingsGrid