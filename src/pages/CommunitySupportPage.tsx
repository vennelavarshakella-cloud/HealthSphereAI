/**
 * HealthSphere AI - Community Support & Expert Q&A
 * Peer support groups, verified clinical doctor guidance, and interactive discussion forums.
 */

import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  ThumbsUp,
  Sparkles,
  ShieldCheck,
  Plus,
  Heart,
  Activity,
  Brain,
  Filter,
} from 'lucide-react';
import { User, CommunityPost } from '../types';

interface CommunitySupportPageProps {
  currentUser: User | null;
  posts: CommunityPost[];
  onAddPost: (post: Partial<CommunityPost>) => void;
  onUpvotePost: (id: string) => void;
}

export const CommunitySupportPage: React.FC<CommunitySupportPageProps> = ({
  currentUser,
  posts,
  onAddPost,
  onUpvotePost,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<any>('Heart Health');

  const categories = ['All', 'Heart Health', 'Diabetes Care', 'Mental Peace', 'Women Health', 'Elder Care', 'Nutrition'];

  const filteredPosts = selectedCategory === 'All' ? posts : posts.filter(p => p.category === selectedCategory);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    onAddPost({
      user_id: currentUser ? currentUser.id : 'usr_001',
      author_name: currentUser ? currentUser.full_name : 'Sarah Jenkins',
      author_role: currentUser ? currentUser.role : 'Patient',
      category,
      title,
      content,
    });
    setTitle('');
    setContent('');
    setModalOpen(false);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Banner */}
      <div className="bg-linear-to-r from-sky-900 via-indigo-900 to-teal-900 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sky-200 text-xs font-semibold mb-3 border border-sky-400/30">
            <Users className="w-3.5 h-3.5 text-sky-300" />
            <span>Target 3.8: Inclusive Health Community</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Preventive Health Community & Expert Q&A
          </h1>
          <p className="text-sky-100/90 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Exchange tips with patient peers, ask clinical questions to verified healthcare experts, and discover tested wellness habits.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-teal-400 hover:bg-teal-500 text-slate-950 font-bold text-xs shadow-lg transition flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Start Discussion / Ask Doctor</span>
        </button>
      </div>

      {/* Category Pills Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition border ${
              selectedCategory === cat
                ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Discussion Threads Feed */}
      <div className="space-y-4">
        {filteredPosts.map(post => (
          <div
            key={post.id}
            className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-300 transition space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                  {post.author_name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{post.author_name}</span>
                    {post.is_verified_expert && (
                      <span className="flex items-center gap-1 text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-0.2 rounded-full">
                        <ShieldCheck className="w-3 h-3 text-teal-600" />
                        <span>Verified Medical Specialist</span>
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400">{post.author_role} • {post.created_at}</span>
                </div>
              </div>

              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                {post.category}
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900">{post.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{post.content}</p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onUpvotePost(post.id)}
                  className="flex items-center gap-1 text-slate-600 hover:text-sky-600 font-bold transition"
                >
                  <ThumbsUp className="w-4 h-4 text-sky-500" />
                  <span>{post.upvotes} Helpful</span>
                </button>
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4 text-slate-400" />
                  <span>{post.replies_count} Responses</span>
                </div>
              </div>

              <button
                onClick={() => alert(`Reply box opened for discussion: "${post.title}"`)}
                className="text-sky-600 hover:text-sky-700 font-bold"
              >
                Join Discussion →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New Post Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Post a Health Question or Experience</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Topic Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                >
                  <option value="Heart Health">Heart Health</option>
                  <option value="Diabetes Care">Diabetes Care</option>
                  <option value="Mental Peace">Mental Peace</option>
                  <option value="Women Health">Women Health</option>
                  <option value="Elder Care">Elder Care</option>
                  <option value="Nutrition">Nutrition</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Best morning routine for stabilizing fasting blood sugar?"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Details & Thoughts</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share context, symptoms you have observed, or specific tips that worked for your family..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 leading-relaxed"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-sky-600 text-white font-bold text-xs"
                >
                  Publish to Community
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
