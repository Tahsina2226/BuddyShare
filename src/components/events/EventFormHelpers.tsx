import toast, { Toaster } from "react-hot-toast";
import {
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  PartyPopper,
  X,
  Stars
} from "lucide-react";

export const showFancyAlert = (
  message: string, 
  type: 'success' | 'error' | 'info' | 'warning' | 'celebrate' = 'info', 
  duration: number = 4000
) => {
  const baseStyle = "backdrop-blur-xl border-2 rounded-2xl shadow-2xl shadow-black/30";
  
  const styles = {
    success: "bg-gradient-to-br from-emerald-500/40 via-emerald-600/30 to-green-500/40 border-emerald-400/60 text-white",
    error: "bg-gradient-to-br from-rose-500/40 via-rose-600/30 to-red-500/40 border-rose-400/60 text-white",
    info: "bg-gradient-to-br from-cyan-500/40 via-cyan-600/30 to-blue-500/40 border-cyan-400/60 text-white",
    warning: "bg-gradient-to-br from-amber-500/40 via-amber-600/30 to-orange-500/40 border-amber-400/60 text-white",
    celebrate: "bg-gradient-to-br from-purple-500/40 via-pink-500/30 to-rose-500/40 border-pink-400/60 text-white"
  };

  const icons = {
    success: <div className="relative"><CheckCircle className="w-6 h-6 text-emerald-300" /><div className="absolute inset-0 bg-emerald-300/30 rounded-full animate-ping"></div></div>,
    error: <div className="relative"><AlertCircle className="w-6 h-6 text-rose-300" /><div className="absolute inset-0 bg-rose-300/20 rounded-full animate-pulse"></div></div>,
    info: <div className="relative"><Info className="w-6 h-6 text-cyan-300" /><div className="absolute inset-0 bg-cyan-300/20 rounded-full animate-pulse"></div></div>,
    warning: <div className="relative"><AlertTriangle className="w-6 h-6 text-amber-300" /><div className="absolute inset-0 bg-amber-300/20 rounded-full animate-pulse"></div></div>,
    celebrate: <div className="relative"><PartyPopper className="w-6 h-6 text-pink-300" /><div className="absolute inset-0 bg-pink-300/30 rounded-full animate-ping"></div></div>
  };

  toast.custom((t) => (
    <div
      className={`${baseStyle} ${styles[type]} ${
        t.visible ? 'animate-enter' : 'animate-leave'
      } p-5 min-w-[350px] max-w-md relative overflow-hidden group`}
      style={{
        animation: t.visible 
          ? 'fancySlideIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)' 
          : 'fancySlideOut 0.4s ease-in forwards'
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/30 rounded-full w-1 h-1"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 2}s infinite ease-in-out ${i * 0.5}s`
            }}
          />
        ))}
      </div>

      <div className="relative flex items-start gap-4">
        <div className="flex-shrink-0 mt-0.5">
          {icons[type]}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-lg">{message}</p>
          {type === 'celebrate' && (
            <div className="flex items-center gap-1 mt-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Stars 
                  key={i} 
                  className="w-4 h-4 text-yellow-300 animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          )}
        </div>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="flex-shrink-0 hover:bg-white/20 p-1.5 rounded-full hover:rotate-90 transition-all duration-300"
        >
          <X className="w-4 h-4 text-white/80" />
        </button>
      </div>
      
      <div className="relative bg-white/20 mt-4 rounded-full w-full h-1.5 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-white/80 to-white/40 rounded-full h-full"
          style={{
            animation: `shrink ${duration}ms linear forwards, shimmer 2s infinite`,
            transformOrigin: 'left center'
          }}
        />
      </div>
    </div>
  ), {
    duration: duration,
    position: "top-right",
  });
};

export const setupToastStyles = () => {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = `
    @keyframes fancySlideIn {
      0% {
        transform: translateX(100%) translateY(-20px) rotate(5deg);
        opacity: 0;
        filter: blur(10px);
      }
      70% {
        transform: translateX(-10px) rotate(-2deg);
        opacity: 1;
        filter: blur(0);
      }
      100% {
        transform: translateX(0) rotate(0);
        opacity: 1;
        filter: blur(0);
      }
    }

    @keyframes fancySlideOut {
      0% {
        transform: translateX(0) rotate(0);
        opacity: 1;
        filter: blur(0);
      }
      100% {
        transform: translateX(100%) translateY(-20px) rotate(5deg);
        opacity: 0;
        filter: blur(10px);
      }
    }

    @keyframes shrink {
      from {
        transform: scaleX(1);
      }
      to {
        transform: scaleX(0);
      }
    }

    @keyframes shimmer {
      0% {
        background-position: -200px 0;
      }
      100% {
        background-position: calc(200px + 100%) 0;
      }
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0) translateX(0);
      }
      33% {
        transform: translateY(-10px) translateX(5px);
      }
      66% {
        transform: translateY(5px) translateX(-5px);
      }
    }

    @keyframes pulse-glow {
      0%, 100% {
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
      }
      50% {
        box-shadow: 0 0 40px rgba(255, 255, 255, 0.6);
      }
    }

    @keyframes spin-slow {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    @keyframes bounce-soft {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }
  `;
  document.head.appendChild(styleElement);
  
  return () => {
    document.head.removeChild(styleElement);
  };
};