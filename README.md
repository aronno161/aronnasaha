# Aronna Saha - Portfolio Website

A modern, smooth-motion personal portfolio website built with Node.js backend and React frontend.

## Features

- **Responsive Design**: Fully responsive across all devices
- **Smooth Animations**: Powered by Framer Motion
- **Modern UI**: Clean design with Tailwind CSS
- **Performance Optimized**: Lazy loading, caching, and optimized bundles
- **SPA Routing**: Client-side routing with React Router
- **Admin Panel**: Complete admin dashboard for managing content and analytics
- **Contact Form**: Functional contact form with database storage
- **Dynamic Projects**: Projects managed through admin panel
- **Visitor Analytics**: Track site visitors and page views

## Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: React + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Routing**: React Router DOM

## Project Structure

```
aronno-saha-portfolio/
├── server.js                 # Express server
├── package.json             # Root dependencies
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── package.json        # Frontend dependencies
│   ├── vite.config.js      # Vite configuration
│   └── tailwind.config.js  # Tailwind configuration
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aronno-saha-portfolio
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   npm run install-client
   ```

### Development

1. **Start the development server**
   ```bash
   npm run dev
   ```

   This will start both the Express server and Vite dev server concurrently.

2. **Open your browser**

   Navigate to `http://localhost:3000`

### Production Build

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## Deployment

### Vercel Deployment (Recommended)

This app is fully configured for Vercel deployment with both frontend and backend.

#### Step 1: Prepare for Deployment
```bash
# Make sure everything builds correctly
npm run build
```

#### Step 2: Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Step 3: Set Environment Variables in Vercel Dashboard
Go to your Vercel project dashboard and add these environment variables:

```
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
FRONTEND_URL=https://your-vercel-app-url.vercel.app
NODE_ENV=production
```

#### Step 4: Update MongoDB Network Access
Add Vercel's IP addresses to your MongoDB whitelist:
- `0.0.0.0/0` (allow all) - OR specific Vercel IPs

### Alternative Deployment Platforms

- **Render** - Full stack deployment
- **Railway** - Full stack deployment
- **Heroku** - Full stack deployment

### Environment Variables

Create a `.env` file in the root directory with:

```env
MONGODB_URI=mongodb://localhost:27017/aronno-portfolio
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3000
NODE_ENV=development
```

For production, set:

- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure random string for JWT tokens
- `PORT`: Server port (default: 3000)

## Available Scripts

- `npm start`: Start production server
- `npm run dev`: Start development servers
- `npm run server`: Start Express server only
- `npm run client`: Start Vite dev server only
- `npm run build`: Build frontend for production
- `npm run install-client`: Install frontend dependencies

## Pages

- `/`: Home page with Hero, About, Projects, Services sections
- `/projects`: Projects showcase page
- `/services`: Services offered page
- `/contact`: Contact form and information

## Admin Panel

Access the admin panel at `/admin/login` with default credentials:
- **Email**: admin@aronnosaha.com
- **Password**: admin123

**⚠️ Important**: Change the default password in `routes/admin.js` before deploying!

### Admin Features

- **Dashboard**: Overview of messages, projects, and statistics
- **Messages**: View, mark as read, and delete contact form submissions
- **Projects**: Add, edit, and delete projects with full CRUD operations
- **Analytics**: Track visitor statistics, page views, and referrers

### Database Models

- **ContactMessage**: Stores contact form submissions
- **Project**: Stores project information
- **Visitor**: Tracks site analytics

## Customization

- Update personal information in the components
- Modify colors in `tailwind.config.js`
- Add real project images and links
- Update contact information and social links

## Performance Features

- Lazy loading for images
- Static file caching
- Optimized bundle with Vite
- Minimal dependencies for fast loading

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details