import { useRef, useState, useEffect } from "react";
import { Button, Input, Badge } from "reactstrap";

const formatTime = (seconds) => {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

const parseAnnotations = (overlays) =>
  (overlays || [])
    .filter(Boolean)
    .map((o, i) => ({
      id: i,
      timestamp: Number(o.start ?? o.StartPosition ?? 0),
      text: o.Description || "",
    }))
    .sort((a, b) => a.timestamp - b.timestamp);

export const VideoPlayer = ({ file_src, overlays }) => {
  const videoRef = useRef(null);
  const [annotations, setAnnotations] = useState(() => parseAnnotations(overlays));
  const [currentTime, setCurrentTime] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newText, setNewText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    video.addEventListener("timeupdate", onTimeUpdate);
    return () => video.removeEventListener("timeupdate", onTimeUpdate);
  }, []);

  const addAnnotation = () => {
    if (!newText.trim()) return;
    setAnnotations((prev) =>
      [...prev, { id: Date.now(), timestamp: currentTime, text: newText.trim() }].sort(
        (a, b) => a.timestamp - b.timestamp
      )
    );
    setNewText("");
    setShowAddForm(false);
  };

  const deleteAnnotation = (id) => setAnnotations((prev) => prev.filter((a) => a.id !== id));

  const saveEdit = (id) => {
    setAnnotations((prev) => prev.map((a) => (a.id === id ? { ...a, text: editText } : a)));
    setEditingId(null);
  };

  const seekTo = (ts) => {
    if (videoRef.current) {
      videoRef.current.currentTime = ts;
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <div className="video-annotation-layout">
      {/* ── Left: player + add-annotation bar ── */}
      <div className="video-player-col">
        <div className="player-wrapper">
          <video
            ref={videoRef}
            src={file_src}
            controls
            style={{ width: "100%", height: "100%", display: "block" }}
            controlsList="nodownload"
          />
        </div>

        <div className="annotation-bar">
          {showAddForm ? (
            <div className="annotation-input-row">
              <Badge color="primary" className="timestamp-badge">
                ⏱ {formatTime(currentTime)}
              </Badge>
              <Input
                type="text"
                placeholder="Type annotation and press Enter…"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addAnnotation()}
                autoFocus
                className="annotation-text-input"
              />
              <Button size="sm" color="primary" onClick={addAnnotation}>
                Save
              </Button>
              <Button size="sm" color="light" onClick={() => { setShowAddForm(false); setNewText(""); }}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              outline
              color="primary"
              onClick={() => setShowAddForm(true)}
              className="add-annotation-btn"
            >
              + Add Annotation at {formatTime(currentTime)}
            </Button>
          )}
        </div>
      </div>

      {/* ── Right: annotations panel ── */}
      <div className="annotations-col">
        <div className="annotations-panel">
          <div className="annotations-header">
            <span>Annotations</span>
            <Badge color="secondary" pill>{annotations.length}</Badge>
          </div>

          <div className="annotations-list">
            {annotations.length === 0 ? (
              <div className="annotations-empty">
                <div className="empty-icon">📝</div>
                <p>No annotations yet.</p>
                <p>Play the video and click<br /><strong>+ Add Annotation</strong> to mark key moments.</p>
              </div>
            ) : (
              annotations.map((a) => (
                <div key={a.id} className="annotation-item">
                  <div className="annotation-item-header">
                    <button className="seek-btn" onClick={() => seekTo(a.timestamp)}>
                      ▶ {formatTime(a.timestamp)}
                    </button>
                    <div className="annotation-actions">
                      <button
                        className="icon-btn edit-btn"
                        title="Edit"
                        onClick={() => { setEditingId(a.id); setEditText(a.text); }}
                      >
                        ✏️
                      </button>
                      <button
                        className="icon-btn delete-btn"
                        title="Delete"
                        onClick={() => deleteAnnotation(a.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {editingId === a.id ? (
                    <div className="edit-row">
                      <Input
                        bsSize="sm"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && saveEdit(a.id)}
                        autoFocus
                      />
                      <Button size="sm" color="primary" onClick={() => saveEdit(a.id)}>Save</Button>
                      <Button size="sm" color="light" onClick={() => setEditingId(null)}>✕</Button>
                    </div>
                  ) : (
                    <p className="annotation-text">{a.text}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .video-annotation-layout {
          display: flex;
          gap: 16px;
          align-items: flex-start;
          width: 100%;
        }
        .video-player-col {
          flex: 0 0 63%;
          min-width: 0;
        }
        .player-wrapper {
          position: relative;
          border-radius: 10px;
          overflow: hidden;
          background: #000;
          aspect-ratio: 16/9;
        }
        .player-wrapper video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .annotation-bar {
          margin-top: 12px;
          padding: 10px 14px;
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 8px;
        }
        .annotation-input-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .timestamp-badge {
          white-space: nowrap;
          font-size: 12px;
          padding: 5px 9px;
        }
        .annotation-text-input {
          flex: 1;
        }
        .add-annotation-btn {
          font-size: 13px;
        }
        .annotations-col {
          flex: 0 0 35%;
          min-width: 0;
        }
        .annotations-panel {
          border: 1px solid #e9ecef;
          border-radius: 10px;
          background: #fff;
          max-height: 520px;
          display: flex;
          flex-direction: column;
        }
        .annotations-header {
          padding: 12px 16px;
          border-bottom: 1px solid #e9ecef;
          font-weight: 600;
          font-size: 14px;
          color: #343a40;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .annotations-list {
          overflow-y: auto;
          flex: 1;
        }
        .annotations-empty {
          padding: 32px 20px;
          text-align: center;
          color: #adb5bd;
          font-size: 13px;
          line-height: 1.6;
        }
        .empty-icon {
          font-size: 32px;
          margin-bottom: 8px;
        }
        .annotations-empty p {
          margin: 0 0 4px;
        }
        .annotation-item {
          padding: 10px 14px;
          border-bottom: 1px solid #f1f3f4;
          transition: background 0.15s;
        }
        .annotation-item:hover {
          background: #fafafa;
        }
        .annotation-item:last-child {
          border-bottom: none;
        }
        .annotation-item-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 5px;
        }
        .seek-btn {
          background: #e7f3ff;
          border: none;
          color: #0d6efd;
          padding: 2px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }
        .seek-btn:hover {
          background: #cce5ff;
        }
        .annotation-actions {
          display: flex;
          gap: 2px;
        }
        .icon-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 13px;
          padding: 2px 4px;
          border-radius: 4px;
          opacity: 0.6;
          transition: opacity 0.15s;
        }
        .icon-btn:hover {
          opacity: 1;
        }
        .annotation-text {
          margin: 0;
          font-size: 13px;
          color: #495057;
          line-height: 1.5;
          word-break: break-word;
        }
        .edit-row {
          display: flex;
          gap: 5px;
          align-items: center;
        }
        .edit-row input {
          flex: 1;
        }
        @media (max-width: 768px) {
          .video-annotation-layout {
            flex-direction: column;
          }
          .video-player-col,
          .annotations-col {
            flex: 0 0 100%;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};
