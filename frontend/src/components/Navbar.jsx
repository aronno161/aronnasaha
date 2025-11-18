import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 w-full bg-white shadow-md z-50"
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800">
          Aronna Saha
        </Link>
        <div className="space-x-6">
          <Link to="/" className="text-gray-600 hover:text-gray-800">Home</Link>
          <Link to="/projects" className="text-gray-600 hover:text-gray-800">Projects</Link>
          <Link to="/services" className="text-gray-600 hover:text-gray-800">Services</Link>
          <Link to="/contact" className="text-gray-600 hover:text-gray-800">Contact</Link>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;