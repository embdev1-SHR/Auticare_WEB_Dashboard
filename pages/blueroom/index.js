import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import Layout from "../../components/shared/layout";
import withAuth from "../../util/helpers/withAuth";
import { selectRole } from "../../store/slice/auth.slice";
import {
  getClassesService, createClassService, deleteClassService,
  getClassStudentsService, addStudentService, removeStudentService,
  getActivityService, getHeatmapService, getTimeSeriesService,
} from "../../services/blueroom.services";
import { fetchAllCentersService } from "../../services/center.services";
import Axios from "../../util/api.util";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const isoDate = (d) => new Date(d).toISOString().slice(0, 10);
const fmtDate = (d) => new Date(d).toLocaleString();
const today = isoDate(new Date());
const weekAgo = isoDate(new Date(Date.now() - 7 * 86400000));

function BlueroomPage() {
  const role = useSelector(selectRole);
  const isAdmin = role === "SuperAdmin" || role === "ClientAdmin";

  const [centers, setCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState("");

  const [classes, setClasses] = useState([]);
  const [classLoading, setClassLoading] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [newClassPass, setNewClassPass] = useState("");
  const [classMsg, setClassMsg] = useState({ text: "", ok: true });

  const [activeClass, setActiveClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [allPatients, setAllPatients] = useState([]);
  const [addPatientId, setAddPatientId] = useState("");
  const [addPatientName, setAddPatientName] = useState("");

  const [filters, setFilters] = useState({ from: weekAgo, to: today, classId: "" });
  const [activity, setActivity] = useState([]);
  const [heatmapPoints, setHeatmapPoints] = useState([]);
  const [timeSeries, setTimeSeries] = useState([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const canvasRef = useRef(null);
  const canManage = role === "SuperAdmin" || role === "ClientAdmin" || role === "Center";

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

  async function loadClasses() {
    setClassLoading(true);
    try {
      const r = await getClassesService(cParam());
      setClasses(r.data?.results?.data || []);
    } catch (_) {}
    setClassLoading(false);
  }

  async function handleCreateClass(e) {
    e.preventDefault();
    try {
      const body = { ClassName: newClassName, password: newClassPass };
      if (isAdmin && selectedCenter) body.centerID = selectedCenter;
      await createClassService(body);
      setNewClassName(""); setNewClassPass("");
      setClassMsg({ text: "Class created successfully.", ok: true });
      loadClasses();
    } catch (err) {
      setClassMsg({ text: err?.response?.data?.errors?.message || "Failed.", ok: false });
    }
    setTimeout(() => setClassMsg({ text: "", ok: true }), 3000);
  }

  async function handleDeleteClass(classId) {
    if (!window.confirm("Delete this class and all its student mappings?")) return;
    try { await deleteClassService(classId, cParam()); loadClasses(); } catch (_) {}
  }

  async function openStudents(cls) {
    setActiveClass(cls); setStudents([]); setAllPatients([]);
    try {
      const [sr, pr] = await Promise.all([
        getClassStudentsService(cls.ClassID, cParam()),
        Axios.get("/api/v1/patients"),
      ]);
      const pts = pr?.data?.results?.data || [];
      setStudents(sr?.data?.results?.data || []);
      setAllPatients(pts);
      if (pts.length) { setAddPatientId(String(pts[0].PatientID)); setAddPatientName(pts[0].PatientName); }
    } catch (_) {}
  }

  async function handleAddStudent() {
    if (!addPatientId) return;
    try {
      const body = { PatientID: addPatientId, PatientName: addPatientName };
      if (isAdmin && selectedCenter) body.centerID = selectedCenter;
      await addStudentService(activeClass.ClassID, body);
      openStudents(activeClass);
    } catch (_) {}
  }

  async function handleRemoveStudent(pid) {
    try { await removeStudentService(activeClass.ClassID, pid, cParam()); openStudents(activeClass); } catch (_) {}
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
              <p className="text-muted small mb-0">Manage classes, students and view session analytics</p>
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
              {/* ── Classes section ──────────────────────────────────────── */}
              <div className="row mb-4">
                <div className={canManage ? "col-lg-8" : "col-12"}>
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Classes</h5>
                      {classLoading ? <p className="text-muted">Loading…</p> : classes.length === 0 ? (
                        <p className="text-muted small">No classes yet.</p>
                      ) : (
                        <table className="table table-sm table-hover mb-0">
                          <thead><tr><th>Class Name</th><th>Created</th><th className="text-end">Actions</th></tr></thead>
                          <tbody>
                            {classes.map((c) => (
                              <tr key={c.ClassID}>
                                <td><strong>{c.ClassName}</strong></td>
                                <td className="text-muted small">{isoDate(c.created_at)}</td>
                                <td className="text-end">
                                  <button className="btn btn-sm btn-outline-primary me-1"
                                    onClick={() => openStudents(c)}>Students</button>
                                  {canManage && (
                                    <button className="btn btn-sm btn-outline-danger"
                                      onClick={() => handleDeleteClass(c.ClassID)}>Delete</button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>

                {canManage && (
                  <div className="col-lg-4">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">New Class</h5>
                        <form onSubmit={handleCreateClass}>
                          <div className="mb-2">
                            <label className="form-label small fw-bold">Class Name</label>
                            <input className="form-control form-control-sm" placeholder="e.g. Morning Batch A"
                              value={newClassName} onChange={(e) => setNewClassName(e.target.value)} required />
                          </div>
                          <div className="mb-3">
                            <label className="form-label small fw-bold">Entry Password</label>
                            <input className="form-control form-control-sm" type="password"
                              placeholder="Operators enter this on the device"
                              value={newClassPass} onChange={(e) => setNewClassPass(e.target.value)} required />
                          </div>
                          {classMsg.text && (
                            <p className={`small mb-2 ${classMsg.ok ? "text-success" : "text-danger"}`}>
                              {classMsg.text}
                            </p>
                          )}
                          <button className="btn btn-primary btn-sm w-100" type="submit">Create Class</button>
                        </form>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Students panel ──────────────────────────────────────── */}
              {activeClass && (
                <div className="row mb-4">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h5 className="mb-0">Students — <span className="text-primary">{activeClass.ClassName}</span></h5>
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => setActiveClass(null)}>Close</button>
                        </div>
                        <div className="row">
                          <div className="col-md-7">
                            {students.length === 0 ? (
                              <p className="text-muted small">No students in this class yet.</p>
                            ) : (
                              <table className="table table-sm mb-0">
                                <thead><tr><th>Student Name</th><th>Added</th>{canManage && <th></th>}</tr></thead>
                                <tbody>
                                  {students.map((s) => (
                                    <tr key={s.StudentID}>
                                      <td>{s.StudentName}</td>
                                      <td className="text-muted small">{isoDate(s.added_at)}</td>
                                      {canManage && (
                                        <td>
                                          <button className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleRemoveStudent(s.StudentID)}>Remove</button>
                                        </td>
                                      )}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            )}
                          </div>
                          {canManage && (
                            <div className="col-md-5 border-start">
                              <p className="small fw-bold mb-2">Add a patient to this class</p>
                              <select className="form-select form-select-sm mb-2" value={addPatientId}
                                onChange={(e) => {
                                  const p = allPatients.find((x) => String(x.PatientID) === e.target.value);
                                  setAddPatientId(e.target.value);
                                  setAddPatientName(p?.PatientName || "");
                                }}>
                                <option value="">— Select patient —</option>
                                {allPatients.map((p) => (
                                  <option key={p.PatientID} value={p.PatientID}>{p.PatientName}</option>
                                ))}
                              </select>
                              <button className="btn btn-primary btn-sm" onClick={handleAddStudent}
                                disabled={!addPatientId}>Add to Class</button>
                            </div>
                          )}
                        </div>
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
    </Layout>
  );
}

export default withAuth(BlueroomPage, "Dashboard");
