import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        
        {/* Bouncing "Oops" */}
        <motion.div
          className="mb-6 text-blue-600 font-bold text-6xl"
          animate={{ y: [0, -20, 0] }} // Bouncing animation
          transition={{ repeat: Infinity, repeatType: "loop", duration: 1 }}
        >
          Oops!
        </motion.div>
        
        <h2 className="text-3xl font-semibold text-gray-900 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-4">
          The page you are looking for might have been moved or deleted.
        </p>
        
        {/* Interactive Hover Element (Button) */}
        <motion.div
          whileHover={{ scale: 1.1 }} // Hover effect to make the button scale up
          whileTap={{ scale: 0.95 }} // Tap effect (click animation)
        >
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Go Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
