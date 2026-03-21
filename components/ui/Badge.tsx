interface BadgeProps {
  children: React.ReactNode;
  variant?: "city" | "sponsored" | "category";
}

export default function Badge({ children, variant = "city" }: BadgeProps) {
  const styles = {
    city: "bg-accent/20 text-accent",
    sponsored: "bg-accent/20 text-accent",
    category: "bg-white/10 text-cream/70",
  };

  return (
    <span
      className={`inline-block text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1 ${styles[variant]}`}
    >
      {children}
    </span>
  );
}
