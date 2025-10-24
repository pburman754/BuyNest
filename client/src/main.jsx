import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // 1. Import
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  // We can remove StrictMode for now if we want, but it's fine to keep
  <BrowserRouter>
    <AuthProvider> {/* 2. Wrap your App */}
      <App />
    </AuthProvider>
  </BrowserRouter>
);