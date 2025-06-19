import Hero from "../components/Hero.jsx";
import AboutUs from "../components/AboutUs";
import FeaturedPrograms from "../components/FeaturedPrograms";
import NewsEvents from "../components/NewsEvents";
import Gallery from "../components/Gallery";
import Contact from "../components/Contact";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <FeaturedPrograms />
      <AboutUs />
      <NewsEvents />
      <Gallery />
      <Contact />
      <Footer />
    </main>
  );
}
