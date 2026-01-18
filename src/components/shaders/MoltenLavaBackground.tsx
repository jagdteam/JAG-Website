import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ShaderMaterial, Mesh } from 'three';
import { vertexShader, fragmentShader, createUniforms } from './MoltenLavaShader';

// Lava plane mesh component
const LavaPlane = () => {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<ShaderMaterial>(null);
  const { viewport } = useThree();
  
  // Create uniforms once
  const uniforms = useMemo(() => createUniforms(), []);
  
  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (materialRef.current) {
        const x = event.clientX / window.innerWidth;
        const y = 1.0 - event.clientY / window.innerHeight; // Flip Y for shader coords
        materialRef.current.uniforms.uMouse.value = [x, y];
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (materialRef.current) {
        const scrollProgress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        materialRef.current.uniforms.uScrollProgress.value = scrollProgress;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Update resolution on resize
  useEffect(() => {
    const handleResize = () => {
      if (materialRef.current) {
        materialRef.current.uniforms.uResolution.value = [window.innerWidth, window.innerHeight];
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Animation loop - update time uniform
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });
  
  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

// Main background component
const MoltenLavaBackground = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        gl={{ 
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance'
        }}
        dpr={[1, 2]} // Limit pixel ratio for performance
      >
        <LavaPlane />
      </Canvas>
      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90 pointer-events-none" />
    </div>
  );
};

export default MoltenLavaBackground;
