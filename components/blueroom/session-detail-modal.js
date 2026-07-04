import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

// One small heatmap canvas for a single scenario's touches, drawn over the
// captured scenario screen (bgUrl) when available, else a dark canvas.
function ScenarioHeatmap({ touches, bgUrl }) {
  const ref = useRef(null);
  const [bg, setBg] = useState(null);

  useEffect(() => {
    if (!bgUrl) { setBg(null); return; }
    const img = new Image();
    img.onload = () => setBg(img);
    img.onerror = () => setBg(null);
    img.src = bgUrl; // no crossOrigin: we only draw it, never read pixels back
  }, [bgUrl]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    if (bg) {
      // cover-fit the screenshot
      const ar = bg.width / bg.height, car = W / H;
      let dw = W, dh = H, dx = 0, dy = 0;
      if (ar > car) { dh = H; dw = H * ar; dx = (W - dw) / 2; }
      else { dw = W; dh = W / ar; dy = (H - dh) / 2; }
      ctx.drawImage(bg, dx, dy, dw, dh);
      ctx.fillStyle = "rgba(15,17,23,0.35)"; // dim so touches pop
      ctx.fillRect(0, 0, W, H);
    } else {
      ctx.fillStyle = "#0f1117";
      ctx.fillRect(0, 0, W, H);
    }
    touches.forEach(({ x, y, screen_width, screen_height }) => {
      const px = (x / (screen_width || 1920)) * W;
      const py = (y / (screen_height || 1080)) * H;
      const g = ctx.createRadialGradient(px, py, 0, px, py, 16);
      g.addColorStop(0, "rgba(255,80,80,0.4)");
      g.addColorStop(1, "rgba(255,80,80,0)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(px, py, 16, 0, Math.PI * 2); ctx.fill();
    });
    // frequent spots (grid 10x6)
    const cols = 10, rows = 6, buckets = {};
    touches.forEach(({ x, y, screen_width, screen_height }) => {
      const nx = Math.min(cols - 1, Math.floor((x / (screen_width || 1920)) * cols));
      const ny = Math.min(rows - 1, Math.floor((y / (screen_height || 1080)) * rows));
      buckets[nx + "," + ny] = (buckets[nx + "," + ny] || 0) + 1;
    });
    Object.entries(buckets).sort((a, b) => b[1] - a[1]).slice(0, 3).forEach(([k, count]) => {
      const [nx, ny] = k.split(",").map(Number);
      const px = ((nx + 0.5) / cols) * W, py = ((ny + 0.5) / rows) * H;
      ctx.strokeStyle = "#f1b44c"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(px, py, 14, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = "#f1b44c"; ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(String(count), px, py);
    });
  }, [touches, bg]);
  return <canvas ref={ref} width={360} height={216} style={{ width: "100%", display: "block", borderRadius: 8 }} />;
}

export default function SessionDetailModal({ sessionId, centerID, fetchDetail, fetchPatientSessions, fmtElapsed, onClose }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [tab, setTab] = useState("scenarios"); // scenarios | prompts | trend

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
  const shots = detail?.shots || {};
  const isLive = session?.status === "live";
  const patientId = session?.patient_id;

  // Load patient history once we know the patient (individual mode).
  useEffect(() => {
    if (!patientId) return;
    fetchPatientSessions(patientId, centerID)
      .then((r) => setHistory(r.data?.results?.data || []))
      .catch(() => {});
  }, [patientId]);

  const touches = events.filter((e) => e.event_type === "touch" && e.x != null);
  const buttons = events.filter((e) => e.event_type === "button");

  // Group everything per scenario (exclude the main menu).
  const scenarioMap = {};
  const order = [];
  events.forEach((e) => {
    const key = e.game_key || e.scenario_id;
    if (!key || key === "menu" || key === "index") return;
    if (!scenarioMap[key]) {
      scenarioMap[key] = { name: key, touches: [], starts: [], durationMs: 0, completion: null, score: null };
      order.push(key);
    }
    const sc = scenarioMap[key];
    if (e.event_type === "touch" && e.x != null) sc.touches.push(e);
    if (e.event_type === "scenario_start") sc.starts.push(e.ts);
    if (e.event_type === "scenario_end" && e.duration_ms) sc.durationMs += e.duration_ms;
    if (e.event_type === "scenario_complete") {
      if (e.duration_ms) sc.durationMs += e.duration_ms;
      if (e.completion_pct != null) sc.completion = e.completion_pct;
      if (e.label != null && e.label !== "") sc.score = e.label;
    }
  });
  const scenarios = order.map((k) => scenarioMap[k]);

  const fmtTime = (t) => (t ? new Date(t).toLocaleTimeString() : "—");
  const fmtDur = (ms) => (ms ? fmtElapsed(Math.round(ms / 1000)) : "—");

  // Trend chart data (most recent first from API → reverse for chronological).
  const hist = history.slice().reverse();
  const trendCats = hist.map((h) => new Date(h.login_at).toLocaleDateString());
  const trendSeries = [
    { name: "Touches", type: "column", data: hist.map((h) => h.touch_count || 0) },
    { name: "Avg completion %", type: "line", data: hist.map((h) => h.avg_completion || 0) },
    { name: "Time (min)", type: "line", data: hist.map((h) => Math.round((h.duration_seconds || 0) / 60)) },
  ];
  const trendOptions = {
    chart: { toolbar: { show: false } },
    stroke: { width: [0, 3, 3], curve: "smooth" },
    xaxis: { categories: trendCats },
    yaxis: [
      { title: { text: "Touches" } },
      { opposite: true, max: 100, min: 0, title: { text: "% / min" } },
      { show: false, max: 100, min: 0 },
    ],
    colors: ["#556ee6", "#34c38f", "#f1b44c"],
    legend: { position: "top" },
    dataLabels: { enabled: false },
  };

  return (
    <div className="brm-overlay" onClick={onClose}>
      <div className="brm-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="brm-head">
          <div>
            <div className="d-flex align-items-center gap-2 flex-wrap">
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
          <>
            {/* Metrics */}
            <div className="brm-metrics">
              <div className="brm-metric"><span>Login</span><strong>{fmtTime(session.login_at)}</strong></div>
              <div className="brm-metric"><span>Elapsed</span><strong>{fmtElapsed(session.elapsed_seconds)}</strong></div>
              <div className="brm-metric"><span>Activities</span><strong>{scenarios.length}</strong></div>
              <div className="brm-metric"><span>Touches</span><strong>{touches.length}</strong></div>
              <div className="brm-metric"><span>Prompts</span><strong>{buttons.length}</strong></div>
            </div>

            {/* Tabs */}
            <div className="brm-tabs">
              <button className={tab === "scenarios" ? "on" : ""} onClick={() => setTab("scenarios")}>Per-Scenario Report</button>
              <button className={tab === "prompts" ? "on" : ""} onClick={() => setTab("prompts")}>Prompts & Timeline</button>
              {patientId ? <button className={tab === "trend" ? "on" : ""} onClick={() => setTab("trend")}>Patient Trend</button> : null}
            </div>

            <div className="brm-body">
              {/* ---- Per-scenario report ---- */}
              {tab === "scenarios" && (
                scenarios.length === 0 ? (
                  <p className="text-muted small">No scenario activity yet (main menu touches are excluded).</p>
                ) : (
                  <>
                    <table className="table table-sm mb-3">
                      <thead>
                        <tr><th>Scenario</th><th>Time on task</th><th>Completion</th><th>Score</th><th>Touches</th></tr>
                      </thead>
                      <tbody>
                        {scenarios.map((sc) => (
                          <tr key={sc.name}>
                            <td className="fw-bold">{sc.name}</td>
                            <td>{fmtDur(sc.durationMs)}</td>
                            <td>{sc.completion != null ? `${sc.completion}%` : "—"}</td>
                            <td>{sc.score != null ? sc.score : "—"}</td>
                            <td>{sc.touches.length}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="brm-grid">
                      {scenarios.map((sc) => (
                        <div className="brm-scel" key={sc.name}>
                          <div className="brm-sceltitle">
                            <strong>{sc.name}</strong>
                            <span className="text-muted small">{sc.touches.length} touches</span>
                          </div>
                          <ScenarioHeatmap touches={sc.touches} bgUrl={shots[sc.name]} />
                        </div>
                      ))}
                    </div>
                  </>
                )
              )}

              {/* ---- Prompts & timeline ---- */}
              {tab === "prompts" && (
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="brm-sec">Activity Timeline</h6>
                    {scenarios.length === 0 ? <p className="text-muted small">No activities yet.</p> : (
                      <ul className="brm-timeline">
                        {scenarios.map((sc) => (
                          <li key={sc.name}>
                            <div className="brm-tl-dot" />
                            <div>
                              <div className="fw-bold">{sc.name}</div>
                              <div className="text-muted small">
                                {sc.starts[0] ? fmtTime(sc.starts[0]) : "—"} · {fmtDur(sc.durationMs)}
                                {sc.score != null ? ` · score ${sc.score}` : ""}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="col-md-6">
                    <h6 className="brm-sec">Prompts & Triggers</h6>
                    {buttons.length === 0 ? <p className="text-muted small">No prompt / button taps captured.</p> : (
                      <div className="brm-prompts">
                        {buttons.slice(-60).reverse().map((b) => (
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

              {/* ---- Patient trend ---- */}
              {tab === "trend" && (
                hist.length < 1 ? (
                  <p className="text-muted small">No past sessions to compare yet.</p>
                ) : (
                  <>
                    <p className="text-muted small">
                      Comparing this patient's recent sessions — touch volume, average completion and time-on-task.
                    </p>
                    <ApexChart type="line" height={320} series={trendSeries} options={trendOptions} />
                  </>
                )
              )}
            </div>
          </>
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
        .brm-live { width: 12px; height: 12px; border-radius: 50%; background: #f46a6a; animation: brmpulse 1.6s infinite; }
        @keyframes brmpulse {
          0% { box-shadow: 0 0 0 0 rgba(244,106,106,0.6); }
          70% { box-shadow: 0 0 0 8px rgba(244,106,106,0); }
          100% { box-shadow: 0 0 0 0 rgba(244,106,106,0); }
        }
        .brm-metrics { display: grid; grid-template-columns: repeat(5,1fr); gap: 10px; padding: 16px 22px 4px; }
        .brm-metric { background: #f8fafc; border: 1px solid #eef1f5; border-radius: 10px; padding: 10px; text-align: center; }
        .brm-metric span { display: block; font-size: 11px; color: #94a3b8; font-weight: 700; text-transform: uppercase; }
        .brm-metric strong { font-size: 16px; color: #1e293b; }
        .brm-tabs { display: flex; gap: 8px; padding: 12px 22px 0; }
        .brm-tabs button {
          border: none; background: #f1f5f9; color: #475569; font-weight: 700;
          padding: 8px 14px; border-radius: 10px 10px 0 0; cursor: pointer; font-size: 13px;
        }
        .brm-tabs button.on { background: #556ee6; color: #fff; }
        .brm-body { padding: 16px 22px 22px; overflow-y: auto; }
        .brm-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px,1fr)); gap: 14px; }
        .brm-scel { border: 1px solid #eef1f5; border-radius: 12px; padding: 10px; background: #fff; }
        .brm-sceltitle { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; }
        .brm-sec { font-weight: 800; color: #334155; margin-bottom: 10px; }
        .brm-timeline { list-style: none; margin: 0; padding: 0; }
        .brm-timeline li { display: flex; gap: 10px; padding: 6px 0 6px 14px; border-left: 2px solid #e2e8f0; margin-left: 5px; position: relative; }
        .brm-tl-dot { position: absolute; left: -6px; top: 12px; width: 10px; height: 10px; border-radius: 50%; background: #556ee6; }
        .brm-prompts { max-height: 320px; overflow-y: auto; }
        .brm-prompt { display: flex; justify-content: space-between; gap: 10px; padding: 5px 0; border-bottom: 1px dashed #eef1f5; }
        .brm-prompt-label { font-weight: 600; color: #334155; text-align: right; }
      `}</style>
    </div>
  );
}
