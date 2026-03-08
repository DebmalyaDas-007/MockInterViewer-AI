import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { submitAnswer } from "../api/interviewApi";
import {
  BrainCircuit,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Send,
  Loader2,
  Sparkles,
  MessageSquare,
} from "lucide-react";

export default function Interview() {
  const navigate = useNavigate();
  const location = useLocation();

  const session_id = localStorage.getItem("session_id");

  const [question, setQuestion] = useState(location.state?.question || "");
  const [answer, setAnswer] = useState("");
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);

  /* TEXT TO SPEECH */
  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const repeatQuestion = () => speak(question);
  const stopSpeaking = () => window.speechSynthesis.cancel();

  /* SPEECH RECOGNITION */
  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setAnswer(transcript);
    };
    recognition.start();
  };

  useEffect(() => {
    if (question) speak(question);
  }, [question]);

  /* SUBMIT ANSWER */
  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    try {
      const res = await submitAnswer({ session_id, answer });
      let data = res.data;
      if (typeof data === "object") data = data.question;
      if (data === "Interview complete.") {
        navigate("/evaluation");
      } else {
        setQuestion(data);
        setAnswer("");
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        * { box-sizing: border-box; }

        .iv-root {
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

        .iv-root::before {
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

        .iv-root::after {
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

        .iv-inner {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 700px;
        }

        /* Header */
        .iv-header {
          text-align: center;
          padding: 52px 0 36px;
        }

        .iv-badge {
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
          margin-bottom: 20px;
        }

        .iv-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(28px, 5vw, 42px);
          font-weight: 800;
          letter-spacing: -0.03em;
          margin: 0;
          background: linear-gradient(135deg, #f1f5f9 0%, #94a3b8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .iv-title span {
          background: linear-gradient(135deg, #818cf8 0%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Question Card */
        .iv-question-card {
          background: rgba(15, 20, 35, 0.8);
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 20px;
          padding: 32px;
          backdrop-filter: blur(20px);
          box-shadow:
            0 0 0 1px rgba(99,102,241,0.05),
            0 25px 50px rgba(0,0,0,0.5),
            inset 0 1px 0 rgba(255,255,255,0.05);
          margin-bottom: 16px;
          position: relative;
          overflow: hidden;
        }

        .iv-question-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99,102,241,0.5), rgba(6,182,212,0.5), transparent);
        }

        .iv-question-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 500;
          color: #6366f1;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .iv-question-text {
          font-family: 'Syne', sans-serif;
          font-size: clamp(16px, 2.5vw, 20px);
          font-weight: 600;
          color: #f1f5f9;
          line-height: 1.55;
          margin: 0 0 24px;
        }

        /* Voice controls */
        .iv-voice-controls {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .iv-voice-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 16px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          color: #94a3b8;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .iv-voice-btn:hover {
          background: rgba(99,102,241,0.1);
          border-color: rgba(99,102,241,0.3);
          color: #a5b4fc;
        }

        .iv-voice-btn svg {
          color: #6366f1;
        }

        /* Answer Card */
        .iv-answer-card {
          background: rgba(15, 20, 35, 0.8);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 32px;
          backdrop-filter: blur(20px);
          box-shadow:
            0 0 0 1px rgba(99,102,241,0.05),
            0 25px 50px rgba(0,0,0,0.5),
            inset 0 1px 0 rgba(255,255,255,0.05);
        }

        .iv-section-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 500;
          color: #475569;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 14px;
        }

        .iv-section-label svg {
          color: #6366f1;
        }

        /* Mic button */
        .iv-mic-row {
          margin-bottom: 16px;
        }

        .iv-mic-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 20px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          color: #94a3b8;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .iv-mic-btn:hover {
          background: rgba(99,102,241,0.12);
          border-color: rgba(99,102,241,0.35);
          color: #a5b4fc;
        }

        .iv-mic-btn.listening {
          background: rgba(239,68,68,0.1);
          border-color: rgba(239,68,68,0.35);
          color: #fca5a5;
          animation: pulse-border 1.5s ease-in-out infinite;
        }

        .iv-mic-btn.listening svg {
          color: #ef4444;
        }

        @keyframes pulse-border {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.3); }
          50% { box-shadow: 0 0 0 6px rgba(239,68,68,0); }
        }

        .iv-listening-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #f87171;
          margin-left: 12px;
          vertical-align: middle;
        }

        .iv-listening-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #ef4444;
          animation: blink 1s ease-in-out infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }

        /* Textarea */
        .iv-textarea {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          color: #e2e8f0;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          line-height: 1.6;
          padding: 14px 16px;
          resize: none;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }

        .iv-textarea::placeholder {
          color: #334155;
        }

        .iv-textarea:focus {
          border-color: rgba(99,102,241,0.5);
          background: rgba(99,102,241,0.04);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }

        .iv-divider {
          height: 1px;
          background: rgba(255,255,255,0.05);
          margin: 24px 0;
        }

        /* Submit button */
        .iv-submit-btn {
          width: 100%;
          padding: 16px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #06b6d4 100%);
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

        .iv-submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
          opacity: 0;
          transition: opacity 0.2s;
        }

        .iv-submit-btn:hover:not(:disabled)::before { opacity: 1; }

        .iv-submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 32px rgba(99,102,241,0.45);
        }

        .iv-submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="iv-root">
        <div className="iv-inner">

          {/* Header */}
          <header className="iv-header">
            <div className="iv-badge">
              <BrainCircuit size={13} />
              AI Interview Session
            </div>
            <h1 className="iv-title">
              Your <span>Interview</span>
            </h1>
          </header>

          {/* Question Card */}
          <div className="iv-question-card">
            <div className="iv-question-label">
              <Sparkles size={12} />
              Question
            </div>
            <p className="iv-question-text">{question}</p>

            <div className="iv-voice-controls">
              <button className="iv-voice-btn" onClick={repeatQuestion}>
                <Volume2 size={15} />
                Repeat Question
              </button>
              <button className="iv-voice-btn" onClick={stopSpeaking}>
                <VolumeX size={15} />
                Stop Speaking
              </button>
            </div>
          </div>

          {/* Answer Card */}
          <div className="iv-answer-card">
            <div className="iv-section-label">
              <MessageSquare size={12} />
              Your Answer
            </div>

            {/* Mic */}
            <div className="iv-mic-row">
              <button
                className={`iv-mic-btn ${listening ? "listening" : ""}`}
                onClick={startListening}
              >
                {listening ? <MicOff size={15} /> : <Mic size={15} />}
                {listening ? "Listening..." : "Start Voice Answer"}
              </button>
              {listening && (
                <span className="iv-listening-tag">
                  <span className="iv-listening-dot" />
                  Recording
                </span>
              )}
            </div>

            {/* Textarea */}
            <textarea
              className="iv-textarea"
              rows={6}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Your spoken answer will appear here, or type directly..."
            />

            <div className="iv-divider" />

            {/* Submit */}
            <button
              className="iv-submit-btn"
              onClick={handleSubmit}
              disabled={loading || !answer.trim()}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="spin" />
                  AI is thinking...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Submit Answer
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </>
  );
}