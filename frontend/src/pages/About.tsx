export default function About() {
  return (
    <div className="pt-32 pb-20 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">About Us</h1>
        <div className="glass p-8 rounded-3xl space-y-6 text-slate-300 leading-relaxed">
          <p>
            Welcome to ShortLink Pro, your ultimate solution for link management and optimization. 
            We built this platform with a simple mission: to help individuals and businesses take 
            control of their digital footprint through powerful, trackable, and branded short links.
          </p>
          <p>
            In today's digital landscape, a long, clunky URL can be the difference between a click 
            and a scroll past. We provide the tools to make your links clean, memorable, and 
            actionable, complete with analytics to help you understand your audience better.
          </p>
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Our Values</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li><strong>Speed:</strong> We ensure our redirection is lightning-fast globally.</li>
            <li><strong>Reliability:</strong> Built on top-tier cloud infrastructure to guarantee uptime.</li>
            <li><strong>Privacy:</strong> We respect user data and adhere to strict privacy standards.</li>
            <li><strong>Innovation:</strong> Continuously adding new tools and features to empower our users.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
