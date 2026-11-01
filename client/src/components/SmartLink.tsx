import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface SmartLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}

/** "/path" -> router Link; "#x" and mailto: -> plain <a>; http(s) -> new tab. Anything else renders as text. */
export function SmartLink({ href, className, children, onClick }: SmartLinkProps) {
  if (/^\/(?!\/)/.test(href)) {
    return (
      <Link to={href} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }
  if (/^(#|mailto:)/i.test(href)) {
    return (
      <a href={href} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }
  if (/^https?:\/\//i.test(href)) {
    return (
      <a href={href} className={className} onClick={onClick} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return <span className={className}>{children}</span>;
}

/** A template button; renders nothing unless both label and link are set. */
export function Button({ label, href, className }: { label: string; href: string; className: string }) {
  return label && href ? (
    <SmartLink href={href} className={className}>
      {label}
    </SmartLink>
  ) : null;
}
