import React, { useState, useRef, useEffect } from 'react';
import type { Movie, WatchlistMovie } from '../types/movie';
import { X, Send, Sparkles, Bot, Star, Plus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CiniChatProps {
  movies: Movie[];
  watchlist: WatchlistMovie[];
  onSelectMovie: (movie: Movie) => void;
  onToggleWatchlist: (movie: Movie) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'cini';
  text: string;
  movies?: Movie[];
}

export const CiniChat: React.FC<CiniChatProps> = ({
  movies,
  watchlist,
  onSelectMovie,
  onToggleWatchlist,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'cini',
      text: "Hello! I'm **Cini**, your AI cinematic companion. Ask me for movie recommendations, what to watch tonight, or anything about your watchlist!",
    },
  ]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const newMsg: Message = { id: Date.now().toString(), sender: 'user', text: userText };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateCiniResponse(userText, movies, watchlist);
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 700);
  };

  const handleQuickPrompt = (promptText: string) => {
    const newMsg: Message = { id: Date.now().toString(), sender: 'user', text: promptText };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateCiniResponse(promptText, movies, watchlist);
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex items-center justify-center w-16 h-16 hover:w-44 transition-all duration-300 ease-out bg-gradient-to-br from-amber-500 to-amber-600 text-black rounded-2xl shadow-2xl font-bold tracking-wide border border-amber-400/30 group overflow-hidden px-0 hover:px-3.5"
        >
          {/* Default state (squircle): vertical stack */}
          <div className="flex flex-col items-center justify-center group-hover:opacity-0 group-hover:scale-75 absolute transition-all duration-200">
            <Bot className="w-5 h-5 text-black mb-0.5" />
            <span className="text-[11px]">Cini</span>
          </div>

          {/* Hover state: horizontal pill with "Chat with Cini" */}
          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2.5 w-full whitespace-nowrap transition-all duration-300">
            <div className="w-7 h-7 rounded-xl bg-black/20 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-black" />
            </div>
            <span className="text-sm font-bold">Chat with Cini</span>
          </div>
        </motion.button>
      </div>

      {/* Chat Window Modal / Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for outside click to close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40"
            />

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed bottom-24 right-6 z-50 w-[92vw] sm:w-[420px] h-[560px] sm:h-[600px] max-h-[85vh] bg-[#12141c]/95 backdrop-blur-xl border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-zinc-900/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">Cini AI</h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">
                      Online
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400">Your Cinematic Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-amber-500 text-black font-medium rounded-br-xs shadow-md'
                        : 'bg-zinc-900/90 text-zinc-200 border border-white/10 rounded-bl-xs shadow-lg'
                    }`}
                  >
                    <p className="whitespace-pre-line text-xs sm:text-sm">{msg.text}</p>
                  </div>

                  {/* Optional Movie Recommendations in Chat */}
                  {msg.movies && msg.movies.length > 0 && (
                    <div className="mt-3 grid grid-cols-1 gap-2 w-full max-w-[85%]">
                      {msg.movies.map((movie) => {
                        const inWatchlist = watchlist.some((w) => w.id === movie.id);
                        return (
                          <div
                            key={movie.id}
                            className="flex items-center justify-between bg-zinc-900/80 border border-white/10 p-2.5 rounded-xl hover:border-amber-500/50 transition-all group"
                          >
                            <div
                              onClick={() => onSelectMovie(movie)}
                              className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                            >
                              <img
                                src={
                                  movie.poster_path?.startsWith('http')
                                    ? movie.poster_path
                                    : `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                                }
                                alt={movie.title || movie.name}
                                className="w-10 h-14 object-cover rounded-lg bg-zinc-800"
                              />
                              <div className="min-w-0 flex-1">
                                <h4 className="text-xs font-bold text-white truncate group-hover:text-amber-400 transition-colors">
                                  {movie.title || movie.name}
                                </h4>
                                <div className="flex items-center gap-2 text-[10px] text-zinc-400 mt-0.5">
                                  <span className="flex items-center gap-1 text-amber-400 font-semibold">
                                    <Star className="w-3 h-3 fill-amber-400" />
                                    {movie.vote_average?.toFixed(1) || 'NR'}
                                  </span>
                                  <span>•</span>
                                  <span>{movie.release_date?.substring(0, 4) || 'N/A'}</span>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => onToggleWatchlist(movie)}
                              className={`p-2 rounded-xl transition-colors ${
                                inWatchlist
                                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                  : 'bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10'
                              }`}
                              title={inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                            >
                              {inWatchlist ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-zinc-400 text-xs bg-zinc-900/60 w-fit px-3 py-2 rounded-xl border border-white/10">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                  <span>Cini is thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="px-4 py-2 border-t border-white/10 bg-zinc-950/40 flex gap-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => handleQuickPrompt('What should I watch tonight?')}
                className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-[11px] border border-white/10 transition-colors"
              >
                🍿 What should I watch?
              </button>
              <button
                onClick={() => handleQuickPrompt('Show top sci-fi movies')}
                className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-[11px] border border-white/10 transition-colors"
              >
                🚀 Top Sci-Fi
              </button>
              <button
                onClick={() => handleQuickPrompt("What's in my watchlist?")}
                className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-[11px] border border-white/10 transition-colors"
              >
                📜 My Watchlist
              </button>
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-zinc-900/80 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Cini for recommendations..."
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-all"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black transition-colors shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// Cini's Smart Recommendation Engine
function generateCiniResponse(query: string, movies: Movie[], watchlist: WatchlistMovie[]): Message {
  const q = query.toLowerCase();

  if (q.includes('watchlist')) {
    if (watchlist.length === 0) {
      return {
        id: Date.now().toString(),
        sender: 'cini',
        text: "Your watchlist is currently empty! Browse around or ask me for recommendations to add some great titles.",
      };
    }
    return {
      id: Date.now().toString(),
      sender: 'cini',
      text: `You have **${watchlist.length} movie${watchlist.length > 1 ? 's' : ''}** in your watchlist. Here are some of them:`,
      movies: watchlist.slice(0, 3),
    };
  }

  if (q.includes('sci-fi') || q.includes('space') || q.includes('future')) {
    const sciFiMovies = movies.filter(
      (m) => m.genre_ids?.includes(878) || m.overview.toLowerCase().includes('space') || m.overview.toLowerCase().includes('future')
    );
    const recs = sciFiMovies.length > 0 ? sciFiMovies.slice(0, 3) : movies.slice(0, 3);
    return {
      id: Date.now().toString(),
      sender: 'cini',
      text: "Here are some stellar sci-fi picks that will blow your mind:",
      movies: recs,
    };
  }

  if (q.includes('what should i watch') || q.includes('recommend') || q.includes('suggestion') || q.includes('good movie')) {
    const topRated = [...movies].sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0)).slice(0, 3);
    return {
      id: Date.now().toString(),
      sender: 'cini',
      text: "Based on trending masterpieces, here are my top recommendations for tonight:",
      movies: topRated,
    };
  }

  if (q.includes('action') || q.includes('thrill')) {
    const actionMovies = movies.filter((m) => m.genre_ids?.includes(28) || m.genre_ids?.includes(53));
    const recs = actionMovies.length > 0 ? actionMovies.slice(0, 3) : movies.slice(0, 3);
    return {
      id: Date.now().toString(),
      sender: 'cini',
      text: "Looking for adrenaline? Check out these action-packed thrillers:",
      movies: recs,
    };
  }

  // Default conversational response matching query
  const matches = movies.filter(
    (m) =>
      (m.title && m.title.toLowerCase().includes(q)) ||
      (m.name && m.name.toLowerCase().includes(q)) ||
      m.overview.toLowerCase().includes(q)
  );

  if (matches.length > 0) {
    return {
      id: Date.now().toString(),
      sender: 'cini',
      text: `I found ${matches.length} title${matches.length > 1 ? 's' : ''} matching your interest:`,
      movies: matches.slice(0, 3),
    };
  }

  const randomRecs = [...movies].sort(() => 0.5 - Math.random()).slice(0, 2);
  return {
    id: Date.now().toString(),
    sender: 'cini',
    text: `That's an interesting question! While I analyze cinematic databases, how about giving these hand-picked gems a watch?`,
    movies: randomRecs,
  };
}
