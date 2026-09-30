/**
 * Developer Licence — Auticare admin only
 * ──────────────────────────────────────────────────────────────────
 * One internal key for installing the wall app on our own machines. It
 * belongs to no centre, consumes no customer's device allowance, and never
 * appears in a customer's records.
 *
 * The page is gated twice over: the API refuses anyone but the Auticare
 * admin account, and this page hides itself for the same reason. The client
 * check is a courtesy so the wrong person sees nothing rather than an error
 * — the API is what actually enforces it, since a page can be read.
 *
 * The key is masked until revealed. Anyone holding it can activate the app
 * anywhere without limit, so it should not sit on screen in a room with a
 * projector running.
 */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody, Button, Spinner, Alert } from "reactstrap";
import Layout from "../components/shared/layout";
import PageTitle from "../components/shared/pagetitle";
import { changeBreadcrumb, changeTitle } from "../store/slice/layout.slice";
import { selectUserData } from "../store/slice/auth.slice";
import { Axios } from "../util/api.util";

const ADMIN_EMAIL = "admin@auticare.com";

function DevLicence() {
  const dispatch = useDispatch();
  const UserData = useSelector(selectUserData);

  const [licence, setLicence] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  const isAdmin =
    UserData?.RoleName === "SuperAdmin" &&
    String(UserData?.EmailId || "").toLowerCase() === ADMIN_EMAIL;

  useEffect(() => {
    dispatch(changeTitle("Developer Licence"));
    dispatch(changeBreadcrumb([{ title: "Developer Licence", link: "dev-licence" }]));
  }, [dispatch]);

  useEffect(() => {
    if (!UserData) return;
    if (!isAdmin) {
      setLoading(false);
      return;
    }
    let live = true;
    Axios.get("/api/v1/centers/dev-licence")
      .then((r) => {
        if (!live) return;
        setLicence(r?.data?.results?.data || null);
      })
      .catch((e) => {
        if (!live) return;
        setError(e?.response?.data?.errors?.message || "Could not load the developer licence.");
      })
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [UserData, isAdmin]);

  const copy = () => {
    if (!licence?.CenterApiKey) return;
    navigator.clipboard.writeText(licence.CenterApiKey).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const regenerate = async () => {
    if (
      !window.confirm(
        "Generate a new developer key?\n\nThe current key stops working immediately and every machine running on it will need activating again."
      )
    )
      return;
    setBusy(true);
    setError("");
    try {
      const r = await Axios.post("/api/v1/centers/dev-licence/regenerate");
      setLicence(r?.data?.results?.data || null);
      setRevealed(true);
    } catch (e) {
      setError(e?.response?.data?.errors?.message || "Could not regenerate the key.");
    } finally {
      setBusy(false);
    }
  };

  const masked = licence?.CenterApiKey
    ? `${licence.CenterApiKey.slice(0, 6)}${"•".repeat(26)}${licence.CenterApiKey.slice(-4)}`
    : "";

  return (
    <Layout>
      <PageTitle />
      <div className="container-fluid">
        {loading ? (
          <div className="text-center py-5">
            <Spinner color="primary" />
          </div>
        ) : !isAdmin ? (
          <Alert color="secondary">
            This page is available to the Auticare admin account only.
          </Alert>
        ) : (
          <Card>
            <CardBody>
              <h5 className="mb-1">Developer Licence Key</h5>
              <p className="text-muted mb-4" style={{ maxWidth: "62ch" }}>
                One internal key for installing the wall app on our own machines. It is
                not tied to any centre, does not use a customer&apos;s device allowance,
                and can be activated on any number of machines.
              </p>

              {error && <Alert color="danger">{error}</Alert>}

              <label className="form-label">Key</label>
              <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
                <input
                  type="text"
                  readOnly
                  value={revealed ? licence?.CenterApiKey || "" : masked}
                  className="form-control font-monospace"
                  style={{ fontSize: "0.85rem", letterSpacing: "0.04em", maxWidth: 560 }}
                  onFocus={(e) => e.target.select()}
                />
                <Button color="secondary" size="sm" onClick={() => setRevealed((v) => !v)}>
                  {revealed ? "Hide" : "Reveal"}
                </Button>
                <Button color="primary" size="sm" onClick={copy}>
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button color="warning" size="sm" onClick={regenerate} disabled={busy}>
                  {busy ? "Working…" : "Regenerate"}
                </Button>
              </div>

              <p className="text-muted small mb-4">
                Masked by default — anyone with this key can activate the app anywhere,
                so do not leave it on screen in a room with a projector running.
                Regenerating revokes the old key immediately.
              </p>

              <h6 className="mb-2">Giving it to someone</h6>
              <ol className="text-muted small mb-0" style={{ maxWidth: "62ch" }}>
                <li>Copy the key and send it to them directly, not in a shared channel.</li>
                <li>
                  They open the wall app, and on <strong>Activate Center</strong> paste it
                  in.
                </li>
                <li>
                  If their machine was already activated, <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+
                  <kbd>R</kbd> on the login screen clears it first.
                </li>
              </ol>
            </CardBody>
          </Card>
        )}
      </div>
    </Layout>
  );
}

export default DevLicence;
