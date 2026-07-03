import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import Layout from "../../components/shared/layout";
import withAuth from "../../util/helpers/withAuth";
import { selectRole } from "../../store/slice/auth.slice";
import {
  getClassesService, getDepartmentCredentialsService, setDepartmentAuthService,
  getClassStudentsService,
  getActivityService, getHeatmapService, getTimeSeriesService,
  getLiveSessionsService, getSessionDetailService, getPatientSessionsService,
  getRecentSessionsService,
} from "../../services/blueroom.services";
import { fetchAllCentersService } from "../../services/center.services";
import SessionDetailModal from "../../components/blueroom/session-detail-modal";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const isoDate = (d) => new Date(d).toISOString().slice(0, 10);
const fmtDate = (d) => new Date(d).toLocaleString();
const today = isoDate(new Date());
const weekAgo = isoDate(new Date(Date.now() - 7 * 86400000));

function BlueroomPage() {
  const role = useSelector(selectRole);
  const isAdmin = role === "SuperAdmin" || role === "ClientAdmin";
  const canManage = role === "SuperAdmin" || role === "ClientAdmin" || role === "Center";

  const [centers, setCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState("");

  const [classes, setClasses] = useState([]);
  const [classLoading, setClassLoading] = useState(false);
  const [credentials, setCredentials] = useState({}); // { [department_id]: username }

  // Set-credentials inline state
  const [credClassId, setCredClassId] = useState(null);
  const [credUsername, setCredUsername] = useState("");
  const [credPassword, setCredPassword] = useState("");
  const [credMsg, setCredMsg] = useState({ text: "", ok: true });

  const [activeClass, setActiveClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

  const [filters, setFilters] = useState({ from: weekAgo, to: today, classId: "" });
  const [activity, setActivity] = useState([]);
  const [heatmapPoints, setHeatmapPoints] = useState([]);
  const [timeSeries, setTimeSeries] = useState([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Live monitoring
  const [liveSessions, setLiveSessions] = useState([]);
  const [openSessionId, setOpenSessionId] = useState(null);

  // Session reports (past sessions)
  const [reports, setReports] = useState([]);
  const [reportSearch, setReportSearch] = useState("");

  const canvasRef = useRef(null);

  useEffect(() => {
    if (isAdmin) {
      fetchAllCentersService()
        .then((r) => setCenters(r.data?.results?.data || []))
        .catch(() => {});
    } else {
      loadClasses();
    }
  }, []);

  useEffect(() => {
    if (isAdmin && selectedCenter) loadClasses();
  }, [selectedCenter]);

  const cParam = () => (isAdmin ? selectedCenter : undefined);

  // Poll live sessions every 5s (only once a center context is ready).
  useEffect(() => {
    if (isAdmin && !selectedCenter) { setLiveSessions([]); return; }
    let alive = true;
    const load = async () => {
      try {
        const r = await getLiveSessionsService(cParam());
        if (alive) setLiveSessions(r.data?.results?.data || []);
      } catch (_) {}
    };
    load();
    const id = setInterval(load, 5000);
    return () => { alive = false; clearInterval(id); };
  }, [selectedCenter, isAdmin]);

  const fmtElapsed = (secs) => {
    const s = Math.max(0, parseInt(secs || 0, 10));
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return (h ? `${h}h ` : "") + (m ? `${m}m ` : "") + `${sec}s`;
  };

  async function loadReports() {
    if (isAdmin && !selectedCenter) { setReports([]); return; }
    try {
      const params = { limit: 100 };
      if (isAdmin && selectedCenter) params.centerID = selectedCenter;
      if (reportSearch) params.search = reportSearch;
      const r = await getRecentSessionsService(params);
      setReports(r.data?.results?.data || []);
    } catch (_) {}
  }

  // Reload the reports list when center or search changes (and after modal closes).
  useEffect(() => {
    loadReports();
  }, [selectedCenter, isAdmin, reportSearch, openSessionId]);

  async function loadClasses() {
    setClassLoading(true);
    // Load classes and credentials independently — a failure in one
    // must not blank out the other (they hit different databases).
    try {
      const cr = await getClassesService(cParam());
      setClasses(cr.data?.results?.data || []);
    } catch (_) {
      setClasses([]);
    }
    try {
      const ccr = await getDepartmentCredentialsService(cParam());
      const creds = {};
      (ccr.data?.results?.data || []).forEach((c) => { creds[c.department_id] = c.username; });
      setCredentials(creds);
    } catch (_) {
      setCredentials({});
    }
    setClassLoading(false);
  }

  function openSetCredentials(classId) {
    setCredClassId(classId);
    setCredUsername(credentials[classId] || "");
    setCredPassword("");
    setCredMsg({ text: "", ok: true });
  }

  async function handleSetCredentials(e, classId) {
    e.preventDefault();
    if (!credUsername || !credPassword) return;
    try {
      const centerID = isAdmin ? selectedCenter : undefined;
      await setDepartmentAuthService(classId, { username: credUsername, password: credPassword }, centerID);
      setCredMsg({ text: "Credentials saved.", ok: true });
      setCredentials((prev) => ({ ...prev, [classId]: credUsername }));
      setCredPassword("");
      setTimeout(() => { setCredClassId(null); setCredMsg({ text: "", ok: true }); }, 1500);
    } catch (err) {
      setCredMsg({ text: err?.response?.data?.errors?.message || "Failed.", ok: false });
    }
  }

  async function openStudents(cls) {
    setActiveClass(cls); setStudents([]); setStudentsLoading(true);
    try {
      const sr = await getClassStudentsService(cls.ClassID, cParam());
      setStudents(sr?.data?.results?.data || []);
    } catch (_) {}
    setStudentsLoading(false);
  }

  async function loadAnalytics() {
    setAnalyticsLoading(true);
    const params = {
      from: filters.from,
      to: filters.to + "T23:59:59",
      ...(filters.classId ? { classId: filters.classId } : {}),
      ...(isAdmin && selectedCenter ? { centerID: selectedCenter } : {}),
    };
    try {
      const [ar, hr, tr] = await Promise.all([
        getActivityService(params),
        getHeatmapService(params),
        getTimeSeriesService(params),
      ]);
      setActivity(ar?.data?.results?.data || []);
      setHeatmapPoints(hr?.data?.results?.data || []);
      setTimeSeries(tr?.data?.results?.data || []);
    } catch (_) {}
    setAnalyticsLoading(false);
  }

  // Draw heatmap
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    heatmapPoints.forEach(({ x, y, screen_width, screen_height }) => {
      if (x == null) return;
      const px = (x / (screen_width || 1920)) * canvas.width;
      const py = (y / (screen_height || 1080)) * canvas.height;
      const g = ctx.createRadialGradient(px, py, 0, px, py, 20);
      g.addColorStop(0, "rgba(255,60,60,0.3)");
      g.addColorStop(1, "rgba(255,60,60,0)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(px, py, 20, 0, Math.PI * 2); ctx.fill();
    });
  }, [heatmapPoints]);

  // Time series chart
  const tsSeries = (() => {
    const byGame = {};
    timeSeries.forEach((e) => {
      const k = e.game_key || e.scenario_id || "Unknown";
      if (!byGame[k]) byGame[k] = [];
      byGame[k].push({ x: new Date(e.ts).getTime(), y: Math.round(e.completion_pct || 0) });
    });
    return Object.entries(byGame).map(([name, data]) => ({ name, data }));
  })();

  const tsOptions = {
    chart: { type: "line", toolbar: { show: false } },
    xaxis: { type: "datetime" },
    yaxis: { min: 0, max: 100, title: { text: "Completion %" } },
    stroke: { curve: "smooth", width: 2 },
    tooltip: { x: { format: "dd MMM HH:mm" } },
    legend: { position: "top" },
    colors: ["#556ee6", "#f46a6a", "#34c38f", "#f1b44c", "#50a5f1"],
  };

  const ready = !isAdmin || !!selectedCenter;

  return (
    <Layout>
      <div className="page-content">
        <div className="container-fluid">

          {/* Header */}
          <div className="row mb-3 align-items-center">
            <div className="col">
              <h4 className="mb-0">Blueroom</h4>
              <p className="text-muted small mb-0">
                Departments are used as classes. Manage students and view session analytics.
              </p>
            </div>
            {isAdmin && (
              <div className="col-auto">
                <select className="form-select" value={selectedCenter}
                  onChange={(e) => setSelectedCenter(e.target.value)}>
                  <option value="">— Select a Center —</option>
                  {centers.map((c) => (
                    <option key={c.CenterID} value={c.CenterID}>{c.CenterName}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {!ready ? (
            <div className="card"><div className="card-body text-center py-5 text-muted">
              Select a center to get started.
            </div></div>
          ) : (
            <>
              {/* ── Live Now ──────────────────────────────────────────────── */}
              <div className="row mb-4">
                <div className="col-12">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3">
                        <span className="live-dot" />
                        <h5 className="card-title mb-0 ms-2">Live Now</h5>
                        <span className="badge bg-danger ms-2">{liveSessions.length}</span>
                        <span className="text-muted small ms-auto">Auto-refreshing every 5s</span>
                      </div>
                      {liveSessions.length === 0 ? (
                        <p className="text-muted small mb-0">No active sessions right now. Cards appear here when a device is playing online.</p>
                      ) : (
                        <div className="row g-3">
                          {liveSessions.map((s) => (
                            <div className="col-md-6 col-xl-4" key={s.session_id}>
                              <div className="live-card" onClick={() => setOpenSessionId(s.session_id)}>
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                  <div>
                                    <div className="fw-bold">
                                      {s.session_mode === "individual"
                                        ? (s.patient_name || `Patient #${s.patient_id}`)
                                        : (s.class_name || "Class session")}
                                    </div>
                                    <div className="text-muted small">{s.class_name || "—"}</div>
                                  </div>
                                  <span className={`badge ${s.session_mode === "individual" ? "bg-info" : "bg-warning text-dark"}`}>
                                    {s.session_mode}
                                  </span>
                                </div>
                                <div className="small mb-1">
                                  <span className="text-muted">Activity: </span>
                                  <strong>{s.current_activity || "menu"}</strong>
                                </div>
                                <div className="d-flex justify-content-between small text-muted">
                                  <span>⏱ {fmtElapsed(s.elapsed_seconds)}</span>
                                  <span>👆 {s.touch_count || 0} touches</span>
                                </div>
                                <div className="live-card-foot">
                                  <span className="live-dot sm" /> LIVE · click for details
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Session Reports (past sessions per patient) ──────────────── */}
              <div className="row mb-4">
                <div className="col-12">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3 flex-wrap gap-2">
                        <h5 className="card-title mb-0">Session Reports</h5>
                        <span className="badge bg-secondary">{reports.length}</span>
                        <input
                          type="text"
                          className="form-control form-control-sm ms-auto"
                          style={{ maxWidth: 260 }}
                          placeholder="Search by patient name…"
                          value={reportSearch}
                          onChange={(e) => setReportSearch(e.target.value)}
                        />
                      </div>
                      {reports.length === 0 ? (
                        <p className="text-muted small mb-0">No sessions recorded yet. Completed sessions appear here as reports.</p>
                      ) : (
                        <div style={{ maxHeight: 360, overflowY: "auto" }}>
                          <table className="table table-sm table-hover mb-0">
                            <thead className="table-light" style={{ position: "sticky", top: 0 }}>
                              <tr>
                                <th>Patient / Class</th>
                                <th>Mode</th>
                                <th>Date</th>
                                <th>Duration</th>
                                <th>Activities</th>
                                <th>Touches</th>
                                <th>Status</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {reports.map((s) => (
                                <tr key={s.session_id} style={{ cursor: "pointer" }} onClick={() => setOpenSessionId(s.session_id)}>
                                  <td className="fw-bold">
                                    {s.session_mode === "individual"
                                      ? (s.patient_name || `Patient #${s.patient_id}`)
                                      : (s.class_name || "Class session")}
                                    {s.session_mode === "individual" && s.class_name && (
                                      <div className="text-muted small fw-normal">{s.class_name}</div>
                                    )}
                                  </td>
                                  <td><span className={`badge ${s.session_mode === "individual" ? "bg-info" : "bg-warning text-dark"}`}>{s.session_mode}</span></td>
                                  <td className="small text-muted">{fmtDate(s.login_at)}</td>
                                  <td className="small">{fmtElapsed(s.duration_seconds)}</td>
                                  <td className="small">{s.activity_count || 0}</td>
                                  <td className="small">{s.touch_count || 0}</td>
                                  <td>
                                    <span className={`badge ${s.status === "live" ? "bg-danger" : "bg-success"}`}>
                                      {s.status === "live" ? "LIVE" : "Report"}
                                    </span>
                                  </td>
                                  <td className="text-end"><span className="text-primary small">Open →</span></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Classes (Departments) ─────────────────────────────────── */}
              <div className="row mb-4">
                <div className="col-12">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Departments / Classes</h5>
                      <p className="text-muted small mb-3">
                        These are the departments created for this center. Set a password on each one to enable
                        class login on the Blueroom device.
                      </p>
                      {classLoading ? <p className="text-muted">Loading…</p> : classes.length === 0 ? (
                        <p className="text-muted small">No departments found for this center.</p>
                      ) : (
                        <table className="table table-sm table-hover mb-0">
                          <thead>
                            <tr>
                              <th>Department / Class Name</th>
                              <th>Login Username</th>
                              <th className="text-end">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {classes.map((c) => (
                              <>
                                <tr key={c.ClassID}>
                                  <td><strong>{c.ClassName}</strong></td>
                                  <td>
                                    {credentials[c.ClassID]
                                      ? <code className="text-success">{credentials[c.ClassID]}</code>
                                      : <span className="text-muted small">Not set</span>}
                                  </td>
                                  <td className="text-end">
                                    <button className="btn btn-sm btn-outline-primary me-1"
                                      onClick={() => openStudents(c)}>Students</button>
                                    {canManage && (
                                      <button
                                        className={`btn btn-sm ${credClassId === c.ClassID ? "btn-secondary" : "btn-outline-secondary"}`}
                                        onClick={() => credClassId === c.ClassID ? setCredClassId(null) : openSetCredentials(c.ClassID)}>
                                        {credClassId === c.ClassID ? "Cancel" : "Set Credentials"}
                                      </button>
                                    )}
                                  </td>
                                </tr>
                                {credClassId === c.ClassID && (
                                  <tr key={`cred-${c.ClassID}`}>
                                    <td colSpan={3} className="bg-light">
                                      <form className="d-flex gap-2 align-items-center py-1 flex-wrap"
                                        onSubmit={(e) => handleSetCredentials(e, c.ClassID)}>
                                        <input
                                          type="text"
                                          className="form-control form-control-sm"
                                          style={{ maxWidth: 180 }}
                                          placeholder="Username"
                                          value={credUsername}
                                          onChange={(e) => setCredUsername(e.target.value)}
                                          required
                                          autoFocus
                                        />
                                        <input
                                          type="password"
                                          className="form-control form-control-sm"
                                          style={{ maxWidth: 180 }}
                                          placeholder="Password"
                                          value={credPassword}
                                          onChange={(e) => setCredPassword(e.target.value)}
                                          required
                                        />
                                        <button className="btn btn-sm btn-success" type="submit">Save</button>
                                        {credMsg.text && (
                                          <span className={`small ${credMsg.ok ? "text-success" : "text-danger"}`}>
                                            {credMsg.text}
                                          </span>
                                        )}
                                      </form>
                                    </td>
                                  </tr>
                                )}
                              </>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Students panel (read-only — patients in this department) ── */}
              {activeClass && (
                <div className="row mb-4">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h5 className="mb-0">Students — <span className="text-primary">{activeClass.ClassName}</span></h5>
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => setActiveClass(null)}>Close</button>
                        </div>
                        <p className="text-muted small mb-3">
                          Students are the patients assigned to this department. To add or move a student,
                          set their department on the <strong>Patients</strong> page.
                        </p>
                        {studentsLoading ? (
                          <p className="text-muted small">Loading…</p>
                        ) : students.length === 0 ? (
                          <p className="text-muted small">No patients assigned to this department yet.</p>
                        ) : (
                          <table className="table table-sm mb-0" style={{ maxWidth: 480 }}>
                            <thead><tr><th style={{ width: 60 }}>#</th><th>Student Name</th></tr></thead>
                            <tbody>
                              {students.map((s, i) => (
                                <tr key={s.StudentID}>
                                  <td className="text-muted">{i + 1}</td>
                                  <td>{s.StudentName}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Analytics filters ────────────────────────────────────── */}
              <div className="row mb-3">
                <div className="col-12">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title mb-3">Session Analytics</h5>
                      <div className="row g-2 align-items-end">
                        <div className="col-auto">
                          <label className="form-label small fw-bold mb-1">From</label>
                          <input type="date" className="form-control form-control-sm" value={filters.from}
                            onChange={(e) => setFilters({ ...filters, from: e.target.value })} />
                        </div>
                        <div className="col-auto">
                          <label className="form-label small fw-bold mb-1">To</label>
                          <input type="date" className="form-control form-control-sm" value={filters.to}
                            onChange={(e) => setFilters({ ...filters, to: e.target.value })} />
                        </div>
                        <div className="col-auto">
                          <label className="form-label small fw-bold mb-1">Class</label>
                          <select className="form-select form-select-sm" value={filters.classId}
                            onChange={(e) => setFilters({ ...filters, classId: e.target.value })}>
                            <option value="">All classes</option>
                            {classes.map((c) => <option key={c.ClassID} value={c.ClassID}>{c.ClassName}</option>)}
                          </select>
                        </div>
                        <div className="col-auto">
                          <button className="btn btn-primary btn-sm" onClick={loadAnalytics} disabled={analyticsLoading}>
                            {analyticsLoading ? "Loading…" : "Load Analytics"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Heatmap + Time series ────────────────────────────────── */}
              {(heatmapPoints.length > 0 || tsSeries.length > 0) && (
                <div className="row mb-4">
                  <div className="col-xl-5 mb-4 mb-xl-0">
                    <div className="card h-100">
                      <div className="card-body">
                        <h6 className="card-title">Touch Heatmap</h6>
                        <p className="text-muted small">{heatmapPoints.length} touch events</p>
                        <div style={{ background: "#0f1117", borderRadius: 8, overflow: "hidden" }}>
                          <canvas ref={canvasRef} width={640} height={360} style={{ width: "100%", display: "block" }} />
                        </div>
                        {heatmapPoints.length === 0 && (
                          <p className="text-muted text-center mt-3">No touch data for this range.</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-7">
                    <div className="card h-100">
                      <div className="card-body">
                        <h6 className="card-title">Scenario Completion Over Time</h6>
                        {tsSeries.length > 0 ? (
                          <ApexChart type="line" height={300} series={tsSeries} options={tsOptions} />
                        ) : (
                          <p className="text-muted text-center mt-5">No completion data for this range.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Activity table ──────────────────────────────────────── */}
              {activity.length > 0 && (
                <div className="row mb-4">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-body">
                        <h6 className="card-title">Event Log ({activity.length} events)</h6>
                        <div style={{ maxHeight: 320, overflowY: "auto" }}>
                          <table className="table table-sm table-hover mb-0">
                            <thead className="table-light" style={{ position: "sticky", top: 0 }}>
                              <tr>
                                <th>Time</th>
                                <th>Event</th>
                                <th>Mode</th>
                                <th>Patient</th>
                                <th>Game</th>
                                <th>Completion</th>
                                <th>Duration</th>
                              </tr>
                            </thead>
                            <tbody>
                              {activity.map((e) => (
                                <tr key={e.id}>
                                  <td className="text-muted small" style={{ whiteSpace: "nowrap" }}>{fmtDate(e.ts)}</td>
                                  <td><span className="badge bg-secondary">{e.event_type}</span></td>
                                  <td><span className={`badge ${e.session_mode === "individual" ? "bg-info" : "bg-warning text-dark"}`}>{e.session_mode}</span></td>
                                  <td className="small">{e.patient_id || "—"}</td>
                                  <td className="small">{e.game_key || e.scenario_id || "—"}</td>
                                  <td>{e.completion_pct != null ? `${e.completion_pct}%` : "—"}</td>
                                  <td>{e.duration_ms != null ? `${(e.duration_ms / 1000).toFixed(1)}s` : "—"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activity.length === 0 && !analyticsLoading && heatmapPoints.length === 0 && (
                <div className="row">
                  <div className="col-12">
                    <div className="card"><div className="card-body text-center py-4 text-muted">
                      No analytics loaded yet. Pick a date range and click <strong>Load Analytics</strong>.
                    </div></div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {openSessionId && (
        <SessionDetailModal
          sessionId={openSessionId}
          centerID={cParam()}
          fetchDetail={getSessionDetailService}
          fetchPatientSessions={getPatientSessionsService}
          fmtElapsed={fmtElapsed}
          onClose={() => setOpenSessionId(null)}
        />
      )}

      <style jsx>{`
        .live-dot {
          display: inline-block; width: 12px; height: 12px; border-radius: 50%;
          background: #f46a6a; box-shadow: 0 0 0 rgba(244,106,106,0.6);
          animation: pulse 1.6s infinite;
        }
        .live-dot.sm { width: 8px; height: 8px; }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(244,106,106,0.6); }
          70% { box-shadow: 0 0 0 8px rgba(244,106,106,0); }
          100% { box-shadow: 0 0 0 0 rgba(244,106,106,0); }
        }
        .live-card {
          border: 1px solid #e2e8f0; border-left: 4px solid #f46a6a;
          border-radius: 12px; padding: 14px; cursor: pointer;
          background: #fff; transition: box-shadow .15s, transform .12s;
          height: 100%;
        }
        .live-card:hover { box-shadow: 0 6px 18px rgba(0,0,0,0.1); transform: translateY(-2px); }
        .live-card-foot {
          margin-top: 10px; padding-top: 8px; border-top: 1px dashed #e2e8f0;
          font-size: 11px; font-weight: 700; color: #f46a6a;
          text-transform: uppercase; letter-spacing: .5px;
        }
      `}</style>
    </Layout>
  );
}

export default withAuth(BlueroomPage, "Dashboard");
