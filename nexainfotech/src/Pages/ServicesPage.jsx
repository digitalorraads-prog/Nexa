import React from 'react'
import ServicesLinks from '../Component/sections/services/ServicesLinks'
import ServiceHero from '../Component/sections/services/ServiceHero'
import CaseStudies from '../Component/sections/services/CaseStudies'
import ServicesCTA from '../Component/sections/services/ServicesCTA'


// import ServicesList from '../Component/sections/services/ServicesList'

function ServicesPage() {
  return (
    <div>
<ServiceHero />
{/* <ServicesList />   */}
<ServicesLinks />
<CaseStudies/>
<ServicesCTA/>



    </div>
  )
}

export default ServicesPage
