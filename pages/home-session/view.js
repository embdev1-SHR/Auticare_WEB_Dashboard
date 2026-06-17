import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { publicHomeSessionViewService } from "../../services/patient.services";

function MediaView({ session }) {
  const { ResourceType, ResourceURL, ResourceTitle } = session;
  if (ResourceType === "Video") {
    return (
      <video
        controls
        src={ResourceURL || undefined}
        poster={session.ThumbnailURL || undefined}
        style={{ width: "100%", maxHeight: "480px", borderRadius: "12px", background: "#000" }}
      >
        {!ResourceURL && <p style={{ color: "#fff", textAlign: "center", padding: 24 }}>No video attached.</p>}
      </video>
    );
  }
  if (ResourceType === "Audio" && ResourceURL) {
    return (
      <audio controls src={ResourceURL} style={{ width: "100%", marginTop: "16px" }} />
    );
  }
  if (ResourceType === "Image" && ResourceURL) {
    return (
      <img
        src={ResourceURL}
        alt={ResourceTitle}
        style={{ width: "100%", maxHeight: "480px", objectFit: "contain", borderRadius: "12px" }}
      />
    );
  }
  if (ResourceType === "Text" && ResourceURL) {
    return (
      <div style={{ padding: "20px", background: "#f8f9fa", borderRadius: "12px", fontSize: "15px", lineHeight: "1.6", color: "#495057" }}>
        {ResourceURL}
      </div>
    );
  }
  return <p className="text-muted">No media available.</p>;
}

export default function HomeSessionView() {
  const router = useRouter();
  const { token } = router.query;

  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    publicHomeSessionViewService(token)
      .then((data) => setSession(data.results.data))
      .catch((e) => setError(e.message || "Failed to load session"))
      .finally(() => setLoading(false));
  }, [token]);

  const typeBadgeColor = {
    Video: "#0d6efd",
    Audio: "#198754",
    Image: "#ffc107",
    Text: "#6c757d",
  };

  return (
    <>
      <Head>
        <title>{session ? session.ResourceTitle : "Home Session"} | Auticare</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{ minHeight: "100vh", background: "#f0f4f8" }}>
        {/* Header */}
        <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "12px 24px", display: "flex", alignItems: "center", gap: "12px" }}>
          <img
            src="/assets/images/logo.png"
            alt="Auticare"
            style={{ height: "36px" }}
            onError={(e) => { e.target.style.display = "none"; }}
          />
          <span style={{ fontWeight: 700, fontSize: "18px", color: "#2d3748" }}>Auticare</span>
        </div>

        <div style={{ maxWidth: "720px", margin: "32px auto", padding: "0 16px" }}>
          {loading && (
            <div style={{ textAlign: "center", padding: "80px 0", color: "#718096" }}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>⏳</div>
              <p>Loading session…</p>
            </div>
          )}

          {error && (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔗</div>
              <h4 style={{ color: "#e53e3e", marginBottom: "8px" }}>
                {error.includes("expired") ? "Link Expired" : "Session Not Found"}
              </h4>
              <p style={{ color: "#718096" }}>
                {error.includes("expired")
                  ? "This share link has expired. Please ask your therapist to send a new link."
                  : "This link is invalid or the session has been removed."}
              </p>
            </div>
          )}

          {!loading && !error && session && (
            <div style={{ background: "#fff", borderRadius: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", overflow: "hidden" }}>
              {/* Session header */}
              <div style={{ padding: "24px 24px 16px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                  <div>
                    <h2 style={{ margin: "0 0 6px", fontSize: "20px", color: "#2d3748" }}>{session.ResourceTitle}</h2>
                    <p style={{ margin: 0, color: "#718096", fontSize: "14px" }}>{session.ResourceDescription}</p>
                  </div>
                  <span style={{
                    background: typeBadgeColor[session.ResourceType] || "#6c757d",
                    color: session.ResourceType === "Image" ? "#212529" : "#fff",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: 600,
                    flexShrink: 0,
                  }}>
                    {session.ResourceType}
                  </span>
                </div>
              </div>

              {/* Media */}
              <div style={{ padding: "0 24px 24px" }}>
                <MediaView session={session} />
              </div>

              {/* Footer */}
              <div style={{ borderTop: "1px solid #e2e8f0", padding: "14px 24px", background: "#f8fafc", textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: "12px", color: "#a0aec0" }}>
                  Shared by your therapist via <strong>Auticare</strong> · For home practice
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
