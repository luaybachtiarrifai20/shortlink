export default function Blog() {
  return (
    <div className="pt-32 pb-20 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Blog & Updates</h1>
        
        <div className="grid grid-cols-1 gap-8">
          {/* Placeholder Blog Post 1 */}
          <article className="glass p-8 rounded-3xl hover:border-primary-500/50 transition-colors">
            <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
              <span>May 10, 2026</span>
              <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
              <span>New Features</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Introducing Our New URL Analytics Dashboard
            </h2>
            <p className="text-slate-300 mb-6 leading-relaxed">
              We are excited to announce a major overhaul of our analytics dashboard. 
              Now you can track link clicks with more precision, including geographic location, 
              device type, and referral sources. Dive into your data to understand your audience better.
            </p>
            <button className="text-primary-400 font-medium hover:text-primary-300 transition-colors">
              Read more →
            </button>
          </article>

          {/* Placeholder Blog Post 2 */}
          <article className="glass p-8 rounded-3xl hover:border-primary-500/50 transition-colors">
            <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
              <span>May 1, 2026</span>
              <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
              <span>Tips & Tricks</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              How to Maximize Your Reach with Custom Short Links
            </h2>
            <p className="text-slate-300 mb-6 leading-relaxed">
              Did you know that branded short links get up to 39% more clicks than generic ones? 
              In this post, we share our top tips for structuring your URLs and using custom aliases 
              to boost your click-through rates across social media campaigns.
            </p>
            <button className="text-primary-400 font-medium hover:text-primary-300 transition-colors">
              Read more →
            </button>
          </article>
        </div>
      </div>
    </div>
  );
}
