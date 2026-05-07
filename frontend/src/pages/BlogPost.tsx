import { useParams, Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import { ArrowLeft } from 'lucide-react';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="pt-32 pb-20 px-4 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
        <p className="text-slate-400 mb-8">The article you are looking for does not exist.</p>
        <Link to="/blog" className="btn-primary py-2 px-6">
          Back to Blog
        </Link>
      </div>
    );
  }

  // Split content by double newlines to render paragraphs
  const paragraphs = post.content.split('\n\n').filter(p => p.trim().length > 0);

  return (
    <div className="pt-32 pb-20 px-4 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <Link to="/blog" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>
        
        <article className="glass p-8 sm:p-12 rounded-3xl">
          <div className="flex items-center gap-4 text-sm text-primary-400 mb-6">
            <span>{post.date}</span>
            <span className="w-1 h-1 bg-primary-400 rounded-full"></span>
            <span className="font-medium">{post.category}</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-8 leading-tight">
            {post.title}
          </h1>
          
          <div className="space-y-6 text-slate-300 leading-relaxed text-lg">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph.trim()}</p>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
