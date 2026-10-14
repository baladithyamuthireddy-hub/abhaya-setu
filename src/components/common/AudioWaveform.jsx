import React, { useEffect, useRef } from 'react';

export function AudioWaveform({
  active = false,
  scenarioKey = 'DISTRESS_BUS_STAND',
  color = '#06B6D4',
  height = 80,
}) {
  const canvasRef = useRef(null);
  const animFrameId = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, width, h);

      // Background subtle grid lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Center baseline
      const midY = h / 2;
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.3)';
      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(width, midY);
      ctx.stroke();

      // Dynamic waveform
      ctx.beginPath();
      ctx.lineWidth = active ? 2.5 : 1.5;
      ctx.strokeStyle = color;

      const numPoints = 80;
      const step = width / numPoints;

      for (let i = 0; i <= numPoints; i++) {
        const x = i * step;
        let amplitude = 4; // idle ambient noise

        if (active) {
          if (scenarioKey === 'FESTIVAL_HARMLESS') {
            // Rhythmic, periodic beats
            const beat = Math.sin(phase * 4 + (i / numPoints) * Math.PI * 6);
            amplitude = Math.abs(beat) * 26 + Math.sin(phase * 2 + i * 0.3) * 8;
          } else if (scenarioKey === 'DISTRESS_BUS_STAND') {
            // Chaotic high-frequency screech
            amplitude =
              Math.sin(phase * 12 + i * 0.8) * 22 +
              Math.sin(phase * 28 + i * 1.5) * 12 +
              (Math.random() - 0.5) * 14;
          } else if (scenarioKey === 'FALL_PATHWAY') {
            // Sudden transient impulse damping
            const envelope = Math.exp(-((i - 20) ** 2) / 120);
            amplitude = envelope * 32 * Math.sin(phase * 6 + i) + 3;
          } else {
            // Crowd surge / murmur
            amplitude =
              Math.sin(phase * 3 + i * 0.4) * 18 +
              Math.sin(phase * 7 + i * 0.9) * 10;
          }
        }

        const y = midY + Math.sin(phase + i * 0.25) * amplitude;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();

      // Glowing reflection gradient
      if (active) {
        ctx.save();
        ctx.shadowColor = color;
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.restore();
      }

      phase += active ? 0.08 : 0.02;
      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [active, scenarioKey, color]);

  return (
    <div className="relative w-full rounded-lg overflow-hidden border border-command-700/60 bg-command-950/80 shadow-inner">
      <div className="absolute top-2 left-3 z-10 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest">
          {active ? 'LIVE EDGE ACOUSTIC SPECTRUM' : 'ACOUSTIC MONITOR [STANDBY]'}
        </span>
      </div>
      <canvas
        ref={canvasRef}
        width={600}
        height={height}
        className="w-full block"
        style={{ height: `${height}px` }}
      />
    </div>
  );
}
