# Lotto Checker - Admin Website

A lottery checker web application for lotto seller admin to manage purchases and set purchase limits.

## Features

- **Input Page**: Enter lotto numbers (2-digit: 00-99 or 3-digit: 000-999) with prices (0-10000)
- **Summary Page**: View total purchases for each number with highlighting when limits are exceeded
- **Admin Page**: Set purchase limits for individual lotto numbers

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (connection string should be in environment variables)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env.local` file in the root directory:
```
MONGODB_URI=your_mongodb_connection_string
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Pages

### Input Page (`/`)
- Select lotto type (2-digit or 3-digit)
- Enter number and price
- Submit purchase records

### Summary Page (`/summary`)
- View all purchases grouped by type
- See total purchase amount for each number
- Highlights numbers that exceed their limits (red background)
- Auto-refreshes every 5 seconds

### Admin Page (`/admin`)
- Set purchase limits for specific numbers
- View all current limits
- Delete limits

## Technology Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **MongoDB/Mongoose** - Database
- **Tailwind CSS** - Styling
- **PrimeReact** - UI component library
- **PrimeIcons** - Icon library

## Project Structure

```
app/
  api/
    purchases/    # API for creating purchases
    summary/      # API for getting purchase summary
    limits/       # API for managing purchase limits
  admin/          # Admin page for setting limits
  summary/        # Summary page
  page.tsx        # Input page
lib/
  models/         # MongoDB models
    Purchase.ts
    PurchaseLimit.ts
  mongodb.ts      # Database connection
components/
  Navigation.tsx  # Navigation component
  PrimeReactProvider.tsx  # PrimeReact provider wrapper
```

## Deployment

### Deploy to Vercel

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/lotto-checker.git
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variable:
     - `MONGODB_URI`: Your MongoDB connection string
   - Click "Deploy"

3. **Environment Variables in Vercel**:
   - Go to Project Settings → Environment Variables
   - Add `MONGODB_URI` with your MongoDB connection string
   - Redeploy if needed

The application will automatically deploy on every push to the main branch.

