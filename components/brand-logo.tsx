import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  size: "header" | "footer";
  imageUrl?: string;
  brandName?: string;
};

export function BrandLogo({ size, imageUrl, brandName = "ART SQUARE" }: BrandLogoProps) {
  return (
    <Link
      href="/"
      className={`brand-logo brand-logo--${size}`}
      aria-label={`${brandName} home`}
    >
      <Image
        src={imageUrl ?? "/logo/art-square-logo.png"}
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
