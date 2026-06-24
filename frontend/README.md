# Gym Management Frontend

A modern, responsive React + Vite frontend for gym membership management system.

## Features

✨ **Complete Membership Management**
- View all memberships in a responsive table
- Create new memberships with customer search
- Edit membership status and type
- Delete memberships with confirmation
- Real-time updates after actions

🔐 **Authentication System**
- User registration and login
- JWT token-based authentication
- Auto token refresh
- Protected routes

🎨 **Modern UI/UX**
- Built with Tailwind CSS
- Responsive design (mobile, tablet, desktop)
- Loading states and error handling
- Toast notifications for all actions
- Color-coded status badges (Green = Active, Red = Expired)

📊 **Dashboard Features**
- Statistics cards (Total, Active, Expired)
- Advanced filtering by status
- Search by membership ID
- Professional table layout

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool & dev server
- **Axios** - HTTP client
- **React Router v6** - Routing
- **Tailwind CSS** - Styling
- **React Hot Toast** - Notifications

## Installation

### Prerequisites
- Node.js (v16+)
- npm or pnpm
- Backend server running on `http://localhost:3000`

### Steps

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** (if needed)
   ```env
   VITE_API_URL=http://localhost:3000
   VITE_APP_NAME=Gym Management System
   ```

5. **Start development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

The app will open automatically at `http://localhost:5173`

## Build for Production

```bash
npm run build
# or
pnpm build
```

This creates an optimized build in the `dist` folder.

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── Navbar.jsx
│   │   ├── MembershipTable.jsx
│   │   ├── CreateMembershipModal.jsx
│   │   ├── EditMembershipModal.jsx
│   │   ├── DeleteConfirmModal.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/               # Page components
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   └── DashboardPage.jsx
│   ├── context/             # React context
│   │   └── AuthContext.jsx
│   ├── services/            # API services
│   │   ├── api.js           # Axios instance with interceptors
│   │   └── index.js         # Service functions
│   ├── App.jsx              # Main app component with routing
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS config
├── postcss.config.js        # PostCSS config
├── package.json
└── README.md
```

## API Integration

The frontend connects to your Express backend API:

### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh token
- `DELETE /auth/logout` - User logout

### Membership Endpoints
- `GET /membership` - Get all memberships
- `GET /membership/me` - Get user's memberships
- `POST /membership` - Create membership
- `PATCH /membership/status` - Change membership status
- `PATCH /membership/type` - Change membership type

### Customer Endpoints
- `GET /customer` - Get all customers
- `GET /customer/search/:search` - Search customer
- `POST /customer` - Create customer
- `PATCH /customer/:id` - Update customer
- `DELETE /customer` - Delete customer

## Features in Detail

### 1. Authentication
- Register new account or login with existing credentials
- JWT tokens stored in localStorage
- Auto-refresh tokens on expiration
- Redirects to login on unauthorized access

### 2. Dashboard
- View statistics (total, active, expired memberships)
- Search memberships by ID
- Filter by status (All, Active, Expired, Pending)
- Real-time updates after any action

### 3. Membership Management
- **Create**: Open modal, search for customer, select type, and submit
- **Edit**: Modify status and type in-place
- **Delete**: Confirm before deleting
- **Auto-refresh**: Table updates immediately after changes

### 4. Error Handling
- Clear error messages from API
- Toast notifications for user feedback
- Graceful fallbacks for failed requests

## Customization

### Colors
Edit `tailwind.config.js` to customize theme colors:
```js
colors: {
  primary: '#6366f1',
  secondary: '#ec4899',
  danger: '#ef4444',
  success: '#10b981',
}
```

### API URL
Update in `.env` file:
```env
VITE_API_URL=http://your-backend-url:3000
```

## Troubleshooting

### CORS Issues
If you see CORS errors, ensure your backend has proper CORS configuration:
```js
// In backend index.js
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
```

### API Connection Issues
1. Check backend is running on the correct port (default: 3000)
2. Verify `VITE_API_URL` in `.env` matches your backend URL
3. Check browser console for error messages

### Login Issues
1. Verify backend database has users table
2. Check if registration creates users properly
3. Review backend auth controller logs

## Development Tips

1. **Hot Module Replacement (HMR)**: Changes auto-reload in browser
2. **React DevTools**: Install browser extension for debugging
3. **Network Tab**: Check API requests in browser dev tools
4. **Console Logs**: Use browser console to debug issues

## Performance Optimization

- Lazy loading with React Router
- Optimized re-renders with useMemo
- Efficient API calls with Axios interceptors
- CSS optimization with Tailwind CSS purging

## Security Notes

- Access tokens stored in localStorage (consider using httpOnly cookies)
- CSRF protection via token validation
- Input validation on forms
- Protected routes for authenticated pages

## Future Enhancements

- Add payment history view
- Membership renewal reminders
- Email notifications
- Dark mode toggle
- Membership pricing tiers
- Advanced analytics dashboard
- Export membership data to CSV
- Multi-language support

## License

MIT License - Feel free to use for personal or commercial projects

## Support

For issues or questions, please check:
1. Backend logs for API errors
2. Browser console for frontend errors
3. Backend database connection status
