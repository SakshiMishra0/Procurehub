import { motion, useScroll, useSpring } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ParallaxProvider } from "react-scroll-parallax";
import { Zap, Eye, Flag } from "lucide-react";

// Card content
const cardData = [
  {
    title: "NTPC Vision",
    content: "To be the world’s leading power company, lighting the future with innovation, reliability, and sustainability.",
    Icon: Eye,
  },
  {
    title: "NTPC Mission",
    content: "Provide reliable power and related solutions in an efficient, eco-friendly manner, driven by technology, innovation, and a passion for excellence.",
    Icon: Zap,
  },
  {
    title: "NTPC Purpose",
    content: "To energize India’s growth by delivering excellence in power generation and value creation for stakeholders.",
    Icon: Flag,
  },
];

// Scroll progress bar
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gray-800 origin-left z-50"
      style={{ scaleX }}
    />
  );
};

// Hero section
const HeroSection = () => (
  <section className="min-h-[70vh] flex flex-col justify-center items-center text-center bg-white px-6 py-20">
    <div className="max-w-4xl">
      <motion.h1
        className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Welcome to <span className="text-blue-600">ProcureHub</span>
      </motion.h1>
      <motion.p
        className="text-lg md:text-xl text-gray-600"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        A transparent procurement ecosystem built for industrial excellence. Connect customers, vendors, and admins with smart quoting, approvals, and billing.
      </motion.p>
    </div>
  </section>
);

// Features section with 3 cards in a row
const FeaturesSection = () => {
  return (
    <section className="bg-gray-50 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {cardData.map(({ title, content, Icon }, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-md border border-gray-200 text-center flex flex-col items-center"
            >
              <div className="p-4 mb-4 rounded-full bg-gray-100">
                <Icon className="w-10 h-10 text-gray-700" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">{title}</h3>
              <p className="text-gray-600 text-base">{content}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// CTA Section
const CallToAction = () => (
  <section className="bg-white py-20 px-6 text-center border-t border-gray-200">
    <div className="max-w-2xl mx-auto">
      <motion.h3
        className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Ready to Streamline Your Procurement?
      </motion.h3>
      <motion.p
        className="text-lg text-gray-600 mb-8"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Join NTPC's mission-driven platform and power your business with trust and transparency.
      </motion.p>
      <motion.a
        href="/contact"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Contact Us
      </motion.a>
    </div>
  </section>
);

// Main Page Component
export default function About() {
  return (
    <ParallaxProvider>
      <div className="overflow-x-hidden scroll-smooth font-sans bg-gray-50">
        <ScrollProgress />
        <HeroSection />
        <FeaturesSection />
        <CallToAction />
      </div>
    </ParallaxProvider>
  );
}
