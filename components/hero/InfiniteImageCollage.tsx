"use client";

import Image from "next/image";

type CollageImage = {
  src: string;
  width: number;
  height: number;
  rotate: number;
  tiltX: number;
  tiltY: number;
  offsetY: number;
};

// Sizes/rotation/offsets are hand-varied (not Math.random()) so server and
// client render identically — swap srcs for your real assets.
const ROW: CollageImage[] = [
  { src: "/collage/1.jpg", width: 190, height: 130, rotate: -6, tiltX: 4, tiltY: -8, offsetY: 10 },
  { src: "/collage/2.jpg", width: 115, height: 155, rotate: 4, tiltX: -3, tiltY: 6, offsetY: 32 },
  { src: "/collage/3.jpg", width: 210, height: 120, rotate: -3, tiltX: 5, tiltY: 3, offsetY: 0 },
  { src: "/collage/4.jpg", width: 140, height: 180, rotate: 7, tiltX: -6, tiltY: -4, offsetY: 20 },
  { src: "/collage/5.jpg", width: 170, height: 130, rotate: -8, tiltX: 3, tiltY: 8, offsetY: 42 },
  { src: "/collage/6.jpg", width: 130, height: 140, rotate: 5, tiltX: -4, tiltY: -5, offsetY: 6 },
  { src: "/collage/7.jpg", width: 135, height: 170, rotate: 5, tiltX: -4, tiltY: 5, offsetY: 26 },
  { src: "/collage/8.jpg", width: 195, height: 120, rotate: -4, tiltX: 6, tiltY: -6, offsetY: 0 },
  { src: "/collage/9.jpg", width: 125, height: 155, rotate: 8, tiltX: -5, tiltY: 4, offsetY: 38 },
  { src: "/collage/10.jpg", width: 185, height: 135, rotate: -6, tiltX: 4, tiltY: -3, offsetY: 14 },
  { src: "/collage/11.jpg", width: 155, height: 115, rotate: 3, tiltX: -3, tiltY: 7, offsetY: 46 },
  { src: "/collage/12.jpg", width: 165, height: 145, rotate: -5, tiltX: 5, tiltY: -7, offsetY: 8 },
];

function Row({ images, duration }: { images: CollageImage[]; duration: number }) {
  const loop = [...images, ...images]; // duplicated once so the 50% mark is a seamless join

  return (
    <div
      className="collage-track flex w-max items-start gap-7"
      style={{ animationDuration: `${duration}s` }}
    >
      {loop.map((img, i) => (
        <div
          key={i}
          className="relative shrink-0 overflow-hidden rounded-xl border border-ink/10 bg-ink/5 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.35)]"
          style={{
            width: img.width,
            height: img.height,
            marginTop: img.offsetY,
            transform: `rotate(${img.rotate}deg) rotateX(${img.tiltX}deg) rotateY(${img.tiltY}deg)`,
          }}
        >
          <Image src={img.src} alt="" fill className="object-cover" sizes={`${img.width}px`} />
        </div>
      ))}
    </div>
  );
}

export function InfiniteImageCollage() {
  return (
    <div
      className="relative h-[200px] w-full overflow-hidden sm:h-[240px]"
      style={{ perspective: "1200px" }}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-paper to-transparent sm:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-paper to-transparent sm:w-28" />
      <Row images={ROW} duration={32} />
      <style jsx>{`
        .collage-track {
          animation-name: collage-rail;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }
        /* film-rail: content enters from the right and exits left,
           looping seamlessly since the row is duplicated once */
        @keyframes collage-rail {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .collage-track {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}