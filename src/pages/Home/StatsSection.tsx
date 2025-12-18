import { useEffect, useRef, useState } from "react";
import StatCard from "./StatCard";

export default function StatsSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [startCount, setStartCount] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartCount(true);
          observer.disconnect(); 
        }
      },
      { threshold: 0.3 } 
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-24 px-6 lg:px-24 bg-[url('/assets/tag-bg.jpg')] bg-cover bg-center bg-no-repeat"
    >
      <div className="absolute inset-0 bg-[#FF431E] opacity-60 z-10" />

      <div className="relative z-20 max-w-7xl mx-auto text-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <StatCard icon="🏆" end={500} label="Professionnels" start={startCount} />
          <StatCard icon="⭐" end={1200} label="Avis clients" start={startCount} />
          <StatCard icon="📍" end={50} label="Villes couvertes" start={startCount} />
          <StatCard icon="💼" end={150} label="Projets réalisés" start={startCount} />
        </div>
      </div>
    </section>
  );
}