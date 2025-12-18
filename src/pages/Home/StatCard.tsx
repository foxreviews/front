import { useEffect, useState } from "react";

interface StatCardProps {
  icon: React.ReactNode;
  end: number;
  label: string;
  duration?: number;
  start: boolean; 
  color?: string; // nouvelle prop
}

function StatCard({
  icon,
  end,
  label,
  duration = 800,
  start,
  color = "text-white", // valeur par défaut
}: StatCardProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return; 
    let current = 0;
    const stepTime = 30;
    const increment = Math.ceil(end / (duration / stepTime));

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        current = end;
        clearInterval(timer);
      }
      setCount(current);
    }, stepTime);

    return () => clearInterval(timer);
  }, [start, end, duration]);

  return (
    <div className="flex flex-col items-center text-center p-6">
      <div className="bg-white rounded-full p-5 mb-4 shadow-lg text-3xl text-orange-500 flex items-center justify-center w-16 h-16">
        {icon}
      </div>

      <div className={`text-4xl sm:text-5xl ${color}`}>
        {count}{" +"}
      </div>

      <div className={`mt-2 text-base sm:text-lg font-medium ${color}`}>
        {label}
      </div>
    </div>
  );
}

export default StatCard;