export const geocodeAddress = async (address) => {
  try {
    const encodedAddress = encodeURIComponent(address)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`
    )
    
    if (!response.ok) {
      throw new Error('Geocoding request failed')
    }
    
    const data = await response.json()
    
    if (data && data.length > 0) {
      const result = data[0]
      return {
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
        display_name: result.display_name
      }
    }
    
    return null
  } catch (error) {
    console.error('Geocoding error:', error)
    return null
  }
}