const Hero = () => {
  return (
    <section className="relative flex flex-col items-center justify-center text-center px-8 py-52 overflow-hidden">
      
      {/* Blob décoratif */}
      <div className="absolute w-3xl h-96 bg-cyan-300 rounded-full blur-3xl opacity-30  left-1/2 -translate-x-1/2 " />
      
      <h1 className="relative text-5xl font-bold text-cyan-400 max-w-2xl leading-tight">
        L'assistant agricole qui connaît vos rizières
      </h1>
      
      <p className="relative mt-4 text-gray-500 text-lg max-w-xl">
        Posez vos questions, obtenez des réponses précises basées sur des 
        connaissances agricoles locales et expertes.
      </p>

      <div className="relative mt-8 flex items-center gap-4">
        <a href="/chat" className="bg-cyan-600 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-cyan-700 transition">
          Commencer maintenant
        </a>
        <a href="#features" className="text-sm text-gray-500 hover:text-cyan-600 transition">
          En savoir plus →
        </a>
      </div>

    </section>
  )
}

export default Hero
