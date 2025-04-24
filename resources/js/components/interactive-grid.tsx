import { useEffect, useRef, useState } from 'react';

interface InteractiveGridProps {
  className?: string;
}

export default function InteractiveGrid({ className = '' }: InteractiveGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMouseMoving, setIsMouseMoving] = useState(false);
  
  useEffect(() => {
    if (!gridRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size to match window
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    // Function to handle mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setIsMouseMoving(true);
      
      // Reset the "moving" state after a delay
      clearTimeout(mouseTimeout);
      mouseTimeout = setTimeout(() => {
        setIsMouseMoving(false);
      }, 100);
    };
    
    let mouseTimeout: ReturnType<typeof setTimeout>;
    window.addEventListener('mousemove', handleMouseMove);
    
    // Draw the grid
    const drawGrid = () => {
      if (!ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw subtle base grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      
      // Draw vertical lines
      const cellSize = 20;
      for (let x = 0; x < canvas.width; x += cellSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      // Draw horizontal lines
      for (let y = 0; y < canvas.height; y += cellSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Draw larger grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      const largerCellSize = 100;
      
      // Draw vertical larger lines
      for (let x = 0; x < canvas.width; x += largerCellSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      // Draw horizontal larger lines
      for (let y = 0; y < canvas.height; y += largerCellSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Draw interactive highlight around mouse
      if (isMouseMoving) {
        // Calculate grid cells around mouse
        const mouseX = mousePos.x;
        const mouseY = mousePos.y;
        
        // Calculate hue based on position
        const hue = (mouseX / canvas.width) * 360;
        
        // Highlight cells near mouse with gradient
        const radius = 150; // Highlight radius
        const cellsToHighlight = Math.ceil(radius / cellSize);
        
        // Find the closest grid intersection to the mouse
        const closestX = Math.round(mouseX / cellSize) * cellSize;
        const closestY = Math.round(mouseY / cellSize) * cellSize;
        
        // Highlight grid lines with gradient based on distance
        for (let i = -cellsToHighlight; i <= cellsToHighlight; i++) {
          for (let j = -cellsToHighlight; j <= cellsToHighlight; j++) {
            const x = closestX + (i * cellSize);
            const y = closestY + (j * cellSize);
            
            // Calculate distance from mouse
            const dx = x - mouseX;
            const dy = y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance <= radius) {
              // Calculate opacity based on distance (closer = more visible)
              const opacity = 0.2 * (1 - distance / radius);
              
              // Draw vertical line
              ctx.beginPath();
              ctx.strokeStyle = `hsla(${hue}, 100%, 70%, ${opacity})`;
              ctx.lineWidth = 1;
              ctx.moveTo(x, y - cellSize);
              ctx.lineTo(x, y + cellSize);
              ctx.stroke();
              
              // Draw horizontal line
              ctx.beginPath();
              ctx.moveTo(x - cellSize, y);
              ctx.lineTo(x + cellSize, y);
              ctx.stroke();
              
              // Draw a subtle glow at intersection
              if (distance < 30) {
                ctx.beginPath();
                const glowRadius = 4;
                ctx.fillStyle = `hsla(${hue}, 100%, 70%, ${opacity * 0.5})`;
                ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          }
        }
      }
    };
    
    // Animation loop
    const animate = () => {
      drawGrid();
      requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', updateCanvasSize);
      clearTimeout(mouseTimeout);
    };
  }, [mousePos, isMouseMoving]);
  
  return (
    <div ref={gridRef} className={`absolute inset-0 pointer-events-none ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ backgroundColor: '#1a1a1a' }}
      />
    </div>
  );
}