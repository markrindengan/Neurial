import { motion } from "framer-motion";
import TubelightNavbar from "@/components/TubelightNavbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Testimonials from "@/components/Testimonials";
import About from "@/components/About";
import BrandPhilosophy from "@/components/BrandPhilosophy";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Floating background blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] left-[10%] w-[30vw] h-[30vw] rounded-full bg-pastel-lavender/10 blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute top-[40%] right-[10%] w-[25vw] h-[25vw] rounded-full bg-pastel-mint/10 blur-[80px]"
        />
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -40, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[10%] left-[20%] w-[35vw] h-[35vw] rounded-full bg-pastel-blue/10 blur-[120px]"
        />
      </div>

      <TubelightNavbar />
      <main className="relative z-[2]">
        <Hero />
        <Services />
        <Portfolio />
        <Testimonials />
        <BrandPhilosophy />
        <About />
      </main>
      <ContactForm />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
