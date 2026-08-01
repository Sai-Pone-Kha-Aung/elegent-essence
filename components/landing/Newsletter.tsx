export default function Newsletter() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
      <div className="relative overflow-hidden rounded-3xl bg-zinc-900 dark:bg-zinc-950 border border-zinc-800 px-6 py-14 sm:px-12 sm:py-16">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-violet-650/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-indigo-650/15 blur-3xl" />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Join the Inner Circle
          </h2>
          <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
            Subscribe for early access to limited editions, exclusive events, and behind-the-scenes content from our fragrance lab.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-3.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
            />
            <button className="px-6 py-3.5 rounded-xl bg-white text-zinc-900 text-sm font-semibold hover:bg-zinc-200 transition-all shadow-md shadow-black/10 hover:shadow-lg hover:-translate-y-0.5 duration-200 whitespace-nowrap">
              Subscribe
            </button>
          </div>
          <p className="mt-4 text-xs text-zinc-500">
            No spam, unsubscribe anytime. Read our privacy policy.
          </p>
        </div>
      </div>
    </section>
  );
}
