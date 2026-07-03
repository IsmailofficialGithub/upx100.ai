import { useGradientCanvas } from '../hooks/useGradientCanvas';

export function GradientCanvas({ opacity = 0.07 }: { opacity?: number }) {
  const { canvasRef } = useGradientCanvas(opacity);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity }}
      aria-hidden
    />
  );
}
