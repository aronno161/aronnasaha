import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Services from './pages/Services';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminMessages from './pages/AdminMessages';
import AdminProjects from './pages/AdminProjects';
import AdminAnalytics from './pages/AdminAnalytics';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Home />
            <Footer />
          </div>
        } />
        <Route path="/projects" element={
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Projects />
            <Footer />
          </div>
        } />
        <Route path="/services" element={
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Services />
            <Footer />
          </div>
        } />
        <Route path="/contact" element={
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Contact />
            <Footer />
          </div>
        } />

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/verify/:token" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/messages" element={<AdminMessages />} />
        <Route path="/admin/projects" element={<AdminProjects />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
      </Routes>
    </Router>
  );
}

export default App;