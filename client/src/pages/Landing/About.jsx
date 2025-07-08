import { motion, useScroll, useSpring } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ParallaxProvider, Parallax } from "react-scroll-parallax";
import { Zap, Eye, Flag, Building2 } from "lucide-react";

const gradients = [
  "from-blue-900 via-indigo-800 to-purple-900",
  "from-green-900 via-emerald-700 to-teal-800",
  "from-yellow-700 via-orange-600 to-red-700",
  "from-zinc-800 via-slate-700 to-gray-900",
];

const iconMap = [Zap, Eye, Flag, Building2];

const sectionVariants = (direction = "left") => ({
  hidden: {
    opacity: 0,
    x: direction === "left" ? -100 : 100,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 1, ease: "easeOut" },
  },
});

const MotionSection = ({ title, content, index, direction = "left" }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const Icon = iconMap[index % iconMap.length];
  const gradient = gradients[index % gradients.length];

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${gradient} transition-all duration-1000`}
    >
      <motion.div
        ref={ref}
        variants={sectionVariants(direction)}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="relative z-10 max-w-4xl w-full text-white px-8 py-12 backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl border border-white/20"
      >
        <Parallax speed={index % 2 === 0 ? -10 : 10}>
          <motion.div
            className="flex justify-center mb-6"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
          >
            <Icon className="w-16 h-16 text-white animate-pulse" />
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-center"
            initial={{ y: 30, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {title}
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl leading-relaxed text-white/90 text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.4 }}
          >
            {content}
          </motion.p>
        </Parallax>
      </motion.div>
    </div>
  );
};

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 to-purple-600 origin-left z-50"
      style={{ scaleX }}
    />
  );
};

export default function About() {
  return (
    <ParallaxProvider>
      <div className="overflow-x-hidden scroll-smooth bg-black text-white">
        <ScrollProgress />

        <MotionSection
          title="Welcome to ProcureHub"
          content="A transparent procurement ecosystem built for industrial excellence. Seamlessly connects Customers, Vendors, and Admins with smart quoting, approvals, and billing."
          index={0}
          direction="left"
        />

        <MotionSection
          title="NTPC Vision"
          content="To be the world’s leading power company, lighting the future with innovation, reliability, and sustainability."
          index={1}
          direction="right"
        />

        <MotionSection
          title="NTPC Mission"
          content="Provide reliable power and related solutions in an efficient, eco-friendly manner, driven by technology, innovation, and a passion for excellence."
          index={2}
          direction="left"
        />

        <MotionSection
          title="NTPC Purpose"
          content="To energize India’s growth by delivering excellence in power generation and value creation for stakeholders."
          index={3}
          direction="right"
        />
      </div>
    </ParallaxProvider>
  );
}
