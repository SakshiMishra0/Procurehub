import { Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";

const Contact = () => {
  return (
    <section
      id="contact"
      className="bg-white py-20 px-6 border-t border-gray-200"
    >
      <div className="max-w-3xl mx-auto text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Contact Us
        </motion.h2>

        <motion.p
          className="text-lg text-gray-600 mb-12"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          We'd love to hear from you. Reach out to us through any of the methods
          below.
        </motion.p>

        <div className="flex flex-col md:flex-row justify-center gap-10 text-left">
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-base font-medium text-gray-800">
                support@procurehub.com
              </p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-base font-medium text-gray-800">
                +91 98765 43210
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
