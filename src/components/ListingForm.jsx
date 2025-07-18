import React, { useState } from 'react'
import { translateStatusToEnglish, translateStatusToGerman } from '../utils/translations'

const ListingForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    address: '',
    url: '',
    description: '',
    status: 'Interested',
    rent: '',
    extra_costs: '',
    total_rent: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    const newData = {
      ...formData,
      [name]: value
    }
    
    // Auto-calculate total rent when rent or extra costs change
    if (name === 'rent' || name === 'extra_costs') {
      const rent = parseFloat(newData.rent) || 0
      const extraCosts = parseFloat(newData.extra_costs) || 0
      newData.total_rent = (rent + extraCosts).toString()
    }
    
    setFormData(newData)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      alert('Titel ist erforderlich')
      return
    }
    if (!formData.address.trim()) {
      alert('Adresse ist erforderlich')
      return
    }
    
    // Convert German status to English for storage
    const dataToSubmit = {
      ...formData,
      status: translateStatusToEnglish(formData.status)
    }
    
    await onSubmit(dataToSubmit)
    
    setFormData({
      title: '',
      address: '',
      url: '',
      description: '',
      status: 'Interested',
      rent: '',
      extra_costs: '',
      total_rent: ''
    })
  }

  return (
    <form onSubmit={handleSubmit} className="listing-form">
      <h3>Neue Wohnung hinzufügen</h3>
      
      <label htmlFor="title">
        Titel *
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Gemütliche 2-Zimmer-Wohnung"
          required
        />
      </label>

      <label htmlFor="address">
        Adresse *
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Musterstraße 123, 12345 Berlin"
          required
        />
      </label>

      <label htmlFor="url">
        Anzeigen-URL
        <input
          type="url"
          id="url"
          name="url"
          value={formData.url}
          onChange={handleChange}
          placeholder="https://immobilienscout24.de/anzeige"
        />
      </label>

      <label htmlFor="description">
        Beschreibung & Notizen
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Gutes Licht, laute Straße, Kontakt zu Makler Hans Müller"
          rows="3"
        />
      </label>

      <label htmlFor="status">
        Status
        <select
          id="status"
          name="status"
          value={translateStatusToGerman(formData.status)}
          onChange={(e) => setFormData(prev => ({ ...prev, status: translateStatusToEnglish(e.target.value) }))}
        >
          <option value="Interessiert">Interessiert</option>
          <option value="Kontaktiert">Kontaktiert</option>
          <option value="Besichtigung geplant">Besichtigung geplant</option>
          <option value="Abgelehnt">Abgelehnt</option>
        </select>
      </label>

      <div className="rent-fields">
        <label htmlFor="rent">
          Kaltmiete (€/Monat)
          <input
            type="number"
            id="rent"
            name="rent"
            value={formData.rent}
            onChange={handleChange}
            placeholder="1200"
            step="0.01"
          />
        </label>

        <label htmlFor="extra_costs">
          Nebenkosten (€/Monat)
          <input
            type="number"
            id="extra_costs"
            name="extra_costs"
            value={formData.extra_costs}
            onChange={handleChange}
            placeholder="150"
            step="0.01"
          />
        </label>

        <label htmlFor="total_rent">
          Warmmiete (€/Monat)
          <input
            type="number"
            id="total_rent"
            name="total_rent"
            value={formData.total_rent}
            onChange={handleChange}
            placeholder="1350"
            step="0.01"
            readOnly
            style={{ backgroundColor: 'var(--secondary-focus)', cursor: 'not-allowed' }}
          />
        </label>
      </div>

      <button type="submit">Wohnung speichern</button>
    </form>
  )
}

export default ListingForm