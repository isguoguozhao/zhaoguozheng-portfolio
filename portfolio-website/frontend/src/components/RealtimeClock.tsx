import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import './RealtimeClock.css';

export default function RealtimeClock() {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    // 格式化时间函数
    const formatTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    };

    // 初始化时间
    setCurrentTime(formatTime());

    // 每秒更新时间
    const intervalId = setInterval(() => {
      setCurrentTime(formatTime());
    }, 1000);

    // 组件卸载时清除定时器
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="realtime-clock">
      <Clock size={14} className="realtime-clock-icon" />
      <span className="realtime-clock-label">时间:</span>
      <span className="realtime-clock-value">{currentTime}</span>
    </div>
  );
}
