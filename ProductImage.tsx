import { useState } from 'react';
import { Shirt } from 'lucide-react';

interface ProductImageProps {
  src: string;
  alt: string;
  title: string;
  className?: string;
}

export function ProductImage({ src, alt, title, className = '' }: ProductImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 p-6 text-center text-zinc-500 ${className}`}
        role="img"
        aria-label={alt}
      >
        <Shirt className="mb-2 h-8 w-8 stroke-[1.5] text-zinc-400" aria-hidden="true" />
        <span className="text-xs font-medium tracking-wide text-zinc-600">{title}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
