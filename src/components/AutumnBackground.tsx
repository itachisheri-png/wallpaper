import React, { useMemo } from 'react';

export const AutumnBackground: React.FC = () => {
  const leaves = useMemo(() => {
    const colors = [
      '#e67e22', // Orange
      '#d35400', // Pumpkin
      '#c0392b', // Red
      '#f1c40f', // Yellow
      '#e74c3c', // Alizarin
    ];

    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      width: `${Math.random() * 15 + 10}px`,
      height: `${Math.random() * 8 + 6}px`,
      duration: `${Math.random() * 25 + 20}s`,
      swayDuration: `${Math.random() * 10 + 7}s`,
      rotateDuration: `${Math.random() * 8 + 4}s`,
      delay: `${Math.random() * -40}s`,
      opacity: Math.random() * 0.4 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  }, []);

  return (
    <div className="snow-container">
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="leaf"
          style={{
            left: leaf.left,
            width: leaf.width,
            height: leaf.height,
            backgroundColor: leaf.color,
            animationDuration: `${leaf.duration}, ${leaf.swayDuration}, ${leaf.rotateDuration}`,
            animationDelay: `${leaf.delay}, ${leaf.delay}, ${leaf.delay}`,
            opacity: leaf.opacity,
          }}
        />
      ))}
    </div>
  );
};
