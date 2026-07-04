'use client';

import { useState } from 'react';
import { Star, User, Send, Users, MessageSquare, Trophy } from 'lucide-react';

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([
    {
      name: 'Priya Sharma',
      role: 'Frontend Contributor',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      rating: 5,
      review:
        'DevPath helped me make my first open-source contribution. The community was incredibly welcoming and supportive throughout my journey.',
      link: 'https://github.com/priyasharma',
    },
    {
      name: 'Rahul Patil',
      role: 'Student Developer',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      rating: 5,
      review:
        "The discussions here are extremely helpful and motivating. I've learned more in this community than from many paid courses.",
      link: 'https://linkedin.com/in/rahulpatil',
    },
    {
      name: 'Aarav Singh',
      role: 'Full Stack Developer',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      rating: 5,
      review:
        'Found amazing project teammates, improved my skills significantly, and gained real confidence through active collaboration.',
      link: 'https://github.com/aaravsingh',
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({
    name: '',
    role: '',
    rating: 5,
    review: '',
    link: '',
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.review) return;

    const reviewToAdd = {
      ...newReview,
      avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
    };

    setReviews([reviewToAdd, ...reviews]);
    setNewReview({ name: '', role: '', rating: 5, review: '', link: '' });
    setShowForm(false);
    alert('Thank you! Your review has been submitted successfully.');
  };

  const stats = [
    { number: '4.9/5', label: 'Average Rating (Based on 120+ reviews)' },
    { number: '500+', label: 'Active Developers (Last 30 days)' },
    { number: '120+', label: 'Community Reviews' },
  ];

  const activityMetrics = [
    { icon: MessageSquare, label: 'Discussions Created', value: '248' },
    { icon: Trophy, label: 'Open Source Contributions', value: '87' },
    { icon: Users, label: 'Active Contributors', value: '312' },
  ];

  const ratingDistribution = [
    { stars: 5, percent: 92, count: '110' },
    { stars: 4, percent: 6, count: '7' },
    { stars: 3, percent: 2, count: '3' },
  ];

  return (
    <section
      id="reviews"
      className="relative py-24 overflow-hidden bg-background"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Heading */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1 text-sm text-cyan-400 mb-4">
            ⭐ Community Feedback
          </span>

          <h2 className="text-5xl font-bold mb-5 bg-gradient-to-r from-white via-cyan-300 to-cyan-500 bg-clip-text text-transparent">
            Loved by Developers
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Real stories from real community members who are growing together.
          </p>
        </div>

        {/* Enhanced Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 text-center hover:border-cyan-500/30 transition-colors"
            >
              <h3 className="text-5xl font-bold text-cyan-400 mb-3">
                {stat.number}
              </h3>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Rating Distribution */}
        <div className="mb-16 bg-card/50 border border-border rounded-2xl p-8">
          <h4 className="text-lg font-semibold mb-6 text-center">
            Rating Distribution
          </h4>
          <div className="space-y-4 max-w-md mx-auto">
            {ratingDistribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-4">
                <div className="flex items-center gap-1 w-20">
                  {Array.from({ length: item.stars }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
                <div className="text-sm text-muted-foreground w-12 text-right">
                  {item.percent}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {activityMetrics.map((metric, index) => (
            <div
              key={index}
              className="flex items-center gap-4 bg-card/50 border border-border rounded-2xl p-6"
            >
              <metric.icon className="w-10 h-10 text-cyan-400" />
              <div>
                <div className="text-3xl font-bold">{metric.value}</div>
                <div className="text-sm text-muted-foreground">
                  {metric.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="group rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-8 transition-all duration-300 hover:-translate-y-2 hover:border-cyan-500/40 hover:shadow-[0_0_40px_rgba(34,211,238,0.15)]"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <p className="text-muted-foreground leading-relaxed mb-8 text-[15px]">
                “{review.review}”
              </p>

              <div className="flex items-center gap-4">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover border border-white/20"
                />
                <div>
                  <h4 className="font-semibold text-lg">{review.name}</h4>
                  <p className="text-sm text-muted-foreground">{review.role}</p>
                  {review.link && (
                    <a
                      href={review.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 text-xs hover:underline inline-flex items-center gap-1 mt-1"
                    >
                      View Profile →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Review Submission Form */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="text-center mb-8">
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-medium transition-all active:scale-95"
            >
              <User size={20} />
              Share Your Experience
            </button>
          </div>

          {showForm && (
            <form
              onSubmit={handleSubmitReview}
              className="bg-card border border-border rounded-3xl p-8 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm mb-2 text-muted-foreground">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={newReview.name}
                    onChange={(e) =>
                      setNewReview({ ...newReview, name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-muted-foreground">
                    Role / Designation
                  </label>
                  <input
                    type="text"
                    value={newReview.role}
                    onChange={(e) =>
                      setNewReview({ ...newReview, role: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary"
                    placeholder="e.g. Full Stack Developer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2 text-muted-foreground">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setNewReview({ ...newReview, rating: star })
                      }
                      className="text-3xl transition-transform hover:scale-110"
                    >
                      <Star
                        className={`${
                          star <= newReview.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted-foreground'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2 text-muted-foreground">
                  Your Review
                </label>
                <textarea
                  value={newReview.review}
                  onChange={(e) =>
                    setNewReview({ ...newReview, review: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary min-h-[120px]"
                  placeholder="Share your experience with DevPath community..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-muted-foreground">
                  Profile Link (Optional)
                </label>
                <input
                  type="url"
                  value={newReview.link}
                  onChange={(e) =>
                    setNewReview({ ...newReview, link: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary"
                  placeholder="https://github.com/yourusername"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-medium transition-all"
              >
                <Send size={20} />
                Submit Review
              </button>
            </form>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-br from-card to-card/70 border border-border rounded-3xl p-12">
          <h3 className="text-3xl font-bold mb-4">
            Join 500+ Developers Building Together
          </h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Be part of a growing community of passionate developers, learners,
            and contributors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-medium hover:bg-primary/90 transition-all">
              Join Community
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="px-8 py-3 border border-white/30 hover:bg-white/5 rounded-2xl font-medium transition-all"
            >
              Submit Your Review
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
