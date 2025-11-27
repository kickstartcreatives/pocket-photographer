export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header with gradient */}
      <header className="header-gradient text-white py-12 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Pocket Photographer
          </h1>
          <p className="text-lg md:text-xl opacity-90">
            It's like having a master photographer in your pocket.
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text-primary mb-4">
            Master Professional Photography Terms for AI Image Generation
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Learn pro photography terminology to create stunning AI images. Browse 100+ photo terms with examples and usage tips.
          </p>
        </div>

        {/* Main Feature Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <a href="/dictionary" className="card hover:shadow-lg transition group">
            <div className="text-5xl mb-4 text-center">📖</div>
            <h3 className="text-2xl font-bold mb-3 text-center group-hover:text-orange transition">Browse Dictionary</h3>
            <p className="text-text-secondary mb-3">
              Explore 100+ professional photography terms organized by category—from aperture settings like <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">f/1.4</span> to lighting techniques like <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">golden hour</span>. Each term includes plain-English explanations and what it does to your image.
            </p>
            <p className="text-text-secondary text-sm mb-4">
              See best use cases and ready-to-use prompt examples for every term. Click terms to add them to your custom prompt builder, then copy your complete prompt to use in any AI image tool.
            </p>
            <div className="text-center">
              <span className="btn-primary inline-block">Get Started →</span>
            </div>
          </a>

          <a href="/prompts" className="card hover:shadow-lg transition group">
            <div className="text-5xl mb-4 text-center">⚡</div>
            <h3 className="text-2xl font-bold mb-3 text-center group-hover:text-orange transition">View Prompt Library</h3>
            <p className="text-text-secondary mb-3">
              See real AI images alongside the exact photography terms and complete prompts that created them. Each example includes the result image, photography terminology used, and the full AI prompt.
            </p>
            <p className="text-text-secondary text-sm mb-4">
              Copy complete prompts with one click and paste directly into Midjourney, Nano Banana, or any AI image tool. Learn by example which terms create the results you want.
            </p>
            <div className="text-center">
              <span className="btn-primary inline-block">Browse Prompts →</span>
            </div>
          </a>
        </div>
      </main>
    </div>
  );
}
