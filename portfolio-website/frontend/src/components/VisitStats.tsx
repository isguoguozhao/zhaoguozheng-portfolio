import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { statsApi } from '../services/userApi';
import './VisitStats.css';

export default function VisitStats() {
  const [stats, setStats] = useState({ total_visits: 0, today_visits: 0 });

  useEffect(() => {
    // 记录访问
    statsApi.recordVisit().catch(() => {});

    // 获取统计数据
    const fetchStats = async () => {
      try {
        const response = await statsApi.getStats();
        setStats(response.data);
      } catch (error) {
        console.error('获取访问统计失败:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="visit-stats">
      <Eye size={14} className="visit-stats-icon" />
      <span className="visit-stats-label">浏览:</span>
      <span className="visit-stats-value">{stats.total_visits.toLocaleString()}</span>
    </div>
  );
}
