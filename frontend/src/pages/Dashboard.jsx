import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import ReportsPreview from "../components/ReportsPreview";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [expenses, setExpenses] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [analytics, setAnalytics] = useState({});

  const [loading, setLoading] = useState(true);

  // Add dashboard-page class to body when component mounts
  useEffect(() => {
    document.body.classList.add("dashboard-page");

    // Check for token in URL params (from OAuth redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      // Remove token from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Cleanup: remove the class when component unmounts
    return () => {
      document.body.classList.remove("dashboard-page");
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      let userId = localStorage.getItem("userId");
      if (!userId && token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          userId = payload.id;
        } catch (e) {
          userId = "69b452f703a7b1072068aae8";
        }
      }
      
      const [summaryRes, recRes, anaRes] = await Promise.all([
        axios.get("http://localhost:5000/api/expenses/summary", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`http://localhost:5000/api/training/recommendations/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`http://localhost:5000/api/training/analytics/${userId}`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      setStats(summaryRes.data.stats || {});
      setExpenses(summaryRes.data.recentExpenses ? summaryRes.data.recentExpenses.filter(exp => exp.category !== 'Emergency') : []);
      setRecommendations(recRes.data.recommendations || []);
      setAnalytics(anaRes.data || {});
    } catch (err) {
      console.error("Error fetching dashboard:", err);
      // Keep UI stable; if fetch fails we don't want to show misleading recommendations.
      setRecommendations([]);
      setAnalytics({ stats: { topCategory: null, topCategoryShare: 0, emergencyTotal: 0, emergencyCount: 0 } });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const topCategory = analytics.stats?.topCategory || null;
  const topCategoryShare = analytics.stats?.topCategoryShare ?? 0;
  const emergencyTotal = analytics.stats?.emergencyTotal ?? 0;
  const emergencyCount = analytics.stats?.emergencyCount ?? 0;

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-grid">
          {/* Summary stats row */}
          <div className="stats-cards">
            <div className={`card ${loading ? 'loading' : ''}`}>
              <h3>Total Expenses</h3>
              <p>
                {loading ? "..." : (stats.totalExpenses === 0 || !stats.totalExpenses ? "No expense added yet. Add expense through clicking Expenses" : `₹${stats.totalExpenses}`)}
              </p>
            </div>
            <div className={`card ${loading ? 'loading' : ''}`}>
              <h3>This Month</h3>
              <p>₹{loading ? "..." : (stats.thisMonth || 0)}</p>
            </div>
            <div className={`card ${loading ? 'loading' : ''}`}>
              <h3>Remaining Budget</h3>
              <p>{loading ? "..." : (!stats.hasSalary ? "No salary amount added yet. Add your monthly salary through clicking Salary" : `₹${stats.remainingBudget || 0}`)}</p>
            </div>
          </div>

          {/* Analytics insights */}
          <div className="analytics-card card">
            <h3>📊 Analytics</h3>
            {loading ? (
              <p>Loading analytics…</p>
            ) : (
              <>
                {topCategory ? (
                  <p>
                    <strong>{topCategory}</strong> is your top expense category this month ({Math.round(topCategoryShare)}% of total spend).
                  </p>
                ) : (
                  <p>Add some expenses to see top categories.</p>
                )}

                {emergencyTotal > 0 ? (
                  <p>
                    Emergency spending this month: <strong>₹{emergencyTotal.toFixed(0)}</strong> ({emergencyCount} expenses).
                  </p>
                ) : (
                  <p>No emergency expenses recorded this month.</p>
                )}
              </>
            )}
          </div>

          {/* Recommendations */}
          <div className="recommendations-card card">
            <h3>Recommendations</h3>
            {loading ? (
              <p>Loading recommendations…</p>
            ) : (
              <ul>
                {recommendations.slice(0, 5).map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Reports preview */}
          <div className="reports-preview">
            <h2>Reports Preview</h2>
            <ReportsPreview expenses={expenses} loading={loading} />
          </div>

        </div>
      </div>
    </>
  );
};

export default Dashboard;

