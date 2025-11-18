import { motion } from 'framer-motion';

const Services = () => {
  const services = [
    {
      title: 'Web Development',
      description: 'Building responsive and modern websites using the latest technologies.',
      icon: '🌐'
    },
    {
      title: 'Web App Building',
      description: 'Creating full-stack web applications with robust backend and frontend.',
      icon: '🚀'
    },
    {
      title: 'UI/UX Upgrades',
      description: 'Improving user interfaces and experiences for better engagement.',
      icon: '🎨'
    },
    {
      title: 'Bug Fixing',
      description: 'Identifying and resolving issues to ensure smooth application performance.',
      icon: '🔧'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">My Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            I offer a range of services to help bring your ideas to life.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;