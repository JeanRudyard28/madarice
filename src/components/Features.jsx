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
    description: "Felana est disponible 24h/24, 7j/7 pour répondre à vos questions."
  },
  {
    icon: "🎯",
    title: "Réponses précises et fiables",
    description: "Aucune information inventée — si la réponse n'est pas dans la base, Felana le dit."
  }
]

const Features = () => {
  return (
    <section id="features" className="px-8 py-32">
      <h2 className="text-3xl font-bold text-white text-center mb-4">
        Tout ce dont vous avez besoin
      </h2>
      <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">
        Un assistant simple, fiable et toujours disponible pour accompagner votre culture du riz.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {features.map((feature, index) => (
          <div key={index} className="bg-black border border-white/10 rounded-2xl p-6 hover:border-cyan-400/40 transition">
            <span className="text-3xl">{feature.icon}</span>
            <h3 className="text-white font-semibold mt-4 mb-2">{feature.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Features
