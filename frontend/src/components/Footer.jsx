import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 text-white py-8"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">Aronna Saha</h3>
            <p className="text-gray-400">Web Developer</p>
          </div>
          <div className="flex space-x-4">
            <a
              href="https://github.com/aronna16"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/aronnosaha"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300"
            >
              LinkedIn
            </a>
            <a
              href="mailto:aronnosaha161@gmail.com"
              className="hover:text-gray-300"
            >
              Email
            </a>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-400">
          <p>&copy; 2025 Aronna Saha. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;