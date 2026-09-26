import Image from "next/image";

/** Author photo, or their initial when no photo has been uploaded. */
export default function AuthorAvatar({
  author,
  size,
  className = "",
}: {
  author: { name: string; avatar: string };
  size: number;
  className?: string;
}) {
  if (author.avatar) {
    return (
      <Image
        src={author.avatar}
        alt={author.name}
        width={size}
        height={size}
        className={`rounded-full object-cover ${className}`}
      />
    );
  }
  return (
    <span
      aria-hidden
      style={{ width: size, height: size, fontSize: size * 0.42 }}
      className={`rounded-full bg-accent/15 text-accent font-medium flex items-center justify-center ${className}`}
    >
      {author.name.charAt(0).toUpperCase()}
    </span>
  );
}
