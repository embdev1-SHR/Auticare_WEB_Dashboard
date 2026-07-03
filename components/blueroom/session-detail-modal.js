import { useEffect, useRef, useState } from "react";

/**
 * Live session detail + replay.
 * - Session meta: login time, elapsed, mode, patient/class, live status.
 * - Activity timeline: each activity (screen) with start → end + duration.
 * - Prompts / trigger taps log.
 * - Touch replay canvas: heatmap over a screen replica + frequent hotspots.
 * Auto-refreshes every 4s while the session is live.
 */
export default function SessionDetailModal({ sessionId, centerID, fetchDetail, fmtElapsed, onClose }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef(null);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const r = await fetchDetail(sessionId, centerID);
        if (alive) setDetail(r.data?.results?.data || null);
      } catch (_) {}
      if (alive) setLoading(false);
    };
    load();
    const id = setInterval(load, 4000);
    return () => { alive = false; clearInterval(id); };
  }, [sessionId, centerID]);

  const session = detail?.session;
  const events = detail?.events || [];
  const isLive = session?.status === "live";

  const touches = events.filter((e) => e.event_type === "touch" && e.x != null);
  const buttons = events.filter((e) => e.event_type === "button");

  // Build the activity timeline from scenario_start events.
  const activities = [];
  events.forEach((e) => {
    if (e.event_type === "scenario_start") {
      activities.push({ name: e.game_key || e.scenario_id || e.label || "activity", start: e.ts, end: null });
    }
  });
  for (let i = 0; i < activities.length; i++) {
    activities[i].end = activities[i + 1] ? activities[i + 1].start : (session?.ended_at || null);
  }

  // Draw heatmap + frequent-interaction hotspots.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#0f1117";
    ctx.fillRect(0, 0, W, H);

    touches.forEach(({ x, y, screen_width, screen_height }) => {
      const px = (x / (screen_width || 1920)) * W;
      const py = (y / (screen_height || 1080)) * H;
      const g = ctx.createRadialGradient(px, py, 0, px, py, 22);
      g.addColorStop(0, "rgba(255,80,80,0.35)");
      g.addColorStop(1, "rgba(255,80,80,0)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(px, py, 22, 0, Math.PI * 2); ctx.fill();
    });

    // Frequent spots — bucket into a 12×8 grid, ring the busiest cells.
    const cols = 12, rows = 8, buckets = {};
    touches.forEach(({ x, y, screen_width, screen_height }) => {
      const nx = Math.min(cols - 1, Math.floor((x / (screen_width || 1920)) * cols));
      const ny = Math.min(rows - 1, Math.floor((y / (screen_height || 1080)) * rows));
      const k = nx + "," + ny;
      buckets[k] = (buckets[k] || 0) + 1;
    });
    const top = Object.entries(buckets).sort((a, b) => b[1] - a[1]).slice(0, 5);
    top.forEach(([k, count]) => {
      const [nx, ny] = k.split(",").map(Number);
      const px = ((nx + 0.5) / cols) * W, py = ((ny + 0.5) / rows) * H;
      ctx.strokeStyle = "#f1b44c"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(px, py, 18, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = "#f1b44c";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(String(count), px, py);
    });
  }, [detail]);

  const fmtTime = (t) => (t ? new Date(t).toLocaleTimeString() : "—");
  const dur = (a, b) => {
    if (!a || !b) return "—";
    const s = Math.round((new Date(b) - new Date(a)) / 1000);
    return fmtElapsed(s);
  };

  return (
    <div className="brm-overlay" onClick={onClose}>
      <div className="brm-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="brm-head">
          <div>
            <div className="d-flex align-items-center gap-2">
              {isLive && <span className="brm-live" />}
              <h5 className="mb-0">
                {session
                  ? (session.session_mode === "individual"
                    ? (session.patient_name || `Patient #${session.patient_id}`)
                    : (session.class_name || "Class session"))
                  : "Session"}
              </h5>
              {session && (
                <span className={`badge ${session.session_mode === "individual" ? "bg-info" : "bg-warning text-dark"}`}>
                  {session.session_mode}
                </span>
              )}
              <span className={`badge ${isLive ? "bg-danger" : "bg-secondary"}`}>{isLive ? "LIVE" : "ENDED"}</span>
            </div>
            {session && <div className="text-muted small mt-1">{session.class_name || ""}</div>}
          </div>
          <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>Close ✕</button>
        </div>

        {loading && !session ? (
          <div className="text-center text-muted py-5">Loading session…</div>
        ) : !session ? (
          <div className="text-center text-muted py-5">Session not found.</div>
        ) : (
          <div className="brm-body">
            {/* Left — replay */}
            <div className="brm-left">
              <div className="brm-metrics">
                <div className="brm-metric"><span>Login</span><strong>{fmtTime(session.login_at)}</strong></div>
                <div className="brm-metric"><span>Elapsed</span><strong>{fmtElapsed(session.elapsed_seconds)}</strong></div>
                <div className="brm-metric"><span>Touches</span><strong>{touches.length}</strong></div>
                <div className="brm-metric"><span>Prompts</span><strong>{buttons.length}</strong></div>
              </div>
              <div className="brm-screen">
                <canvas ref={canvasRef} width={720} height={405} />
              </div>
              <div className="brm-legend">
                <span><i className="dot red" /> Touch density</span>
                <span><i className="ring gold" /> Frequent interaction spot (with count)</span>
              </div>
            </div>

            {/* Right — timeline + prompts */}
            <div className="brm-right">
              <h6 className="brm-sec">Activity Timeline</h6>
              {activities.length === 0 ? (
                <p className="text-muted small">No activities recorded yet.</p>
              ) : (
                <ul className="brm-timeline">
                  {activities.slice().reverse().map((a, i) => (
                    <li key={i}>
                      <div className="brm-tl-dot" />
                      <div className="brm-tl-body">
                        <div className="fw-bold">{a.name}</div>
                        <div className="text-muted small">
                          {fmtTime(a.start)} → {a.end ? fmtTime(a.end) : (isLive ? "now" : "—")} · {dur(a.start, a.end || (isLive ? new Date() : null))}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <h6 className="brm-sec mt-3">Prompts & Triggers</h6>
              {buttons.length === 0 ? (
                <p className="text-muted small">No prompt / button taps captured.</p>
              ) : (
                <div className="brm-prompts">
                  {buttons.slice(-40).reverse().map((b) => (
                    <div className="brm-prompt" key={b.id}>
                      <span className="text-muted small">{fmtTime(b.ts)}</span>
                      <span className="brm-prompt-label">{b.label || "(tap)"}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .brm-overlay {
          position: fixed; inset: 0; background: rgba(15,23,42,0.55);
          z-index: 1080; display: flex; align-items: center; justify-content: center;
          padding: 20px; backdrop-filter: blur(2px);
        }
        .brm-modal {
          background: #fff; border-radius: 18px; width: min(1080px, 100%);
          max-height: 92vh; overflow: hidden; display: flex; flex-direction: column;
          box-shadow: 0 30px 80px rgba(0,0,0,0.35);
        }
        .brm-head {
          display: flex; justify-content: space-between; align-items: flex-start;
          padding: 18px 22px; border-bottom: 1px solid #eef1f5;
        }
        .brm-live {
          width: 12px; height: 12px; border-radius: 50%; background: #f46a6a;
          animation: brmpulse 1.6s infinite;
        }
        @keyframes brmpulse {
          0% { box-shadow: 0 0 0 0 rgba(244,106,106,0.6); }
          70% { box-shadow: 0 0 0 8px rgba(244,106,106,0); }
          100% { box-shadow: 0 0 0 0 rgba(244,106,106,0); }
        }
        .brm-body { display: flex; gap: 20px; padding: 20px 22px; overflow-y: auto; }
        .brm-left { flex: 1 1 60%; min-width: 0; }
        .brm-right { flex: 1 1 40%; min-width: 260px; border-left: 1px solid #eef1f5; padding-left: 20px; }
        .brm-metrics { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; margin-bottom: 14px; }
        .brm-metric {
          background: #f8fafc; border: 1px solid #eef1f5; border-radius: 10px;
          padding: 10px; text-align: center;
        }
        .brm-metric span { display: block; font-size: 11px; color: #94a3b8; font-weight: 700; text-transform: uppercase; }
        .brm-metric strong { font-size: 16px; color: #1e293b; }
        .brm-screen { border-radius: 12px; overflow: hidden; background: #0f1117; }
        .brm-screen :global(canvas) { width: 100%; display: block; }
        .brm-legend { display: flex; gap: 18px; margin-top: 10px; font-size: 12px; color: #64748b; }
        .brm-legend i { display: inline-block; width: 12px; height: 12px; margin-right: 5px; vertical-align: middle; }
        .brm-legend .dot.red { background: rgba(255,80,80,0.6); border-radius: 50%; }
        .brm-legend .ring.gold { border: 2px solid #f1b44c; border-radius: 50%; }
        .brm-sec { font-weight: 800; color: #334155; margin-bottom: 10px; }
        .brm-timeline { list-style: none; margin: 0; padding: 0; }
        .brm-timeline li { display: flex; gap: 10px; padding: 6px 0; border-left: 2px solid #e2e8f0; margin-left: 5px; padding-left: 14px; position: relative; }
        .brm-tl-dot { position: absolute; left: -6px; top: 12px; width: 10px; height: 10px; border-radius: 50%; background: #556ee6; }
        .brm-prompts { max-height: 220px; overflow-y: auto; }
        .brm-prompt { display: flex; justify-content: space-between; gap: 10px; padding: 5px 0; border-bottom: 1px dashed #eef1f5; }
        .brm-prompt-label { font-weight: 600; color: #334155; text-align: right; }
        @media (max-width: 800px) {
          .brm-body { flex-direction: column; }
          .brm-right { border-left: none; padding-left: 0; border-top: 1px solid #eef1f5; padding-top: 16px; }
        }
      `}</style>
    </div>
  );
}
