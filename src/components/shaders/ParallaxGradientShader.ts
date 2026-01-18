// Parallax Gradient Shader - Smooth blur/gradient effect with scroll parallax
// Matches the awwwards reference video aesthetic

export const vertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragmentShader = `
  uniform float uTime;
  uniform float uScrollProgress;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  
  varying vec2 vUv;
  
  // Smooth noise for organic movement
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }
  
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }
  
  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;
    
    // Strong parallax offset based on scroll - this is the main effect
    float parallaxStrength = 0.8;
    float scrollOffset = uScrollProgress * parallaxStrength;
    
    // Create layered parallax effect - different layers move at different speeds
    vec2 layer1Uv = uv + vec2(0.0, scrollOffset * 0.3);
    vec2 layer2Uv = uv + vec2(0.0, scrollOffset * 0.6);
    vec2 layer3Uv = uv + vec2(0.0, scrollOffset * 1.0);
    
    // Subtle mouse influence
    vec2 mouseOffset = (uMouse - 0.5) * 0.05;
    layer1Uv += mouseOffset * 0.3;
    layer2Uv += mouseOffset * 0.5;
    layer3Uv += mouseOffset * 0.7;
    
    // Time for subtle animation
    float time = uTime * 0.15;
    
    // Create organic blob shapes with fbm
    float blob1 = fbm(layer1Uv * 2.0 + time * 0.3);
    float blob2 = fbm(layer2Uv * 1.5 - time * 0.2 + vec2(3.0, 1.5));
    float blob3 = fbm(layer3Uv * 3.0 + time * 0.4 + vec2(7.0, 4.0));
    
    // Combine blobs with different weights
    float combined = blob1 * 0.5 + blob2 * 0.3 + blob3 * 0.2;
    
    // Create color gradients - purple/blue tones like the reference
    vec3 color1 = vec3(0.08, 0.06, 0.15); // Deep dark purple
    vec3 color2 = vec3(0.15, 0.10, 0.25); // Medium purple
    vec3 color3 = vec3(0.20, 0.12, 0.35); // Lighter purple
    vec3 color4 = vec3(0.10, 0.15, 0.30); // Blue-purple
    
    // Gradient based on vertical position + scroll
    float gradientPos = uv.y - scrollOffset * 0.5;
    gradientPos = gradientPos + combined * 0.3;
    
    // Multi-stop gradient
    vec3 color;
    if (gradientPos < 0.3) {
      color = mix(color1, color2, gradientPos / 0.3);
    } else if (gradientPos < 0.6) {
      color = mix(color2, color3, (gradientPos - 0.3) / 0.3);
    } else {
      color = mix(color3, color4, (gradientPos - 0.6) / 0.4);
    }
    
    // Add subtle glow spots
    float glow1 = smoothstep(0.6, 0.2, length(layer2Uv - vec2(0.3, 0.4 + scrollOffset * 0.2)));
    float glow2 = smoothstep(0.5, 0.1, length(layer3Uv - vec2(0.7, 0.6 + scrollOffset * 0.3)));
    
    color += vec3(0.1, 0.05, 0.2) * glow1 * 0.5;
    color += vec3(0.05, 0.1, 0.2) * glow2 * 0.4;
    
    // Subtle vignette
    float vignette = 1.0 - length((uv - 0.5) * 1.2) * 0.5;
    color *= vignette;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

export interface ParallaxGradientUniforms {
  [uniform: string]: { value: number | [number, number] };
  uTime: { value: number };
  uScrollProgress: { value: number };
  uMouse: { value: [number, number] };
  uResolution: { value: [number, number] };
}

export const createUniforms = (): ParallaxGradientUniforms => ({
  uTime: { value: 0 },
  uScrollProgress: { value: 0 },
  uMouse: { value: [0.5, 0.5] },
  uResolution: { value: [window.innerWidth, window.innerHeight] },
});
