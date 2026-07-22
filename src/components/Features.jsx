const features = [
  {
    icon: "📄",
    title: "Basé sur des documents experts",
    description: "Toutes les réponses sont tirées d'une base documentaire agricole fiable et spécialisée."
  },
  {
    icon: "🌾",
    title: "Spécialisé riziculture Madagascar",
    description: "Conçu spécifiquement pour les pratiques et conditions agricoles malagasy."
  },
  {
    icon: "⚡",
    title: "Accessible sans compte",
    description: "Commencez à poser vos questions immédiatement, sans inscription requise."
  },
  {
    icon: "💬",
    title: "Historique sauvegardé",
    description: "Connectez-vous pour retrouver toutes vos conversations précédentes."
  },
  {
    icon: "🕐",
    title: "Disponible à tout moment",
    description: "Riziculture Solutions est disponible 24h/24, 7j/7 pour répondre à vos questions."
  },
  {
    icon: "🎯",
    title: "Réponses précises et fiables",
    description: "Aucune information inventée — si la réponse n'est pas dans la base, Riziculture Solutions le dit."
  }
]

const Features = () => {
  return (
    <section id="features">
      <div className="features-section">
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '0' }}>
          <div className="section-label" style={{ justifyContent: 'center', marginBottom: '0.75rem' }}>
            ✦ Fonctionnalités
          </div>
          <h2 className="section-title">Tout ce dont vous avez besoin</h2>
          <p className="section-desc" style={{ margin: '0 auto' }}>
            Un assistant simple, fiable et toujours disponible pour 
            accompagner votre culture du riz.
          </p>
        </div>

        {/* Cards grid */}
        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card animate-fade-in-up"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
