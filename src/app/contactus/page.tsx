'use client';

import { useState } from 'react';
import { Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';
import { MagneticText } from '@/components/ui/magnetic-text';

const subjectOptions = [
  { value: '', label: 'Select Subject' },
  { value: 'general', label: 'General Inquiry' },
  { value: 'support', label: 'Technical Support' },
  { value: 'feature', label: 'Feature Request' },
  { value: 'bug', label: 'Bug Report' },
  { value: 'partnership', label: 'Partnership / Collaboration' },
  { value: 'feedback', label: 'Feedback' },
  { value: 'other', label: 'Other' },
];

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    subject: false,
    message: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const getValidationErrors = (data: typeof formData) => {
    const errors = {
      name: '',
      email: '',
      subject: '',
      message: '',
    };

    const nameTrimmed = data.name.trim();
    const emailTrimmed = data.email.trim();
    const subjectTrimmed = data.subject.trim();
    const messageTrimmed = data.message.trim();

    if (!nameTrimmed) {
      errors.name = 'Name is required.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailTrimmed) {
      errors.email = 'Email address is required.';
    } else if (!emailRegex.test(emailTrimmed)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!subjectTrimmed) {
      errors.subject = 'Subject is required.';
    }

    if (!messageTrimmed) {
      errors.message = 'Message is required.';
    } else if (messageTrimmed.length < 20) {
      errors.message = 'Message must be at least 20 characters.';
    }

    return errors;
  };

  const validationErrors = getValidationErrors(formData);
  const isValid =
    !validationErrors.name &&
    !validationErrors.email &&
    !validationErrors.subject &&
    !validationErrors.message;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid) {
      setTouched({
        name: true,
        email: true,
        subject: true,
        message: true,
      });
      setError('Please fix the errors before submitting.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const trimmedData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
    };

    try {
      // TODO: Replace with real API call later
      // Example: await fetch('/api/contact', { method: 'POST', body: JSON.stringify(trimmedData) });

      console.log('Contact form submitted:', trimmedData);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTouched({ name: false, email: false, subject: false, message: false });
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setError('');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTouched({ name: false, email: false, subject: false, message: false });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 to-black text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <MagneticText
            text="CONTACT US"
            hoverText="REACH OUT"
            className="text-5xl md:text-6xl font-bold mb-4"
          />
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Have questions? Need help? Or want to collaborate?
            <br />
            We’re here for you.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-bold mb-8">Send us a message</h2>

            {isSubmitted ? (
              <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-3xl p-10 text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold mb-3">Thank You!</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Your message has been received. We’ll get back to you within
                  24-48 hours.
                </p>
                <button
                  onClick={resetForm}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3 rounded-2xl transition-all"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm">
                    {error}
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-border bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="John Doe"
                    />
                    {touched.name && validationErrors.name && (
                      <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                        {validationErrors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-border bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="you@example.com"
                    />
                    {touched.email && validationErrors.email && (
                      <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                        {validationErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-border bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    {subjectOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {touched.subject && validationErrors.subject && (
                    <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                      {validationErrors.subject}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    maxLength={1000}
                    required
                    rows={8}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-border bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-y"
                    placeholder="Please describe your inquiry in detail..."
                  />
                  <div className="flex justify-between items-start mt-1">
                    <div className="flex-1">
                      {touched.message && validationErrors.message && (
                        <p className="text-red-500 dark:text-red-400 text-xs">
                          {validationErrors.message}
                        </p>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-auto">
                      {formData.message.length} / 1000
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-4 px-8 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.985]"
                >
                  <Send size={20} />
                  {isSubmitting ? 'Sending Message...' : 'Send Message'}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  We respect your privacy. Your information will only be used to
                  respond to your inquiry.
                </p>
              </form>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-10 lg:pt-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Get in touch</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Our support team typically responds within 24-48 business hours.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-950 flex items-center justify-center text-cyan-600 dark:text-cyan-400 flex-shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="font-semibold text-lg">Email Us</p>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="text-cyan-600 dark:text-cyan-400 hover:underline text-lg"
                  >
                    {siteConfig.contact.email}
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-950 flex items-center justify-center text-cyan-600 dark:text-cyan-400 flex-shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="font-semibold text-lg">Response Time</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    24 - 48 hours
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <p className="font-semibold mb-4 text-lg">Follow us on</p>
              <div className="flex flex-wrap gap-6 text-lg">
                <a
                  href={siteConfig.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-500 transition-colors"
                >
                  GitHub
                </a>
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-pink-500 transition-colors"
                >
                  Instagram
                </a>
                <a
                  href={siteConfig.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-500 transition-colors"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
