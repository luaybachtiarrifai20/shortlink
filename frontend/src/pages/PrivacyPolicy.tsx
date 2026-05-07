export default function PrivacyPolicy() {
  return (
    <div className="pt-32 pb-20 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <div className="glass p-8 rounded-3xl space-y-6 text-slate-300 leading-relaxed">
          <p className="text-sm text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Information We Collect</h2>
          <p>
            When you use our URL shortening service, we collect certain information to provide and 
            improve our service. This includes:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>The original URLs you submit to be shortened.</li>
            <li>Account information when you sign in via Google.</li>
            <li>Anonymous click analytics for the links you generate.</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide, maintain, and improve our services.</li>
            <li>Provide you with click analytics for your shortened links.</li>
            <li>Protect our platform from abuse, spam, and malicious activity.</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information against 
            unauthorized access, alteration, disclosure, or destruction. However, please note that 
            no method of transmission over the internet or method of electronic storage is 100% secure.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Third-Party Links</h2>
          <p>
            Our service generates links that direct to third-party websites. We are not responsible 
            for the privacy practices or the content of those third-party websites.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us through our 
            support channels.
          </p>
        </div>
      </div>
    </div>
  );
}
