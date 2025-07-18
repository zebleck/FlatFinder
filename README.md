# Flat Finder

A modern web application for tracking and managing apartment listings during your flat hunting journey.

## Features

- **Add Listings**: Create new apartment listings with title, address, URL, rent details, and notes
- **Interactive Map**: View all listings on a map with status-based colored markers
- **Status Tracking**: Track listing status (Interessiert, Kontaktiert, Besichtigung geplant, Abgelehnt)
- **Rent Management**: Track base rent, extra costs, and total rent with automatic calculations
- **Search & Filter**: Easy-to-scan listing cards with expandable descriptions
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React with Vite
- **Database**: Supabase
- **Maps**: Leaflet with OpenStreetMap tiles
- **Styling**: Pico CSS + custom CSS
- **Geocoding**: OpenStreetMap Nominatim API

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd find-a-flat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Create the listings table:
   ```sql
   CREATE TABLE listings (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     created_at TIMESTAMP DEFAULT NOW(),
     title TEXT NOT NULL,
     address TEXT NOT NULL,
     url TEXT,
     description TEXT,
     status TEXT NOT NULL DEFAULT 'Interested',
     rent NUMERIC,
     extra_costs NUMERIC,
     total_rent NUMERIC
   );
   ```

4. **Configure environment variables**
   - Copy `.env.local` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## Usage

1. **Add Listings**: Use the "Wohnung hinzufügen" tab to add new apartment listings
2. **View & Manage**: Switch to "Wohnungen anzeigen" to see all your listings
3. **Map Navigation**: Click on markers to select listings, click anywhere else to deselect
4. **Edit Listings**: Click "Bearbeiten" on any listing card to update details
5. **Track Status**: Update listing status as you progress through your apartment search

## Status Colors

- **Blue**: Interessiert (Interested)
- **Orange**: Kontaktiert (Contacted)
- **Green**: Besichtigung geplant (Viewing Scheduled)
- **Red**: Abgelehnt (Rejected)

## License

MIT License