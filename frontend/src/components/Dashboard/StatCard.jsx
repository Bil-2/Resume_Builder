import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import useCountUp from '../../hooks/useCountUp';

const StatCard = ({ stat, index }) => {
  const count = useCountUp(stat.value, 1500);

  return (
    <Link
      to={stat.link}
      className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:border-transparent hover:shadow-2xl transition-all duration-300 overflow-hidden scroll-animate"
      style={{transitionDelay: `${index * 100 + 300}ms`}}
    >
      {/* Gradient Background on Hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">{stat.label}</p>
          <p className="text-4xl font-bold text-gray-900 dark:text-white tabular-nums">
            {count}
          </p>
          <div className="flex items-center mt-2 text-sm text-green-600 dark:text-green-400">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>Active</span>
          </div>
        </div>
        <div className={`${stat.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
          <stat.icon className={stat.iconColor} size={28} />
        </div>
      </div>
    </Link>
  );
};

export default StatCard;
