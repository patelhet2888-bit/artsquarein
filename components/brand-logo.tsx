import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  size: "header" | "footer";
};

export function BrandLogo({ size }: BrandLogoProps) {
  return (
    <Link
      href="/"
      className={`brand-logo brand-logo--${size}`}
      aria-label="ART SQUARE — Where Art Meets Elegance home"
    >
      <Image
        src="/logo/art-square-logo.png"
        alt=""
        width={1254}
        height={1254}
        sizes={size === "header" ? "(max-width: 760px) 98px, 145px" : "148px"}
        className="brand-logo-image"
        priority={size === "header"}
        unoptimized
      />
    </Link>
  );
}
