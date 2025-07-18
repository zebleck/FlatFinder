// Translation mappings for status values
export const statusTranslations = {
  'Interested': 'Interessiert',
  'Contacted': 'Kontaktiert',
  'Viewing Scheduled': 'Besichtigung geplant',
  'Rejected': 'Abgelehnt'
}

// Reverse mapping for German to English
export const statusReverseTranslations = {
  'Interessiert': 'Interested',
  'Kontaktiert': 'Contacted',
  'Besichtigung geplant': 'Viewing Scheduled',
  'Abgelehnt': 'Rejected'
}

// Translate English status to German for display
export const translateStatusToGerman = (englishStatus) => {
  return statusTranslations[englishStatus] || englishStatus
}

// Translate German status to English for storage
export const translateStatusToEnglish = (germanStatus) => {
  return statusReverseTranslations[germanStatus] || germanStatus
}

// Get all German status options for dropdowns
export const getGermanStatusOptions = () => {
  return Object.values(statusTranslations)
}

// Get all English status options for storage
export const getEnglishStatusOptions = () => {
  return Object.keys(statusTranslations)
}