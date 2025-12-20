import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

interface Product {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  videoUrl: string;
}

const products: Product[] = [
  {
    id: 1,
    title: "Our Mission",
    subtitle: "Building Tomorrow's Software, Today",
    description: "In a saturated market of CS graduates, "+
    "we refuse to be background noise. We engineer our own escape out of the current industry landscape. "+
    "Our projects are not just code; they are tests of our ability to architect, deploy, and maintain complex systems in a everchanging industry.",
    videoUrl:
      "https://assets.mixkit.co/videos/preview/mixkit-artificial-intelligence-animated-concept-24728-large.mp4",
  },
  {
    id: 2,
    title: "Our Story (So Far)",
    subtitle: "How We Got Here",
    description:
      "We are a team who share the same past, 4 years of undergrad wasted. No internships, no meaningful projects, no real world experience. We are here to change that. " +
      "Our last chance is now, UCI's Master's program will be our opportunity to change our lives and build a future for ourselves.",
    videoUrl:
      "https://assets.mixkit.co/videos/preview/mixkit-cloud-computing-concept-animation-4817-large.mp4",
  },
  {
    id: 3,
    title: "Technical Domain & Specialization",
    subtitle: "Our Domain of Expertise",
    description:
      "A team of full-stack developers from completely different backgrounds & skillsets. Our strengths lie in the areas we are weakest in because we bring up each other's weaknesses.",
    videoUrl:
      "https://assets.mixkit.co/videos/preview/mixkit-programming-code-moving-on-a-dark-screen-28814-large.mp4",
  },
  {
    id: 4,
    title: "Accountability",
    subtitle: "We Hold Each Other Accountable",
    description:
      "Leetcode & GitHub History UwU",
    videoUrl:
      "https://assets.mixkit.co/videos/preview/mixkit-programming-code-moving-on-a-dark-screen-28814-large.mp4",
  },
];

const ProductCard = ({ product, index }: { product: Product; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting && videoRef.current) {
          videoRef.current.play();
        } else if (videoRef.current) {
          videoRef.current.pause();
        }
      },
      { threshold: 0.3 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative min-h-screen flex items-center justify-center overflow-hidden transition-all duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Video Background */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      >
        <source src={product.videoUrl} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/60" />

      {/* Content */}
      <div
        className={`relative z-10 max-w-4xl mx-auto px-6 text-center transition-all duration-1000 delay-300 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
        }`}
      >
        <p className="text-primary text-sm font-medium mb-4 tracking-widest uppercase">
          {product.subtitle}
        </p>
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-6">
          {product.title}
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          {product.description}
        </p>
        <Link
          to="/projects"
          className="inline-flex items-center text-primary hover:text-primary/80 transition-colors text-sm font-medium"
        >
          Learn more <span className="ml-1">→</span>
        </Link>
      </div>
    </div>
  );
};

const ProductSection = () => {
  return (
    <section id="products" className="relative">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </section>
  );
};

export default ProductSection;
