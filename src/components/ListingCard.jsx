import React, { useState } from 'react'
import { translateStatusToEnglish, translateStatusToGerman } from '../utils/translations'

const ListingCard = ({ listing, onDelete, onUpdate, onClick, isSelected }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    address: listing.address,
    status: listing.status,
    description: listing.description,
    rent: listing.rent || '',
    extra_costs: listing.extra_costs || '',
    total_rent: listing.total_rent || ''
  })

  const handleEdit = () => {
    setIsEditing(true)
    setEditData({
      address: listing.address,
      status: translateStatusToGerman(listing.status),
      description: listing.description,
      rent: listing.rent || '',
      extra_costs: listing.extra_costs || '',
      total_rent: listing.total_rent || ''
    })
  }

  const handleSave = async () => {
    // Convert German status to English for storage
    const dataToUpdate = {
      ...editData,
      status: translateStatusToEnglish(editData.status)
    }
    await onUpdate(listing.id, dataToUpdate)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditData({
      address: listing.address,
      status: translateStatusToGerman(listing.status),
      description: listing.description,
      rent: listing.rent || '',
      extra_costs: listing.extra_costs || '',
      total_rent: listing.total_rent || ''
    })
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    const newData = {
      ...editData,
      [name]: value
    }
    
    // Auto-calculate total rent when rent or extra costs change
    if (name === 'rent' || name === 'extra_costs') {
      const rent = parseFloat(newData.rent) || 0
      const extraCosts = parseFloat(newData.extra_costs) || 0
      newData.total_rent = (rent + extraCosts).toString()
    }
    
    setEditData(newData)
  }

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (window.confirm('Bist du sicher, dass du diese Wohnung löschen möchtest?')) {
      await onDelete(listing.id)
    }
  }

  const getStatusClass = (status) => {
    return status.toLowerCase().replace(/\s+/g, '-')
  }

  return (
    <article 
      className={`listing-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick(listing)}
    >
      <div className="listing-header">
        <div className="listing-title-section">
          <h4>{listing.title}</h4>
          <p className="listing-address"><small>{listing.address}</small></p>
        </div>
        <div className="listing-right-section">
          <span className={`status-badge ${getStatusClass(listing.status)}`}>
            {translateStatusToGerman(listing.status)}
          </span>
          {listing.total_rent && (
            <p className="rent-info">
              <strong>€{listing.total_rent}/Monat</strong>
            </p>
          )}
        </div>
      </div>

      {isEditing ? (
        <div onClick={e => e.stopPropagation()}>
          <label>
            Adresse:
            <input
              type="text"
              name="address"
              value={editData.address}
              onChange={handleEditChange}
              required
            />
          </label>

          <label>
            Status:
            <select
              name="status"
              value={editData.status}
              onChange={handleEditChange}
            >
              <option value="Interessiert">Interessiert</option>
              <option value="Kontaktiert">Kontaktiert</option>
              <option value="Besichtigung geplant">Besichtigung geplant</option>
              <option value="Abgelehnt">Abgelehnt</option>
            </select>
          </label>

          <label>
            Notizen:
            <textarea
              name="description"
              value={editData.description || ''}
              onChange={handleEditChange}
              rows="3"
            />
          </label>

          <div className="rent-fields-edit">
            <label>
              Kaltmiete (€):
              <input
                type="number"
                name="rent"
                value={editData.rent}
                onChange={handleEditChange}
                step="0.01"
              />
            </label>

            <label>
              Nebenkosten (€):
              <input
                type="number"
                name="extra_costs"
                value={editData.extra_costs}
                onChange={handleEditChange}
                step="0.01"
              />
            </label>

            <label>
              Warmmiete (€):
              <input
                type="number"
                name="total_rent"
                value={editData.total_rent}
                onChange={handleEditChange}
                step="0.01"
                readOnly
                style={{ backgroundColor: 'var(--secondary-focus)', cursor: 'not-allowed' }}
              />
            </label>
          </div>

          <div className="listing-actions">
            <button onClick={handleSave} className="contrast">Speichern</button>
            <button onClick={handleCancel} className="secondary">Abbrechen</button>
          </div>
        </div>
      ) : (
        <>
          {listing.description && isSelected && (
            <p className="listing-description-expanded">{listing.description}</p>
          )}
          
          {listing.url && (
            <p>
              <a 
                href={listing.url} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
              >
                Anzeige ansehen →
              </a>
            </p>
          )}

          <div className="listing-actions" onClick={e => e.stopPropagation()}>
            <button onClick={handleEdit} className="contrast">Bearbeiten</button>
            <button onClick={handleDelete} className="secondary">Löschen</button>
          </div>
        </>
      )}
    </article>
  )
}

export default ListingCard