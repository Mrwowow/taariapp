interface BadgeProps {
  children: React.ReactNode;
  variant?: "city" | "sponsored" | "category";
}

export default function Badge({ children, variant = "city" }: BadgeProps) {
  const styles = {
    city: "bg-accent/15 text-accent",
    sponsored: "bg-sponsored/15 text-sponsored",
    category: "bg-dark/10 text-dark",
  };

  return (
    <span
      className={`inline-block text-[11px] font-medium uppercase tracking-[0.12em] px-3 py-1 ${styles[variant]}`}
    >
      {children}
    </span>
  );
}
