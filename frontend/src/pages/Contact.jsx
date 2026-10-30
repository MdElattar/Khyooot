import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // محاكاة إرسال الرسالة بنجاح
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
      
      // إعادة تعيين حالة النجاح بعد فترة
      setTimeout(() => setSubmitted(false), 5000);
    }, 800);
  };

  return (
    <section className="min-h-[85vh] bg-white py-20 px-4 sm:px-6 lg:px-8 mt-16 overflow-hidden">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-bold tracking-[0.25em] uppercase text-gray-400 block mb-2">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wide text-gray-900 uppercase">
            Contact Us
          </h1>
          <div className="w-16 h-[2px] bg-gray-900 mx-auto mt-3 mb-4" />
          <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto font-light">
            Have questions about our collections, orders, or custom pieces? Reach out to KHYOOT team and we’ll get back to you shortly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

          {/* Contact Info (Takes 1 column) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1 bg-gray-50/70 border border-gray-100 rounded-3xl p-8 space-y-8 shadow-sm"
          >
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Let's talk with us</h3>
              <p className="text-xs text-gray-400">We are always open to hear from you.</p>
            </div>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-[#003459] shrink-0 mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Email Us</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">support@khyoot.com</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-[#003459] shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Call Us</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">+20 100 123 4567</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-[#003459] shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Location</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">Mansoura, Dakahlia, Egypt</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200/60">
              <p className="text-xs text-gray-400 font-medium">
                🕒 Working Hours: Saturday – Thursday (10 AM - 10 PM)
              </p>
            </div>
          </motion.div>

          {/* Form (Takes 2 columns) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl shadow-2xl shadow-black/[0.04] p-8 sm:p-10"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 ml-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-gray-900 focus:bg-white transition-all shadow-sm"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 ml-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-gray-900 focus:bg-white transition-all shadow-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 ml-1">Your Message</label>
                <textarea
                  rows="5"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-gray-900 focus:bg-white transition-all shadow-sm resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#003459] hover:bg-black disabled:bg-gray-400 text-white py-4 rounded-2xl font-bold uppercase tracking-wider text-xs transition-all duration-300 shadow-xl flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Sending message...</span>
                ) : submitted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Message Sent Successfully!</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}