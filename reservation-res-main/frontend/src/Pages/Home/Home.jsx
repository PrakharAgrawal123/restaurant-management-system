import React, { useEffect } from 'react'
import HeroSection from '../../components/HeroSection'
import About from '../../components/About'
import Qualities from '../../components/Qualities'
import Menu from '../../components/Menu'
import WhoAreWe from '../../components/WhoAreWe'
import Team from '../../components/Team'
import Reservation from '../../components/Reservation'
import Testimonials from '../../components/Testimonials'
import Footer from '../../components/Footer'
import { scroller } from "react-scroll"

const Home = () => {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // hash is in the format #sectionName (e.g. #about)
      const target = hash.replace("#", "");
      setTimeout(() => {
        scroller.scrollTo(target, {
          duration: 800,
          delay: 0,
          smooth: "easeInOutQuart",
          offset: -80 // Offset for the fixed/sticky navbar
        });
      }, 200);
    }
  }, []);

  return (
    <>
      <HeroSection/>
      <About/>
      <Qualities/>
      <Menu/>
      <WhoAreWe/>
      <Team/>
      <Testimonials/>
      <Reservation/>
      <Footer/>
    </>
  )
}

export default Home
