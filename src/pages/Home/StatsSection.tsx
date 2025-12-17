import { useEffect, useState } from "react";

interface StatCardProps {
    icon: React.ReactNode;
    end: number;
    label: string;
    duration?: number;
}

function StatCard({ icon, end, label, duration = 2000 }: StatCardProps) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const stepTime = 50;
        const increment = Math.ceil(end / (duration / stepTime));
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                start = end;
                clearInterval(timer);
            }
            setCount(start);
        }, stepTime);

        return () => clearInterval(timer);
    }, [end, duration]);

    return (
        <section>
            <div className="flex flex-col items-center text-center p-6">
                {/* Icon in white circle */}
                <div className="bg-white rounded-full p-5 mb-4 shadow-lg text-3xl text-orange-500 flex items-center justify-center w-16 h-16">
                    {icon}
                </div>
                {/* Animated number */}
                <div className="text-4xl sm:text-5xl text-white">{count}</div>
                {/* Label */}
                <div className="mt-2 text-base sm:text-lg font-medium text-white">{label}</div>
            </div>
        </section>
    );
}

export default function StatsSection() {
    return (
        <section className="relative w-full py-24 px-6 lg:px-24 bg-[url('/assets/tag-bg.jpg')] bg-cover bg-center bg-no-repeat">
            <div className="absolute inset-0 bg-[#FF431E] opacity-60 z-10"></div>
            <div className="relative z-20 max-w-7xl mx-auto text-center">
                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    <StatCard icon="🏆" end={500} label="Professionnels" />
                    <StatCard icon="⭐" end={1200} label="Avis clients" />
                    <StatCard icon="📍" end={50} label="Villes couvertes" />
                    <StatCard icon="💼" end={150} label="Projets réalisés" />
                </div>
            </div>
        </section>
    );
}
