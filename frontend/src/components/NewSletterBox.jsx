import React, { useState } from 'react';

const NewsletterBox = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const onSubmitHandler = (event) => {
    event.preventDefault();
    if (!email) return;

    setLoading(true);
    setMessage('');

    // محاكاة سريعة لإرسال الإيميل
    setTimeout(() => {
      setMessage('Thank you for subscribing to KHYOOT!');
      setEmail('');
      setLoading(false);
    }, 500);
  };

  return (
    <div className='text-center py-10 px-4'>
      {/* Title / Call to Action */}
      <p className='text-2xl font-bold text-gray-900 tracking-wide'>
        Subscribe now & get 10% off
      </p>

      {/* Description */}
      <p className='text-gray-500 text-sm sm:text-base mt-2 max-w-xl mx-auto'>
        Be the first to know about new arrivals, exclusive discounts, and special collections. 
        Join our community for early access to everything!
      </p>

      {/* Subscription Form */}
      <form 
        onSubmit={onSubmitHandler} 
        className='w-full sm:w-[500px] flex items-center justify-between mx-auto my-6 p-1.5 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-all duration-300'
      >
        <input 
          className='w-full pl-5 pr-3 outline-none text-sm text-gray-700 bg-transparent placeholder-gray-400' 
          type='email' 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Enter your email address...' 
          required
        />

        <button 
          type='submit' 
          disabled={loading}
          className='bg-[#003459] hover:bg-black disabled:bg-gray-400 text-white text-xs font-semibold px-8 py-3.5 rounded-full uppercase tracking-wider transition-all duration-300 shrink-0 flex items-center gap-2'
        >
          {loading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>

      {/* Feedback Message */}
      {message && (
        <p className='text-xs sm:text-sm font-medium mt-3 text-emerald-600 transition-all'>
          {message}
        </p>
      )}
    </div>
  );
};

export default NewsletterBox;