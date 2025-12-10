// components/charts/DashboardCharts.tsx
"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale,
} from "chart.js";
import { Line, Bar, Doughnut, Radar } from "react-chartjs-2";
import { TrendingUp, Users, DollarSign, Star } from "lucide-react";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale
);

// Types
interface RevenueData {
  date: string;
  revenue: number;
}

interface EventTypeData {
  type: string;
  count: number;
}

interface ActivityData {
  date: string;
  title: string;
  type: string;
  amount: number;
}

interface StatsChartProps {
  data: number[];
  color: string;
}

interface RevenueChartProps {
  data: RevenueData[];
}

interface EventTypeChartProps {
  data: EventTypeData[];
}

interface ActivityTimelineProps {
  data: ActivityData[];
}

interface ComparisonChartProps {
  labels: string[];
  joinedData: number[];
  hostedData: number[];
}

// Mini Stats Chart
export function StatsChart({ data, color }: StatsChartProps) {
  const gradientColors = {
    "from-cyan-500 to-blue-500": {
      border: "#0ea5e9",
      background: "rgba(14, 165, 233, 0.1)",
    },
    "from-emerald-500 to-green-500": {
      border: "#10b981",
      background: "rgba(16, 185, 129, 0.1)",
    },
    "from-purple-500 to-violet-500": {
      border: "#8b5cf6",
      background: "rgba(139, 92, 246, 0.1)",
    },
    "from-amber-500 to-yellow-500": {
      border: "#f59e0b",
      background: "rgba(245, 158, 11, 0.1)",
    },
    "from-rose-500 to-pink-500": {
      border: "#f43f5e",
      background: "rgba(244, 63, 94, 0.1)",
    },
  };

  const colors = gradientColors[color as keyof typeof gradientColors] || 
    gradientColors["from-cyan-500 to-blue-500"];

  const chartData = {
    labels: ["", "", "", "", "", "", ""],
    datasets: [
      {
        data,
        borderColor: colors.border,
        backgroundColor: colors.background,
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
  };

  return <Line data={chartData} options={options} />;
}

// Revenue Line Chart
export function RevenueChart({ data }: RevenueChartProps) {
  const chartData = {
    labels: data.map((d) => d.date),
    datasets: [
      {
        label: "Revenue",
        data: data.map((d) => d.revenue),
        borderColor: "#0ea5e9",
        backgroundColor: "rgba(14, 165, 233, 0.1)",
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#0ea5e9",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        titleColor: "#ffffff",
        bodyColor: "#e2e8f0",
        borderColor: "#334155",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context: any) => `$${context.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
          drawBorder: false,
        },
        ticks: {
          color: "#94a3b8",
          font: {
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
          drawBorder: false,
        },
        ticks: {
          color: "#94a3b8",
          font: {
            size: 11,
          },
          callback: (value: any) => `$${value}`,
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
}

// Event Type Doughnut Chart
export function EventTypeChart({ data }: EventTypeChartProps) {
  const colors = [
    "rgba(14, 165, 233, 0.9)", // cyan
    "rgba(16, 185, 129, 0.9)", // emerald
    "rgba(245, 158, 11, 0.9)", // amber
    "rgba(139, 92, 246, 0.9)", // violet
    "rgba(244, 63, 94, 0.9)", // rose
    "rgba(59, 130, 246, 0.9)", // blue
  ];

  const chartData = {
    labels: data.map((d) => d.type),
    datasets: [
      {
        data: data.map((d) => d.count),
        backgroundColor: colors,
        borderColor: colors.map((color) => color.replace("0.9", "1")),
        borderWidth: 1.5,
        hoverOffset: 20,
        hoverBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#94a3b8",
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        titleColor: "#ffffff",
        bodyColor: "#e2e8f0",
        borderColor: "#334155",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context: any) => {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} events (${percentage}%)`;
          },
        },
      },
    },
    cutout: "75%",
  };

  return <Doughnut data={chartData} options={options} />;
}

// Activity Timeline Component
export function ActivityTimeline({ data }: ActivityTimelineProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {data.map((activity, index) => (
        <div key={index} className="flex items-start gap-4 group">
          <div className="flex-shrink-0 relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-white text-xs font-bold">
                {activity.date.split(" ")[1]}
              </span>
            </div>
            {index !== data.length - 1 && (
              <div className="absolute left-1/2 top-10 w-0.5 h-6 bg-gradient-to-b from-cyan-500/50 to-transparent -translate-x-1/2"></div>
            )}
          </div>
          <div className="flex-1 pt-1">
            <div className="text-white font-medium group-hover:text-cyan-300 transition-colors">
              {activity.title}
            </div>
            <div className="text-white/60 text-sm mt-1">
              {activity.type === "joined" ? "Joined event" : "Hosted event"} • {formatCurrency(activity.amount)}
            </div>
            <div className="text-white/40 text-xs mt-1">
              {activity.date}
            </div>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            activity.type === "joined" 
              ? "bg-emerald-500/20 text-emerald-400" 
              : "bg-cyan-500/20 text-cyan-400"
          }`}>
            {activity.type}
          </div>
        </div>
      ))}
    </div>
  );
}

// Bar Chart for Comparison
export function ComparisonChart({ labels, joinedData, hostedData }: ComparisonChartProps) {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Joined Events",
        data: joinedData,
        backgroundColor: "rgba(14, 165, 233, 0.7)",
        borderColor: "#0ea5e9",
        borderWidth: 1,
        borderRadius: 6,
        barPercentage: 0.7,
      },
      {
        label: "Hosted Events",
        data: hostedData,
        backgroundColor: "rgba(16, 185, 129, 0.7)",
        borderColor: "#10b981",
        borderWidth: 1,
        borderRadius: 6,
        barPercentage: 0.7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#94a3b8",
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        titleColor: "#ffffff",
        bodyColor: "#e2e8f0",
        borderColor: "#334155",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
          drawBorder: false,
        },
        ticks: {
          color: "#94a3b8",
          font: {
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
          drawBorder: false,
        },
        ticks: {
          color: "#94a3b8",
          font: {
            size: 11,
          },
          callback: (value: any) => `${value} events`,
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}

// Radar Chart for Skills/Interests
export function SkillsRadarChart() {
  const chartData = {
    labels: ["Sports", "Music", "Tech", "Food", "Art", "Gaming", "Travel"],
    datasets: [
      {
        label: "Your Interests",
        data: [85, 70, 90, 60, 75, 80, 65],
        backgroundColor: "rgba(14, 165, 233, 0.2)",
        borderColor: "#0ea5e9",
        borderWidth: 2,
        pointBackgroundColor: "#0ea5e9",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 4,
      },
      {
        label: "Average",
        data: [65, 75, 60, 80, 70, 65, 75],
        backgroundColor: "rgba(139, 92, 246, 0.2)",
        borderColor: "#8b5cf6",
        borderWidth: 2,
        pointBackgroundColor: "#8b5cf6",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#94a3b8",
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        titleColor: "#ffffff",
        bodyColor: "#e2e8f0",
        borderColor: "#334155",
        borderWidth: 1,
      },
    },
    scales: {
      r: {
        angleLines: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#94a3b8",
          backdropColor: "transparent",
        },
        pointLabels: {
          color: "#94a3b8",
          font: {
            size: 11,
          },
        },
      },
    },
  };

  return <Radar data={chartData} options={options} />;
}

// Progress Bar Component
export function ProgressChart({ 
  label, 
  value, 
  max = 100, 
  color = "cyan" 
}: { 
  label: string; 
  value: number; 
  max?: number; 
  color?: string; 
}) {
  const percentage = (value / max) * 100;
  
  const colorClasses = {
    cyan: "from-cyan-500 to-blue-500",
    emerald: "from-emerald-500 to-green-500",
    amber: "from-amber-500 to-yellow-500",
    purple: "from-purple-500 to-violet-500",
    rose: "from-rose-500 to-pink-500",
  };

  const selectedColor = colorClasses[color as keyof typeof colorClasses] || colorClasses.cyan;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-white/70 text-sm">{label}</span>
        <span className="text-white font-medium">{percentage.toFixed(1)}%</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full bg-gradient-to-r ${selectedColor} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-white/50">
        <span>0</span>
        <span>{value}/{max}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

// Metric Card with Mini Chart
export function MetricCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  data 
}: { 
  title: string; 
  value: string; 
  change: string; 
  icon: any; 
  data: number[]; 
}) {
  const isPositive = change.startsWith("+");
  
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 rounded-lg bg-white/10">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${
          isPositive 
            ? "bg-emerald-500/20 text-emerald-400" 
            : "bg-rose-500/20 text-rose-400"
        }`}>
          {change}
        </span>
      </div>
      <div className="mb-2">
        <div className="font-bold text-white text-2xl">{value}</div>
        <div className="text-white/60 text-sm">{title}</div>
      </div>
      <div className="h-16">
        <StatsChart 
          data={data} 
          color={isPositive ? "from-emerald-500 to-green-500" : "from-rose-500 to-pink-500"} 
        />
      </div>
    </div>
  );
}

// Dashboard Summary Component
export function DashboardSummary({ 
  revenueData, 
  eventTypeData, 
  activityData 
}: { 
  revenueData: RevenueData[]; 
  eventTypeData: EventTypeData[]; 
  activityData: ActivityData[]; 
}) {
  const metrics = [
    {
      title: "Total Revenue",
      value: `$${revenueData.reduce((sum, d) => sum + d.revenue, 0).toLocaleString()}`,
      change: "+12.5%",
      icon: DollarSign,
      data: revenueData.map(d => d.revenue),
    },
    {
      title: "Total Events",
      value: eventTypeData.reduce((sum, d) => sum + d.count, 0).toString(),
      change: "+8%",
      icon: Users,
      data: [10, 15, 12, 18, 16, 20, 22],
    },
    {
      title: "Avg. Rating",
      value: "4.7",
      change: "+0.3",
      icon: Star,
      data: [4.2, 4.3, 4.5, 4.6, 4.7, 4.7, 4.8],
    },
    {
      title: "Growth Rate",
      value: "24%",
      change: "+5%",
      icon: TrendingUp,
      data: [15, 18, 20, 22, 24, 23, 24],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="font-bold text-white mb-6">Revenue Trend</h3>
            <div className="h-64">
              <RevenueChart data={revenueData} />
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="font-bold text-white mb-6">Event Distribution</h3>
          <div className="h-64">
            <EventTypeChart data={eventTypeData} />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="font-bold text-white mb-6">Recent Activity</h3>
          <ActivityTimeline data={activityData} />
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="font-bold text-white mb-6">Progress Overview</h3>
          <div className="space-y-6">
            <ProgressChart 
              label="Event Completion" 
              value={85} 
              max={100} 
              color="emerald" 
            />
            <ProgressChart 
              label="Hosting Goals" 
              value={65} 
              max={100} 
              color="cyan" 
            />
            <ProgressChart 
              label="Community Engagement" 
              value={92} 
              max={100} 
              color="purple" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Export all charts
export default {
  StatsChart,
  RevenueChart,
  EventTypeChart,
  ActivityTimeline,
  ComparisonChart,
  SkillsRadarChart,
  ProgressChart,
  MetricCard,
  DashboardSummary,
};