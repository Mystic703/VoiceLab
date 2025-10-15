import React from 'react'
import './Home.css'
import Navbar from '../../components/Navbar/navbar'
import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react'
import * as reactSpring from '@react-spring/three'
import AnimatedContent from '../../animations/scroll_down_animatio/AnimatedContent'
import TextArea from '../../components/TextArea/TextArea'
const Home = () => {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <ShaderGradientCanvas
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
        }}
          pointerEvents='none'
        >
        <ShaderGradient
          control='query'
          urlString='https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=1.2&cAzimuthAngle=170&cDistance=4.4&cPolarAngle=70&cameraZoom=1&color1=%23ffffff&color2=%236bf5ff&color3=%2394ffd1&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=off&lightType=3d&pixelDensity=1&positionX=0&positionY=0.9&positionZ=-0.3&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=45&rotationY=0&rotationZ=0&shader=defaults&type=waterPlane&uAmplitude=0&uDensity=1.2&uFrequency=0&uSpeed=0.2&uStrength=3.4&uTime=0&wireframe=false'
        />
      </ShaderGradientCanvas>
      <Navbar/>
      <div style={{ position: 'relative', zIndex: 1, color: 'white', padding: '2rem' }}>
        <div className="call-to-action">
          <div className="text">
            <h1 className='title'>Every Word Deserves a Voice That Feels Alive</h1>
            <p>Our AI turns plain text into deeply expressive, human-sounding speech that resonates with listeners.</p>
          </div>
          <div className="buttons">
            <button>Try It Now</button>
            <button>Contact Us</button>
          </div>
        </div>
        <AnimatedContent
          distance={100}
          direction="vertical"
          reverse={false}
          duration={0.8}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          scale={1}
          threshold={0.1}
          delay={0}
        >
          <section className="how-it-works">
            <h2>How It Works</h2>
            <div className="steps">
              <div className="step">
                <h3>1. Type Your Text</h3>
                <p>Enter any text, from a few words to full scripts.</p>
              </div>
              <div className="step">
                <h3>2. Choose a Voice</h3>
                <p>Select from a library of expressive AI voices.</p>
              </div>
              <div className="step">
                <h3>3. Generate Speech</h3>
                  <p>Click once and hear your words come to life instantly.</p>
              </div>
            </div>
            <AnimatedContent
              distance={100}
              direction="vertical"
              reverse={false}
              duration={0.8}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              scale={1}
              threshold={0.1}
              delay={0}
            >
            <div className="try-it-container" style={{ marginTop: '3rem' }}>
              <h3>Try it yourself</h3>
              <TextArea placeholder="Type something to generate speech..." />
            </div>
            </AnimatedContent>
          </section>
        </AnimatedContent>
      </div>
    </div>
  )
}

export default Home
