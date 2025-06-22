import { useLayoutStore } from "~/store/layout-store";

import "./hero.css";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";

export default function Hero() {
  const navbarHeight = useLayoutStore((s) => s.navbarHeight);

  const elLeft = useRef(null);
  const elRight = useRef(null);
  const haloText = useRef(null);
  const haloCircle = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(max-width: 768px)", () => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.to(elLeft.current, { duration: 1, opacity: 1, y: 200 }, 0)
        .to(elRight.current, { duration: 1, opacity: 1, y: -200 }, 0)
        .to(haloCircle.current, { duration: 1, opacity: 1, scale: 2 }, 0.5)
        .to(haloText.current, { duration: 1, opacity: 1, scale: 2 }, 1.5);
    });

    mm.add("(min-width: 769px)", () => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.to(elLeft.current, { duration: 1, opacity: 1, x: 650 }, 0)
        .to(elRight.current, { duration: 1, opacity: 1, x: -650 }, 0)
        .to(haloCircle.current, { duration: 1, opacity: 1 }, 0.5)
        .to(haloText.current, { duration: 1, opacity: 1 }, 1.5);
    });

    gsap.to(haloText.current, {
      delay: 2,
      duration: 3,
      ease: "power2.inOut",
      repeat: -1,
      scale: 0.9,
      yoyo: true
    });
  }, []);

  return (
    <div
      className='scene'
      ref={sceneRef}
      style={{
        height: `calc(100vh - ${navbarHeight}px)`,
        overflow: "hidden",
        width: "100vw"
      }}
    >
      <img
        className='el el-left'
        ref={elLeft}
        src='/halo/left-hand.png'
      />
      <img
        className='el el-right'
        ref={elRight}
        src='/halo/right-hand.png'
      />
      <img
        className='halo'
        ref={haloCircle}
        src='/halo/halo-circle.png'
      />
      <img
        className='halo-text'
        ref={haloText}
        src='/halo/halo-text.png'
      />

      <div className='absolute inset-0 flex items-end justify-center p-3'>
        <ExploreButton />
      </div>
    </div>
  );
}

function ExploreButton() {
  const buttonRef = useRef(null);

  useEffect(() => {
    const buttonEl = buttonRef.current;

    gsap.to(buttonEl, {
      duration: 0.6,
      ease: "power1.inOut",
      repeat: -1,
      y: "-=10",
      yoyo: true
    });

    return () => {
      gsap.killTweensOf(buttonEl);
    };
  }, []);

  return (
    <a
      className='relative inline-block overflow-hidden rounded-lg bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-500 px-6 py-2 font-bold text-yellow-900 shadow-lg transition-transform hover:scale-105 hover:shadow-yellow-500/50'
      href='#posts'
      ref={buttonRef}
    >
      <span className='absolute inset-0 animate-pulse bg-white opacity-10 blur-sm'></span>
      Dergileri Keşfet
    </a>
  );
}
