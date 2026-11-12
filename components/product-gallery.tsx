"use client";

import Image from "next/image";
import { useState } from "react";
import { X, ZoomIn } from "lucide-react";

export function ProductGallery({ images, name }: { images: { src: string; alt: string }[]; name: string }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  return <div className="gallery"><button className="gallery-main" onClick={() => setZoom(true)} aria-label={`Enlarge ${images[active].alt}`}><Image src={images[active].src} alt={images[active].alt} fill sizes="(max-width: 900px) 100vw, 55vw" priority /><span className="zoom-hint"><ZoomIn size={15} /> View detail</span></button>{images.length > 1 && <div className="gallery-thumbs">{images.map((image, index) => <button key={image.src} className={index === active ? "gallery-thumb is-active" : "gallery-thumb"} onClick={() => setActive(index)} aria-label={`View ${name} photo ${index + 1}`} aria-pressed={index === active}><Image src={image.src} alt="" fill sizes="90px" /></button>)}</div>}{zoom && <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${name} image detail`} onClick={() => setZoom(false)}><button className="lightbox-close" onClick={() => setZoom(false)} aria-label="Close image"><X /></button><div className="lightbox-image" onClick={(event) => event.stopPropagation()}><Image src={images[active].src} alt={images[active].alt} fill sizes="95vw" /></div></div>}</div>;
}
