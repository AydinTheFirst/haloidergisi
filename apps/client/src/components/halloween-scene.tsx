import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

interface FlyingBatProps {
  delay: number;
  duration: number;
  id: string;
  size: number;
  startY: number;
}

export default function FlyingBatsBackground() {
  const [bats, setBats] = useState<FlyingBatProps[]>([]);

  useEffect(() => {
    // 8 tane random yarasa oluştur
    setBats(
      Array.from({ length: 8 }, () => ({
        delay: Math.random() * 5,
        duration: 8 + Math.random() * 6,
        id: crypto.randomUUID(),
        size: 30 + Math.random() * 40,
        startY: Math.random() * window.innerHeight * 0.8,
      })),
    );
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {bats.map((bat) => (
        <FlyingBat key={bat.id} {...bat} />
      ))}
    </div>
  );
}

const Bat = ({ size = 50 }) => (
  <svg
    fill="none"
    height={size}
    viewBox="0 0 400 400"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M184.215 230.013C181.044 221.099 176.321 212.969 174.974 203.467C171.501 178.975 170.45 128.5 209.162 135.002C244.829 140.993 236.011 196.259 238.73 196.945C262.426 202.917 292.855 193.547 312.646 181.573C319.908 177.185 326.304 173.056 331.591 166.206C332.802 164.637 333.892 160.141 335.283 161.548C347.36 173.723 347.501 250.092 339.441 266.342C335.487 274.319 331.47 253.471 322.812 249.107C316.834 246.096 305.749 242.575 299.251 245.38C295.345 247.067 294.008 257.07 290.472 254.696C276.235 245.13 262.796 228.057 253.973 245.846"
      stroke="#000000"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-opacity="0.9"
      stroke-width="16"
    />
    <path
      d="M163.085 193.626C149.68 196.275 136.878 202.38 122.983 199.167C111.399 196.489 96.1551 192.522 88.4094 182.544C84.0028 176.871 80.4648 164.574 73.6559 166.849C52.6708 173.853 51.0256 278.827 65.3618 271.648C67.4244 270.618 70.7828 248.181 77.3443 243.486C85.1384 237.911 98.9941 237.011 107.308 241.639C111.714 244.093 112.966 257.212 116.529 253.644C127.565 242.591 139.304 227.407 156.635 243.024"
      stroke="#000000"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-opacity="0.9"
      stroke-width="16"
    />
    <path
      d="M192.76 246.286C199.172 228.371 213.228 221.256 217.273 243.289"
      stroke="#000000"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-opacity="0.9"
      stroke-width="16"
    />
    <path
      d="M185.018 132.126C175.105 120.583 176.15 136.612 180.213 139.571"
      stroke="#000000"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-opacity="0.9"
      stroke-width="16"
    />
    <path
      d="M227.594 137.219C232.3 128.069 240.41 127.916 234.616 139.571"
      stroke="#000000"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-opacity="0.9"
      stroke-width="16"
    />
    <path
      d="M213 161C213 160.5 212.756 159.654 212.519 159.057"
      stroke="#000000"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-opacity="0.9"
      stroke-width="12"
    />
    <path
      d="M196.629 161.609C196.629 160.632 196.629 159.654 196.629 158.677"
      stroke="#000000"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-opacity="0.9"
      stroke-width="12"
    />
    <path
      d="M205.66 175.996C205.66 174.854 205.66 173.712 205.66 172.576"
      stroke="#000000"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-opacity="0.9"
      stroke-width="12"
    />
  </svg>
);

const FlyingBat = ({ delay, duration, size, startY }: FlyingBatProps) => {
  const direction = Math.random() > 0.5 ? 1 : -1; // sağa veya sola uçabilir
  const startX = direction === 1 ? -150 : window.innerWidth + 150;
  const endX = direction === 1 ? window.innerWidth + 150 : -150;
  const amplitude = Math.random() * 60 + 20;

  return (
    <motion.div
      animate={{
        rotate: [0, 10 * direction, -10 * direction, 0],
        x: [startX, endX],
        y: [startY, startY - amplitude, startY + amplitude / 2, startY - amplitude / 3, startY],
      }}
      className="absolute"
      initial={{ scale: Math.random() * 0.3 + 0.8, x: startX, y: startY }}
      transition={{
        delay,
        duration,
        ease: "easeInOut",
        repeat: Infinity,
      }}
    >
      <Bat size={size} />
    </motion.div>
  );
};
