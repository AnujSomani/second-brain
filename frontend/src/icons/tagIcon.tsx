interface IconProps {
  className?: string;
}

export function TagIcon({ className = "size-5" }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.386l3.41-2.006c.827-.486 1.001-1.567.302-2.266L9.977 7.273A2.25 2.25 0 0 0 8.386 6.614H7.5" />
    </svg>
  );
}