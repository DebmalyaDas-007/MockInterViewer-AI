import { useEffect, useState } from "react";
import axios from "axios";
import {
  BrainCircuit,
  Trophy,
  TrendingUp,
  TrendingDown,
  Target,
  Sparkles,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Loader2,
  AlertCircle,
  ShieldCheck,
  BookOpen,
  MessageCircle,
  Puzzle,
} from "lucide-react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from "recharts";

export default function Evaluation() {
  const session_id = localStorage.getItem("session_id");
  const [evaluation, setEvaluation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/interview/evaluate/${session_id}`
        );
        setEvaluation(res.data.evaluation);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchEvaluation();
  }, []);

  if (loading) {
    return (
      <>
        <style>{baseStyles}</style>
        <div className="ev-root">
          <div className="ev-center-state">
            <div className="ev-badge">
              <BrainCircuit size={13} />
              AI Evaluation
            </div>
            <Loader2 size={40} className="spin" style={{ color: "#6366f1", margin: "24px auto", display: "block" }} />
            <p className="ev-state-text">Analysing your interview responses...</p>
          </div>
        </div>
      </>
    );
  }

  if (!evaluation) {
    return (
      <>
        <style>{baseStyles}</style>
        <div className="ev-root">
          <div className="ev-center-state">
            <AlertCircle size={40} style={{ color: "#ef4444", margin: "0 auto 16px", display: "block" }} />
            <p className="ev-state-text">No evaluation found.</p>
          </div>
        </div>
      </>
    );
  }

  const scores = [
    { key: "confidence",          label: "Confidence",          value: evaluation.confidence,          icon: <ShieldCheck size={15} />,  color: "#818cf8" },
    { key: "knowledge",           label: "Knowledge",           value: evaluation.knowledge,           icon: <BookOpen size={15} />,     color: "#06b6d4" },
    { key: "communication",       label: "Communication",       value: evaluation.communication_skills, icon: <MessageCircle size={15} />, color: "#a78bfa" },
    { key: "problem_solving",     label: "Problem Solving",     value: evaluation.problem_solving,     icon: <Puzzle size={15} />,       color: "#34d399" },
  ];

  const avg = Math.round(scores.reduce((s, c) => s + c.value, 0) / scores.length);

  const radarData = scores.map(s => ({ subject: s.label, value: s.value, fullMark: 100 }));

  const radialData = scores.map(s => ({ name: s.label, value: s.value, fill: s.color }));

  const recColor =
    avg >= 75 ? "#22c55e" :
    avg >= 50 ? "#f59e0b" : "#ef4444";

  const recBg =
    avg >= 75 ? "rgba(34,197,94,0.08)" :
    avg >= 50 ? "rgba(245,158,11,0.08)" : "rgba(239,68,68,0.08)";

  const recBorder =
    avg >= 75 ? "rgba(34,197,94,0.25)" :
    avg >= 50 ? "rgba(245,158,11,0.25)" : "rgba(239,68,68,0.25)";

  return (
    <>
      <style>{baseStyles}</style>
      <div className="ev-root">
        <div className="ev-inner">

          {/* Header */}
          <header className="ev-header">
            <div className="ev-badge">
              <BrainCircuit size={13} />
              Interview Complete
            </div>
            <h1 className="ev-title">Your <span>Evaluation</span></h1>
            <p className="ev-subtitle">Here's a detailed breakdown of your performance.</p>
          </header>

          {/* Overall score + radar side by side */}
          <div className="ev-top-grid">

            {/* Overall score */}
            <div className="ev-card ev-overall">
              <div className="ev-card-label"><Trophy size={12} /> Overall Score</div>
              <div className="ev-big-score" style={{ color: recColor }}>{avg}<span>%</span></div>
              <div className="ev-score-desc">
                {avg >= 75 ? "Strong performance" : avg >= 50 ? "Good effort" : "Needs improvement"}
              </div>
              {/* Mini radial bars */}
              <div style={{ width: "100%", height: 180, marginTop: 8 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%" cy="50%"
                    innerRadius="20%" outerRadius="90%"
                    data={radialData}
                    startAngle={90} endAngle={-270}
                  >
                    <RadialBar dataKey="value" cornerRadius={6} background={{ fill: "rgba(255,255,255,0.03)" }} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Radar */}
            <div className="ev-card ev-radar-card">
              <div className="ev-card-label"><Sparkles size={12} /> Skill Radar</div>
              <div style={{ width: "100%", height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.06)" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: "#64748b", fontSize: 12, fontFamily: "DM Sans" }}
                    />
                    <Radar
                      name="Score"
                      dataKey="value"
                      stroke="#6366f1"
                      fill="#6366f1"
                      fillOpacity={0.15}
                      strokeWidth={2}
                      dot={{ fill: "#818cf8", r: 4 }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Score bars */}
          <div className="ev-card" style={{ marginBottom: 16 }}>
            <div className="ev-card-label"><TrendingUp size={12} /> Score Breakdown</div>
            <div className="ev-score-bars">
              {scores.map(s => (
                <div key={s.key} className="ev-score-row">
                  <div className="ev-score-row-left">
                    <span style={{ color: s.color }}>{s.icon}</span>
                    <span className="ev-score-name">{s.label}</span>
                  </div>
                  <div className="ev-bar-wrap">
                    <div className="ev-bar-track">
                      <div
                        className="ev-bar-fill"
                        style={{ width: `${s.value}%`, background: s.color, boxShadow: `0 0 10px ${s.color}55` }}
                      />
                    </div>
                    <span className="ev-score-pct" style={{ color: s.color }}>{s.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths + Weaknesses */}
          <div className="ev-two-col">
            <div className="ev-card">
              <div className="ev-card-label" style={{ color: "#22c55e" }}>
                <TrendingUp size={12} /> Strengths
              </div>
              <ul className="ev-list">
                {evaluation.strengths.map((item: string, i: number) => (
                  <li key={i} className="ev-list-item">
                    <CheckCircle2 size={15} style={{ color: "#22c55e", flexShrink: 0, marginTop: 2 }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="ev-card">
              <div className="ev-card-label" style={{ color: "#ef4444" }}>
                <TrendingDown size={12} /> Weaknesses
              </div>
              <ul className="ev-list">
                {evaluation.weaknesses.map((item: string, i: number) => (
                  <li key={i} className="ev-list-item">
                    <XCircle size={15} style={{ color: "#ef4444", flexShrink: 0, marginTop: 2 }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Areas to Improve */}
          <div className="ev-card" style={{ marginBottom: 16 }}>
            <div className="ev-card-label"><Target size={12} /> Areas to Improve</div>
            <ul className="ev-list">
              {evaluation.areas_to_improve.map((item: string, i: number) => (
                <li key={i} className="ev-list-item">
                  <Lightbulb size={15} style={{ color: "#f59e0b", flexShrink: 0, marginTop: 2 }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Final Recommendation */}
          <div
            className="ev-card ev-recommendation"
            style={{ background: recBg, borderColor: recBorder }}
          >
            <div className="ev-card-label" style={{ color: recColor }}>
              <Sparkles size={12} /> Final Recommendation
            </div>
            <p className="ev-rec-text" style={{ color: recColor }}>
              {evaluation.final_recommendation}
            </p>
          </div>

        </div>
      </div>
    </>
  );
}

const baseStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
  * { box-sizing: border-box; }

  .ev-root {
    min-height: 100vh;
    background: #080c14;
    font-family: 'DM Sans', sans-serif;
    color: #e2e8f0;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 20px 60px;
    position: relative;
    overflow: hidden;
  }

  .ev-root::before {
    content: '';
    position: fixed;
    top: -200px; left: 50%;
    transform: translateX(-50%);
    width: 800px; height: 500px;
    background: radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }

  .ev-root::after {
    content: '';
    position: fixed;
    bottom: -100px; right: -100px;
    width: 500px; height: 500px;
    background: radial-gradient(ellipse, rgba(6,182,212,0.08) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }

  .ev-inner {
    position: relative; z-index: 1;
    width: 100%; max-width: 780px;
  }

  .ev-center-state {
    position: relative; z-index: 1;
    text-align: center;
    padding-top: 120px;
  }

  .ev-state-text {
    color: #475569;
    font-size: 16px;
    font-family: 'DM Sans', sans-serif;
  }

  .ev-header {
    text-align: center;
    padding: 52px 0 36px;
  }

  .ev-badge {
    display: inline-flex;
    align-items: center; gap: 6px;
    background: rgba(99,102,241,0.12);
    border: 1px solid rgba(99,102,241,0.3);
    color: #a5b4fc;
    font-size: 12px; font-weight: 500;
    letter-spacing: 0.08em; text-transform: uppercase;
    padding: 6px 14px; border-radius: 100px;
    margin-bottom: 20px;
  }

  .ev-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(28px, 5vw, 42px);
    font-weight: 800;
    letter-spacing: -0.03em;
    margin: 0 0 10px;
    background: linear-gradient(135deg, #f1f5f9 0%, #94a3b8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .ev-title span {
    background: linear-gradient(135deg, #818cf8 0%, #06b6d4 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .ev-subtitle {
    color: #475569; font-size: 15px;
    font-weight: 300; margin: 0;
  }

  /* Cards */
  .ev-card {
    background: rgba(15,20,35,0.8);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    padding: 28px;
    backdrop-filter: blur(20px);
    box-shadow:
      0 0 0 1px rgba(99,102,241,0.05),
      0 25px 50px rgba(0,0,0,0.5),
      inset 0 1px 0 rgba(255,255,255,0.05);
    margin-bottom: 16px;
  }

  .ev-card-label {
    display: flex;
    align-items: center; gap: 8px;
    font-size: 11px; font-weight: 500;
    color: #6366f1;
    letter-spacing: 0.1em; text-transform: uppercase;
    margin-bottom: 20px;
  }

  /* Top grid */
  .ev-top-grid {
    display: grid;
    grid-template-columns: 1fr 1.4fr;
    gap: 16px;
    margin-bottom: 16px;
  }

  @media (max-width: 600px) {
    .ev-top-grid { grid-template-columns: 1fr; }
    .ev-two-col  { grid-template-columns: 1fr; }
  }

  .ev-overall {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .ev-big-score {
    font-family: 'Syne', sans-serif;
    font-size: 72px; font-weight: 800;
    line-height: 1;
    margin: 8px 0 4px;
  }

  .ev-big-score span {
    font-size: 32px; opacity: 0.7;
  }

  .ev-score-desc {
    font-size: 13px; color: #475569;
  }

  .ev-radar-card {}

  /* Score bars */
  .ev-score-bars {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .ev-score-row {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .ev-score-row-left {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 150px;
  }

  .ev-score-name {
    font-size: 13px;
    font-weight: 500;
    color: #94a3b8;
  }

  .ev-bar-wrap {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .ev-bar-track {
    flex: 1;
    height: 6px;
    border-radius: 100px;
    background: rgba(255,255,255,0.05);
    overflow: hidden;
  }

  .ev-bar-fill {
    height: 100%;
    border-radius: 100px;
    transition: width 1s ease;
  }

  .ev-score-pct {
    font-family: 'Syne', sans-serif;
    font-size: 13px; font-weight: 700;
    min-width: 38px; text-align: right;
  }

  /* Two col */
  .ev-two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 16px;
  }

  /* Lists */
  .ev-list {
    list-style: none;
    padding: 0; margin: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .ev-list-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 14px;
    color: #94a3b8;
    line-height: 1.5;
  }

  /* Recommendation */
  .ev-recommendation {
    position: relative;
    overflow: hidden;
  }

  .ev-recommendation::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, currentColor, transparent);
    opacity: 0.3;
  }

  .ev-rec-text {
    font-family: 'Syne', sans-serif;
    font-size: 18px; font-weight: 700;
    line-height: 1.5;
    margin: 0;
  }

  /* Spin */
  .spin {
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
`;