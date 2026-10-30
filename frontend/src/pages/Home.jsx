import React from 'react'
import Hero from '../components/Hero'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewSletterBox'
import ImageSlider from './ImageSlider'
import NewCollection from '../components/NewCollection'
import FeatureProduct from '../components/SplitFeature'
import SplitFeature from '../components/SplitFeature'

const Home = () => {
  return (
    <div>
      <ImageSlider/>
      
      <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]' >
      {/* <NewCollection/> */}
      {/* <SplitFeature
        title="THE CAVARALY HOODIE"
        subtitle="" // Based on image_de827c.jpg subtitle
        imageUrl="src/assets/frontend_assets/CAVARLY.jpg" // Use the image on the right
        linkUrl="/product/aaaab"
      /> */}
      <BestSeller/>
      <OurPolicy/>
      <NewsletterBox/>

      </div>
    </div>
  )
}

export default Home