export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header with gradient */}
      <header className="header-gradient text-white py-12 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-montserrat uppercase tracking-wide">
            Pocket Photographer
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
            A master photographer. <em>In your pocket.</em>
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        {/* How It Works */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-center mb-12" style={{color: '#CC4106'}}>
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-teal text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-3">Learn the Terms</h3>
              <p className="text-text-secondary">
                Browse the dictionary and explore photography language with simple definitions and real examples.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-3">Build Your Prompt</h3>
              <p className="text-text-secondary">
                Click any term to add it to your prompt builder. Combine them to shape light, style, and depth.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-3">Copy and Create</h3>
              <p className="text-text-secondary">
                Copy your built prompt and paste it into your favorite AI tool to create more intentional images.
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 my-16 max-w-4xl mx-auto"></div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="card hover:shadow-lg transition text-center flex flex-col px-10">
            <div className="text-6xl mb-4">📖</div>
            <h3 className="text-2xl font-bold mb-3">Browse Dictionary</h3>
            <p className="text-text-secondary mb-6 px-4 flex-grow" style={{textWrap: 'balance'}}>
              Explore 245+ professional photography terms organized by category—from aperture settings like <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">f/1.4</span> to lighting techniques like <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">golden hour</span>. Each term includes plain-English explanations and what it does to your image.
            </p>
            <a href="/dictionary" className="btn-orange inline-block mt-auto">Get Started →</a>
          </div>

          <div className="card hover:shadow-lg transition text-center flex flex-col px-10">
            <div className="text-6xl mb-4">⚡</div>
            <h3 className="text-2xl font-bold mb-3">View Prompt Library</h3>
            <p className="text-text-secondary mb-6 px-4 flex-grow" style={{textWrap: 'balance'}}>
              See finished AI images paired with the exact photography terms and complete prompts that created them. Each example includes the result image, photography terminology used, and the full AI prompt.
            </p>
            <a href="/prompts" className="btn-orange inline-block mt-auto">Browse Prompts →</a>
          </div>
        </div>
      </main>
    </div>
  );
}
