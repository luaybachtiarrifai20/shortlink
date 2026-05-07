import { Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';

export default function Blog() {
  return (
    <div className="pt-32 pb-20 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Blog & Updates</h1>
        
        <div className="grid grid-cols-1 gap-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="glass p-8 rounded-3xl hover:border-primary-500/50 transition-colors flex flex-col items-start">
              <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                <span>{post.date}</span>
                <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                <span className="font-medium text-primary-400">{post.category}</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                {post.title}
              </h2>
              <p className="text-slate-300 mb-6 leading-relaxed">
                {post.excerpt}
              </p>
              <Link 
                to={`/blog/${post.slug}`}
                className="text-primary-400 font-medium hover:text-primary-300 transition-colors inline-flex items-center gap-1 mt-auto"
              >
                Read more →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
