import { useEffect, useRef } from 'react';

export function useGradientCanvas(opacity = 0.07) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let frame = 0;
    let scrollY = 0;
    let raf = 0;

    const blobs = [
      { x: 0.2, y: 0.3, r: 0.5, color: [0, 255, 136] as const, speed: 0.0003, phase: 0 },
      { x: 0.8, y: 0.2, r: 0.4, color: [0, 136, 255] as const, speed: 0.0004, phase: 1.2 },
      { x: 0.5, y: 0.7, r: 0.45, color: [0, 200, 100] as const, speed: 0.00025, phase: 2.5 },
    ];

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };

    const onScroll = () => {
      scrollY = window.scrollY;
    };

    const draw = () => {
      frame += 1;
      ctx.clearRect(0, 0, W, H);
      const scrollOffset = scrollY * 0.0003;
      blobs.forEach((b) => {
        const t = frame * b.speed + b.phase + scrollOffset;
        const bx = (b.x + Math.sin(t) * 0.15) * W;
        const by = (b.y + Math.cos(t * 0.7) * 0.1 + scrollY * 0.00008) * H;
        const br = b.r * Math.min(W, H);
        const grad = ctx.createRadialGradient(bx, by, 0, bx, by, br);
        grad.addColorStop(0, `rgba(${b.color[0]},${b.color[1]},${b.color[2]},0.12)`);
        grad.addColorStop(0.5, `rgba(${b.color[0]},${b.color[1]},${b.color[2]},0.04)`);
        grad.addColorStop(1, `rgba(${b.color[0]},${b.color[1]},${b.color[2]},0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
      });
      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', onScroll, { passive: true });
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return { canvasRef, opacity };
}
