import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ParticleBackgroundProps {
  color?: string;
  particleCount?: number;
  particleSize?: number;
  speed?: number;
  depth?: number;
  className?: string;
}

export default function ParticleBackground({
  color = '#FFFFFF',
  particleCount = 150,
  particleSize = 0.6,
  speed = 0.01,
  depth = 50,
  className = '',
}: ParticleBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Create camera with wider field of view
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;
    cameraRef.current = camera;

    // Create renderer with enhanced settings
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true, // Transparent background
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for better performance
    renderer.setClearColor(0x000000, 0); // Ensure transparent background
    
    // Set renderer DOM element to fill the container with fixed position
    const rendererDom = renderer.domElement;
    rendererDom.style.position = 'fixed';
    rendererDom.style.top = '0';
    rendererDom.style.left = '0';
    rendererDom.style.width = '100%';
    rendererDom.style.height = '100%';
    rendererDom.style.pointerEvents = 'none'; // Allow clicking through
    
    containerRef.current.appendChild(rendererDom);
    rendererRef.current = renderer;

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount3 = particleCount * 3; // Each vertex has x, y, z
    const positions = new Float32Array(particleCount3);
    const velocities = new Float32Array(particleCount3);
    const sizes = new Float32Array(particleCount); // Add size attribute
    
    // Create particles with wider distribution for parallax effect
    for (let i = 0; i < particleCount3; i += 3) {
      // Distribute particles in a wider area for parallax scrolling
      
      // Horizontal position (x) - full width
      positions[i] = (Math.random() - 0.5) * 120;
      
      // Vertical position (y) - much taller area for parallax
      positions[i + 1] = (Math.random() - 0.5) * 200;
      
      // Depth position (z) - create depth layers for parallax effect
      // Distribute in 5 distinct layers for better parallax
      const depthLayer = Math.floor(Math.random() * 5);
      positions[i + 2] = -25 + (depthLayer * 10);
      
      // Adjust size based on depth - particles further back (negative z) are smaller
      const particleIndex = i / 3;
      const depthFactor = (positions[i + 2] + 25) / 50; // 0 to 1 based on depth
      sizes[particleIndex] = (0.3 + Math.random() * 0.4) * (0.5 + depthFactor * 0.5);
      
      // Very slow, subtle movement
      const minSpeed = 0.001;
      const maxSpeed = 0.005;
      velocities[i] = (Math.random() * (maxSpeed - minSpeed) + minSpeed) * (Math.random() > 0.5 ? 1 : -1);
      velocities[i + 1] = (Math.random() * (maxSpeed - minSpeed) + minSpeed) * (Math.random() > 0.5 ? 1 : -1);
      velocities[i + 2] = (Math.random() * (maxSpeed - minSpeed) + minSpeed) * (Math.random() > 0.5 ? 1 : -1);
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1)); // Add size attribute
    
    // Create shader material for blurred particles
    const particlesMaterial = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(color) },
        pointTexture: { value: createCircleTexture() }
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        void main() {
          vColor = vec3(1.0, 1.0, 1.0);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform sampler2D pointTexture;
        varying vec3 vColor;
        void main() {
          // Enhanced dust-like particles with better visibility
          vec4 texColor = texture2D(pointTexture, gl_PointCoord);
          
          // Add slight color variation for more natural look
          float brightness = 0.8 + 0.2 * sin(gl_PointCoord.x * 10.0);
          
          gl_FragColor = vec4(color * vColor * brightness, 0.4);
          gl_FragColor = gl_FragColor * texColor;
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    
    // Function to create a soft, blurred circle texture for particles
    function createCircleTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      
      const context = canvas.getContext('2d');
      if (!context) return new THREE.Texture();
      
      // Create gradient
      const gradient = context.createRadialGradient(
        32, 32, 0,
        32, 32, 32
      );
      // Brighter gradient for more visible particles
      gradient.addColorStop(0, 'rgba(255,255,255,1.0)');
      gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
      gradient.addColorStop(0.5, 'rgba(255,255,255,0.4)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      
      // Draw circle
      context.fillStyle = gradient;
      context.fillRect(0, 0, 64, 64);
      
      // Create texture
      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      return texture;
    }
    
    // Create points
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // No lines, just particles
    
    // Animation function
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      
      if (particlesRef.current) {
        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
        const velocities = particlesRef.current.geometry.attributes.velocity.array as Float32Array;
        
        // Get scroll position for subtle parallax effect
        const scrollY = window.scrollY;
        
        // Apply depth-based parallax effect to individual particles
        for (let i = 0; i < positions.length; i += 3) {
          // Update position based on velocity for subtle movement
          positions[i] += velocities[i] * speed;
          positions[i + 1] += velocities[i + 1] * speed;
          positions[i + 2] += velocities[i + 2] * speed;
          
          // Apply parallax effect based on depth (z position)
          // Particles at different depths move at different speeds
          const depth = positions[i + 2];
          const depthFactor = (depth + 25) / 50; // 0 to 1 based on depth
          
          // Calculate parallax offset - deeper particles move slower
          const parallaxSpeed = 0.02 * (0.5 + depthFactor * 1.5);
          const parallaxOffset = scrollY * parallaxSpeed;
          
          // Apply smooth parallax offset to y position
          // Store original y position in a separate attribute if needed
          const originalY = positions[i + 1];
          positions[i + 1] = originalY - parallaxOffset;
          
          // Wrap particles around if they go too far
          if (positions[i] > 60) positions[i] = -60;
          if (positions[i] < -60) positions[i] = 60;
          if (positions[i + 1] > 100) positions[i + 1] = -100;
          if (positions[i + 1] < -100) positions[i + 1] = 100;
          if (positions[i + 2] > depth/2) positions[i + 2] = -depth/2;
          if (positions[i + 2] < -depth/2) positions[i + 2] = depth/2;
        }
        
        // Very subtle movement
        for (let i = 0; i < positions.length; i += 3) {
          // Update position based on velocity only - very subtle movement
          positions[i] += velocities[i] * speed;
          positions[i + 1] += velocities[i + 1] * speed;
          positions[i + 2] += velocities[i + 2] * speed;
          
          // Wrap particles around if they go too far
          if (positions[i] > 50) positions[i] = -50;
          if (positions[i] < -50) positions[i] = 50;
          if (positions[i + 1] > 50) positions[i + 1] = -50;
          if (positions[i + 1] < -50) positions[i + 1] = 50;
          if (positions[i + 2] > depth/2) positions[i + 2] = -depth/2;
          if (positions[i + 2] < -depth/2) positions[i + 2] = depth/2;
        }
        
        // No lines to update
        
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
        
        // Very subtle rotation
        particlesRef.current.rotation.x += 0.0001;
        particlesRef.current.rotation.y += 0.0001;
      }
      
      // Force render with clear
      renderer.clear();
      renderer.render(scene, camera);
    };
    
    // Start animation
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current || !containerRef.current) return;
      
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameRef.current);
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      if (particlesRef.current) {
        particlesRef.current.geometry.dispose();
        (particlesRef.current.material as THREE.Material).dispose();
        scene.remove(particlesRef.current);
      }
      
      // No lines to clean up
      
      rendererRef.current?.dispose();
    };
  }, [color, particleCount, particleSize, speed, depth]);
  
  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-30 overflow-hidden filter blur-[0.3px] ${className}`}
      aria-hidden="true"
    />
  );
}