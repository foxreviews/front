import { useEffect, useRef, useState } from "react";
import { Trophy, Layers, Smile, Coffee } from "lucide-react";
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

  const iconClass = "w-7 h-7"; 

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-24 px-6 lg:px-24 bg-[url('/assets/tag-bg.jpg')] bg-cover bg-center bg-no-repeat"
    >
      <div className="absolute inset-0 bg-[#FF431E] opacity-60 z-10" />

      <div className="relative z-20 max-w-7xl mx-auto text-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <StatCard
            icon={<Trophy className={iconClass} />}
            end={500}
            label="Professionnels"
            start={startCount}
          />

          <StatCard
            icon={<Layers className={iconClass} />}
            end={1200}
            label="Stacks traités"
            start={startCount}
          />

          <StatCard
            icon={<Smile className={iconClass} />}
            end={50}
            label="Clients satisfaits"
            start={startCount}
          />

          <StatCard
            icon={<Coffee className={iconClass} />}
            end={150}
            label="Pauses café"
            start={startCount}
          />
        </div>
      </div>
    </section>
  );
}