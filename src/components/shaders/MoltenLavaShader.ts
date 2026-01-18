// Molten Lava Shader Material - FBM-based fluid distortion
// Isolated shader code for modularity

export const vertexShader = `
  uniform float uTime;
  uniform float uScrollProgress;
  uniform vec2 uMouse;
  
  varying vec2 vUv;
  varying float vElevation;
  
  // Simple noise for vertex displacement
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f); // Smooth interpolation
    
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  
  void main() {
    vUv = uv;
    
    vec3 pos = position;
    
    // Subtle vertex displacement based on noise
    float mouseInfluence = length(uMouse - uv) * 0.5;
    float displacement = noise(uv * 3.0 + uTime * 0.1) * 0.05;
    displacement += sin(uv.x * 4.0 + uTime * 0.2 + uScrollProgress) * 0.02;
    
    pos.z += displacement * (1.0 - mouseInfluence * 0.3);
    vElevation = displacement;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const fragmentShader = `
  uniform float uTime;
  uniform float uScrollProgress;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  
  varying vec2 vUv;
  varying float vElevation;
  
  // Hash function for pseudo-random values
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  
  // Value noise with smooth interpolation
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    
    // Quintic interpolation for smoother results
    vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
    
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }
  
  // Fractal Brownian Motion - multiple octaves of noise
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    // 6 octaves for rich detail
    for (int i = 0; i < 6; i++) {
      value += amplitude * noise(p * frequency);
      frequency *= 2.0;
      amplitude *= 0.5;
    }
    
    return value;
  }
  
  // Domain warping for fluid-like distortion
  float domainWarp(vec2 p, float time) {
    vec2 q = vec2(
      fbm(p + vec2(0.0, 0.0)),
      fbm(p + vec2(5.2, 1.3))
    );
    
    vec2 r = vec2(
      fbm(p + 4.0 * q + vec2(1.7, 9.2) + 0.15 * time),
      fbm(p + 4.0 * q + vec2(8.3, 2.8) + 0.126 * time)
    );
    
    return fbm(p + 4.0 * r);
  }
  
  void main() {
    vec2 uv = vUv;
    
    // Apply mouse influence for subtle distortion following cursor
    vec2 mouseOffset = (uMouse - 0.5) * 0.15;
    float mouseDist = length(uv - uMouse);
    float mouseInfluence = smoothstep(0.5, 0.0, mouseDist) * 0.1;
    uv += mouseOffset * mouseInfluence;
    
    // Time with scroll influence for phase shift
    float time = uTime * 0.3 + uScrollProgress * 2.0;
    
    // Scale UV for lava pattern
    vec2 scaledUv = uv * 2.5;
    
    // Apply domain warping for fluid motion
    float warpedNoise = domainWarp(scaledUv, time);
    
    // Additional flow layers
    float flow1 = fbm(scaledUv * 1.5 + time * 0.2);
    float flow2 = fbm(scaledUv * 0.8 - time * 0.15 + vec2(warpedNoise));
    
    // Combine flows
    float combined = warpedNoise * 0.6 + flow1 * 0.25 + flow2 * 0.15;
    combined = smoothstep(0.2, 0.8, combined);
    
    // Color palette - deep magma reds, oranges, charred blacks
    vec3 charredBlack = vec3(0.02, 0.01, 0.01);
    vec3 deepRed = vec3(0.4, 0.05, 0.02);
    vec3 magmaOrange = vec3(0.9, 0.3, 0.05);
    vec3 brightOrange = vec3(1.0, 0.5, 0.1);
    vec3 hotYellow = vec3(1.0, 0.8, 0.3);
    
    // Create color gradients based on noise intensity
    vec3 color;
    if (combined < 0.3) {
      color = mix(charredBlack, deepRed, combined / 0.3);
    } else if (combined < 0.5) {
      color = mix(deepRed, magmaOrange, (combined - 0.3) / 0.2);
    } else if (combined < 0.7) {
      color = mix(magmaOrange, brightOrange, (combined - 0.5) / 0.2);
    } else {
      color = mix(brightOrange, hotYellow, (combined - 0.7) / 0.3);
    }
    
    // Add glow effect in bright areas
    float glow = pow(combined, 3.0) * 0.5;
    color += vec3(glow * 0.3, glow * 0.1, 0.0);
    
    // Subtle vignette
    float vignette = 1.0 - length((vUv - 0.5) * 1.2);
    vignette = smoothstep(0.0, 0.7, vignette);
    color *= vignette * 0.8 + 0.2;
    
    // Add elevation-based brightness variation
    color += vec3(vElevation * 2.0, vElevation, 0.0);
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

// Shader uniform types for TypeScript
export interface MoltenLavaUniforms {
  [uniform: string]: { value: number | [number, number] };
  uTime: { value: number };
  uScrollProgress: { value: number };
  uMouse: { value: [number, number] };
  uResolution: { value: [number, number] };
}

export const createUniforms = (): MoltenLavaUniforms => ({
  uTime: { value: 0 },
  uScrollProgress: { value: 0 },
  uMouse: { value: [0.5, 0.5] },
  uResolution: { value: [window.innerWidth, window.innerHeight] },
});
