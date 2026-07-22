const Hero = () => {
  return (
    <section className="hero">
      {/* Background glows */}
      <div className="hero-bg-glow glow-1" />
      <div className="hero-bg-glow glow-2" />

      {/* Badge */}
      <div className="hero-badge animate-fade-in-up">
        Assistant Rizicole Intelligent · Madagascar
      </div>

      {/* Title */}
      <h1 className="hero-title animate-fade-in-up delay-100">
        <span className="gradient-text">L'assistant agricole</span>
        <br />
        qui connaît vos rizières
      </h1>

      {/* Subtitle */}
      <p className="hero-subtitle animate-fade-in-up delay-200">
        Posez vos questions, obtenez des réponses précises basées sur des 
        connaissances agricoles locales et expertes.
      </p>

      {/* CTA Buttons */}
      <div className="hero-cta animate-fade-in-up delay-300">
        <a href="/chat" className="btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>
          🌾 Commencer maintenant
        </a>
        <a href="#features" className="btn-secondary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
          En savoir plus ↓
        </a>
      </div>

      {/* Scroll indicator */}
      {/* <div className="hero-scroll animate-fade-in delay-500">
        <span>Découvrir</span>
        <div className="hero-scroll-line" />
      </div> */}
    </section>
  )
}

export default Hero
