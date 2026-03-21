import NewsletterForm from "@/components/ui/NewsletterForm";

export default function NewsletterSection() {
  return (
    <section className="py-20 px-6 bg-dark-card border-t border-border">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-accent text-[11px] font-bold uppercase tracking-[0.2em] mb-3">Stay Connected</p>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-cream mb-4">
          Stay in the Loop
        </h2>
        <p className="text-muted text-lg mb-8">
          Get weekly stories from the Diaspora delivered to your inbox.
        </p>
        <NewsletterForm variant="dark" />
        <p className="text-xs text-muted mt-4">
          We respect your privacy. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
