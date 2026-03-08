import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { startInterview } from "../api/interviewApi";
import {
  BrainCircuit,
  FileText,
  Gauge,
  Hash,
  Sparkles,
  ArrowRight,
  Loader2,
  Mic,
  Shield,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  const [jobDescription, setJobDescription] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [numQuestions, setNumQuestions] = useState(5);
  const [loading, setLoading] = useState(false);

  const handleStartInterview = async () => {
    if (!jobDescription.trim()) {
      alert("Please enter a job description");
      return;
    }
    setLoading(true);
    try {
      const res = await startInterview({
        job_description: jobDescription,
        difficulty: difficulty,
        num_questions: numQuestions,
      });
      const data = res.data;
      localStorage.setItem("session_id", data.session_id);
      navigate("/interview", { state: { question: data.question } });
    } catch (err) {
      console.error(err);
      alert("Failed to start interview");
    }
    setLoading(false);
  };

  const difficultyConfig: Record<string, { color: string; label: string; desc: string }> = {
    easy: { color: "#22c55e", label: "Easy", desc: "Foundational concepts" },
    medium: { color: "#f59e0b", label: "Medium", desc: "Practical challenges" },
    hard: { color: "#ef4444", label: "Hard", desc: "Expert-level questions" },
  };

  const features = [
    { icon: <Mic size={16} />, text: "Voice-powered answers" },
    { icon: <Zap size={16} />, text: "Real-time AI feedback" },
    { icon: <Shield size={16} />, text: "Detailed evaluation" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        * { box-sizing: border-box; }

        .lp-root {
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

        /* Ambient background orbs */
        .lp-root::before {
          content: '';
          position: fixed;
          top: -200px;
          left: 50%;
          transform: translateX(-50%);
          width: 800px;
          height: 500px;
          background: radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .lp-root::after {
          content: '';
          position: fixed;
          bottom: -100px;
          right: -100px;
          width: 500px;
          height: 500px;
          background: radial-gradient(ellipse, rgba(6,182,212,0.08) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .lp-inner {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 680px;
        }

        /* Header */
        .lp-header {
          text-align: center;
          padding: 64px 0 48px;
        }

        .lp-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(99,102,241,0.12);
          border: 1px solid rgba(99,102,241,0.3);
          color: #a5b4fc;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 6px 14px;
          border-radius: 100px;
          margin-bottom: 24px;
          font-family: 'DM Sans', sans-serif;
        }

        .lp-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(36px, 6vw, 58px);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -0.03em;
          margin: 0 0 16px;
          background: linear-gradient(135deg, #f1f5f9 0%, #94a3b8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .lp-title span {
          background: linear-gradient(135deg, #818cf8 0%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .lp-subtitle {
          color: #64748b;
          font-size: 16px;
          font-weight: 300;
          line-height: 1.6;
          margin: 0 auto 28px;
          max-width: 440px;
        }

        .lp-features {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .lp-feature-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #475569;
          font-size: 13px;
        }

        .lp-feature-pill svg {
          color: #6366f1;
        }

        /* Card */
        .lp-card {
          background: rgba(15, 20, 35, 0.8);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 36px;
          backdrop-filter: blur(20px);
          box-shadow:
            0 0 0 1px rgba(99,102,241,0.05),
            0 25px 50px rgba(0,0,0,0.5),
            inset 0 1px 0 rgba(255,255,255,0.05);
        }

        /* Field */
        .lp-field {
          margin-bottom: 24px;
        }

        .lp-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 500;
          color: #94a3b8;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .lp-label svg {
          color: #6366f1;
        }

        .lp-textarea,
        .lp-select,
        .lp-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          color: #e2e8f0;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          padding: 14px 16px;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          outline: none;
          resize: none;
        }

        .lp-textarea::placeholder {
          color: #334155;
        }

        .lp-textarea:focus,
        .lp-select:focus,
        .lp-input:focus {
          border-color: rgba(99,102,241,0.5);
          background: rgba(99,102,241,0.04);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }

        .lp-select {
          appearance: none;
          cursor: pointer;
        }

        .lp-select-wrap {
          position: relative;
        }

        .lp-select-wrap svg {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #475569;
          pointer-events: none;
        }

        /* Difficulty pills */
        .lp-difficulty-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .lp-diff-pill {
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.03);
          padding: 12px 10px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .lp-diff-pill:hover {
          background: rgba(255,255,255,0.06);
        }

        .lp-diff-pill.active {
          border-color: var(--diff-color);
          background: rgba(var(--diff-rgb), 0.08);
          box-shadow: 0 0 12px rgba(var(--diff-rgb), 0.15);
        }

        .lp-diff-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--diff-color);
          margin: 0 auto 6px;
          transition: box-shadow 0.2s;
        }

        .lp-diff-pill.active .lp-diff-dot {
          box-shadow: 0 0 8px var(--diff-color);
        }

        .lp-diff-label {
          font-size: 13px;
          font-weight: 600;
          color: #cbd5e1;
          font-family: 'Syne', sans-serif;
        }

        .lp-diff-desc {
          font-size: 11px;
          color: #475569;
          margin-top: 2px;
        }

        /* Question counter */
        .lp-counter {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .lp-counter-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          color: #94a3b8;
          font-size: 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
          line-height: 1;
        }

        .lp-counter-btn:hover:not(:disabled) {
          background: rgba(99,102,241,0.15);
          border-color: rgba(99,102,241,0.4);
          color: #a5b4fc;
        }

        .lp-counter-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .lp-counter-val {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: #e2e8f0;
          min-width: 40px;
          text-align: center;
        }

        .lp-counter-label {
          font-size: 13px;
          color: #475569;
        }

        /* Divider */
        .lp-divider {
          height: 1px;
          background: rgba(255,255,255,0.05);
          margin: 28px 0;
        }

        /* CTA Button */
        .lp-btn {
          width: 100%;
          padding: 16px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #06b6d4 100%);
          background-size: 200% 200%;
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.02em;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(99,102,241,0.3);
        }

        .lp-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
          opacity: 0;
          transition: opacity 0.2s;
        }

        .lp-btn:hover:not(:disabled)::before {
          opacity: 1;
        }

        .lp-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 32px rgba(99,102,241,0.45);
        }

        .lp-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .lp-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Footer note */
        .lp-footnote {
          text-align: center;
          color: #1e293b;
          font-size: 12px;
          margin-top: 20px;
        }

        .lp-input[type=number]::-webkit-outer-spin-button,
        .lp-input[type=number]::-webkit-inner-spin-button {
          -webkit-appearance: none;
        }
      `}</style>

      <div className="lp-root">
        <div className="lp-inner">

          {/* Header */}
          <header className="lp-header">
            <div className="lp-badge">
              <BrainCircuit size={13} />
              AI-Powered Interview Coach
            </div>
            <h1 className="lp-title">
              Ace Your Next<br /><span>Interview</span>
            </h1>
            <p className="lp-subtitle">
              Practice with an AI interviewer tailored to your role.
              Get scored, evaluated, and ready to impress.
            </p>
            <div className="lp-features">
              {features.map((f, i) => (
                <div key={i} className="lp-feature-pill">
                  {f.icon}
                  {f.text}
                </div>
              ))}
            </div>
          </header>

          {/* Form Card */}
          <div className="lp-card">

            {/* Job Description */}
            <div className="lp-field">
              <label className="lp-label">
                <FileText size={13} />
                Job Description
              </label>
              <textarea
                className="lp-textarea"
                rows={5}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="e.g. Senior Python developer with expertise in REST APIs, FastAPI, and Machine Learning pipelines..."
              />
            </div>

            {/* Difficulty */}
            <div className="lp-field">
              <label className="lp-label">
                <Gauge size={13} />
                Difficulty Level
              </label>
              <div className="lp-difficulty-grid">
                {(["easy", "medium", "hard"] as const).map((lvl) => {
                  const cfg = difficultyConfig[lvl];
                  const rgb = lvl === "easy" ? "34,197,94" : lvl === "medium" ? "245,158,11" : "239,68,68";
                  return (
                    <div
                      key={lvl}
                      className={`lp-diff-pill ${difficulty === lvl ? "active" : ""}`}
                      style={{ "--diff-color": cfg.color, "--diff-rgb": rgb } as React.CSSProperties}
                      onClick={() => setDifficulty(lvl)}
                    >
                      <div className="lp-diff-dot" />
                      <div className="lp-diff-label">{cfg.label}</div>
                      <div className="lp-diff-desc">{cfg.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Number of Questions */}
            <div className="lp-field" style={{ marginBottom: 0 }}>
              <label className="lp-label">
                <Hash size={13} />
                Number of Questions
              </label>
              <div className="lp-counter">
                <button
                  className="lp-counter-btn"
                  disabled={numQuestions <= 1}
                  onClick={() => setNumQuestions(q => Math.max(1, q - 1))}
                >
                  −
                </button>
                <div className="lp-counter-val">{numQuestions}</div>
                <button
                  className="lp-counter-btn"
                  disabled={numQuestions >= 10}
                  onClick={() => setNumQuestions(q => Math.min(10, q + 1))}
                >
                  +
                </button>
                <div className="lp-counter-label">
                  question{numQuestions !== 1 ? "s" : ""} · ~{numQuestions * 2} min
                </div>
              </div>
            </div>

            <div className="lp-divider" />

            {/* CTA */}
            <button
              className="lp-btn"
              onClick={handleStartInterview}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="spin" />
                  Preparing your interview...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Start Interview
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <p className="lp-footnote">
              Your session is private and not stored after completion.
            </p>

          </div>
        </div>
      </div>
    </>
  );
}