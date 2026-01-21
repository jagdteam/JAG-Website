import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ShaderMaterial, Mesh } from 'three';
import { vertexShader, fragmentShader, createUniforms } from './ParallaxGradientShader';

// CSS Fallback for when WebGL is unavailable
const CSSGradientFallback = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <div
        className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-background to-blue-900/20"
        style={{
          backgroundSize: '400% 400%',
          animation: 'gradientShift 15s ease infinite',
        }}
      />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]" />
      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
};

// Parallax plane mesh component
const ParallaxPlane = () => {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<ShaderMaterial>(null);
  const { viewport } = useThree();

  // Create uniforms once
  const uniforms = useMemo(() => createUniforms(), []);

  // Track mouse position with smooth interpolation
  useEffect(() => {
    let targetX = 0.5;
    let targetY = 0.5;
    let currentX = 0.5;
    let currentY = 0.5;

    const handleMouseMove = (event: MouseEvent) => {
      targetX = event.clientX / window.innerWidth;
      targetY = 1.0 - event.clientY / window.innerHeight;
    };

    // Smooth interpolation for mouse
    const animate = () => {
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      if (materialRef.current) {
        materialRef.current.uniforms.uMouse.value = [currentX, currentY];
      }
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Track scroll position with smooth interpolation
  useEffect(() => {
    let targetScroll = 0;
    let currentScroll = 0;

    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetScroll = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    };

    // Smooth interpolation for scroll
    const animate = () => {
      currentScroll += (targetScroll - currentScroll) * 0.08;

      if (materialRef.current) {
        materialRef.current.uniforms.uScrollProgress.value = currentScroll;
      }
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial value

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Update resolution on resize
  useEffect(() => {
    const handleResize = () => {
      if (materialRef.current) {
        materialRef.current.uniforms.uResolution.value = [window.innerWidth, window.innerHeight];
      }
    };

    handleResize();
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
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

// Main background component with WebGL fallback
const ParallaxBackground = () => {
  const [webglError, setWebglError] = useState(false);

  // Check WebGL support on mount (helps catch Chrome issues early)
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if (!gl) {
      console.warn('WebGL not supported, using CSS gradient fallback');
      setWebglError(true);
    }
  }, []);

  // If WebGL failed, use CSS fallback
  if (webglError) {
    return <CSSGradientFallback />;
  }

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: 'high-performance',
          failIfMajorPerformanceCaveat: false, // Allow software rendering on Chrome
        }}
        dpr={[1, 1.5]}
        onCreated={({ gl }) => {
          // Check if WebGL context was created successfully
          const context = gl.getContext();
          if (!context) {
            console.warn('WebGL context unavailable, falling back to CSS gradient');
            setWebglError(true);
          }
        }}
        onError={(error) => {
          console.warn('WebGL error (common in Chrome), falling back to CSS gradient:', error);
          setWebglError(true);
        }}
      >
        <ParallaxPlane />
      </Canvas>
      {/* Subtle noise overlay for texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]" />
    </div>
  );
};

export default ParallaxBackground;
