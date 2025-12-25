import { motion } from 'framer-motion';
import React, { useMemo } from 'react';

const Snowfall = ({ color = '#FFF', count = 50 }) => {
  // Kar tanelerinin özelliklerini bir kez hesaplayıp hafızada tutuyoruz
  const snowflakes = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      delay: Math.random() * 10, // Başlangıç gecikmesi
      duration: Math.random() * 5 + 5, // 5s - 10s arası düşme hızı
      id: i,
      initialX: Math.random() * 100, // % cinsinden başlangıç konumu
      opacity: Math.random() * 0.6 + 0.4, // Farklı belirginlik seviyeleri
      size: Math.random() * 5 + 2, // 2px - 7px arası boyut
    }));
  }, [count]);

  const containerStyle: React.CSSProperties = {
    height: '100vh',
    left: 0,
    overflow: 'hidden',
    pointerEvents: 'none', 
    position: 'fixed',
    top: 0,
    width: '100vw',
    zIndex: 9999,
  };

  return (
    <div style={containerStyle}>
      {snowflakes.map((flake) => (
        <motion.div
          animate={{ 
            opacity: flake.opacity,
            x: `${flake.initialX + (Math.random() * 10 - 5)}vw`, // Hafif rüzgar etkisi
            y: '110vh' // Ekranın altına kadar düşer 
          }}
          initial={{ 
            opacity: 0, 
            x: `${flake.initialX}vw`, 
            y: -20 
          }}
          key={flake.id}
          style={{
            backgroundColor: color,
            borderRadius: '50%',
            filter: 'blur(1px)', // Daha yumuşak, kar benzeri bir görünüm
            height: flake.size,
            position: 'absolute',
            width: flake.size,
          }}
          transition={{
            delay: flake.delay,
            duration: flake.duration,
            ease: "linear",
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  );
};

export default Snowfall;