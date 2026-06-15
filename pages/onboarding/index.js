import Head from "next/head";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Button, Form, FormGroup, Input, Label, FormFeedback } from "reactstrap";
import { selectUserData } from "../../store/slice/auth.slice";
import {
  completeOnboarding,
  loadMyClientProfile,
  selectClientProfile,
  selectClientProfileFetched,
  selectIsOnboarding,
} from "../../store/slice/client.slice";
import { ClientTypeList } from "../../services/client.services";
import Loader from "../../components/shared/loader";

const STEPS = ["Organization", "Contact & Address", "Billing", "Bank Details"];

const OrganizationTypeList = [
  { value: "Government", label: "Government" },
  { value: "Private", label: "Private" },
  { value: "NGO", label: "NGO" },
  { value: "Trust", label: "Trust" },
  { value: "Other", label: "Other" },
];

export default function Onboarding() {
  const dispatch = useDispatch();
  const router = useRouter();
  const userData = useSelector(selectUserData);
  const clientProfile = useSelector(selectClientProfile);
  const clientProfileFetched = useSelector(selectClientProfileFetched);
  const isOnboarding = useSelector(selectIsOnboarding);

  // Guard: redirect non-ClientAdmin users and already-onboarded clients
  useEffect(() => {
    if (!userData) return;
    if (userData.RoleName !== "ClientAdmin") { router.replace("/dashboard"); return; }
    if (clientProfile?.ClientType) { router.replace("/dashboard"); }
  }, [userData, clientProfile]);

  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [sameBilling, setSameBilling] = useState(false);

  const [form, setForm] = useState({
    ClientName: "",
    ClientType: "",
    OrganizationType: "",
    WebsiteURL: "",
    ContactPersonName: "",
    ContactPersonDesignation: "",
    ContactEmailId: "",
    Phone: "",
    AddressLine1: "",
    AddressLine2: "",
    City: "",
    Pincode: "",
    State: "",
    Country: "",
    BillingAddressLine1: "",
    BillingAddressLine2: "",
    BillingCity: "",
    BillingDistrict: "",
    BillingPincode: "",
    BillingState: "",
    BillingCountry: "",
    GSTNumber: "",
    Bank: "",
    BankAccountNumber: "",
    Branch: "",
    IFSCCode: "",
  });

  useEffect(() => {
    // Layout already fetched the profile before redirecting here.
    // Only fetch if arriving directly (e.g. browser refresh on /onboarding).
    if (!clientProfileFetched) dispatch(loadMyClientProfile());
  }, [clientProfileFetched]);

  useEffect(() => {
    if (clientProfile) {
      setForm((f) => ({
        ...f,
        ClientName: clientProfile.ClientName || "",
        Phone: clientProfile.Phone || "",
        AddressLine1: clientProfile.AddressLine1 || "",
        AddressLine2: clientProfile.AddressLine2 || "",
        City: clientProfile.City || "",
        Pincode: clientProfile.Pincode || "",
        State: clientProfile.State || "",
        Country: clientProfile.Country || "",
      }));
    }
  }, [clientProfile]);

  useEffect(() => {
    if (sameBilling) {
      setForm((f) => ({
        ...f,
        BillingAddressLine1: f.AddressLine1,
        BillingAddressLine2: f.AddressLine2,
        BillingCity: f.City,
        BillingDistrict: "",
        BillingPincode: f.Pincode,
        BillingState: f.State,
        BillingCountry: f.Country,
      }));
    }
  }, [sameBilling, form.AddressLine1, form.City, form.State, form.Country, form.Pincode]);

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: null }));
  };

  const validateStep = () => {
    const errs = {};
    if (step === 0) {
      if (!form.ClientName.trim()) errs.ClientName = "Organization name is required";
      if (!form.ClientType) errs.ClientType = "Organization type is required";
    }
    if (step === 1) {
      if (!form.ContactPersonName.trim()) errs.ContactPersonName = "Contact name is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (validateStep()) setStep((s) => s + 1);
  };

  const prev = () => setStep((s) => s - 1);

  const handleSubmit = () => {
    if (!validateStep()) return;
    dispatch(completeOnboarding(form));
  };

  const field = (label, name, required, type = "text", children) => (
    <FormGroup>
      <Label style={{ fontWeight: 500, fontSize: 13 }}>
        {label}{required && <span style={{ color: "red" }}> *</span>}
      </Label>
      {children || (
        <Input
          type={type}
          value={form[name]}
          onChange={set(name)}
          invalid={!!errors[name]}
        />
      )}
      {errors[name] && <FormFeedback>{errors[name]}</FormFeedback>}
    </FormGroup>
  );

  const selectField = (label, name, required, options, placeholder = "Select...") => (
    <FormGroup>
      <Label style={{ fontWeight: 500, fontSize: 13 }}>
        {label}{required && <span style={{ color: "red" }}> *</span>}
      </Label>
      <Input
        type="select"
        value={form[name]}
        onChange={set(name)}
        invalid={!!errors[name]}
        style={{ color: form[name] ? "inherit" : "#6c757d" }}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </Input>
      {errors[name] && <FormFeedback>{errors[name]}</FormFeedback>}
    </FormGroup>
  );

  const stepContent = [
    // Step 0 – Organization Profile
    <div key="org">
      <div className="row">
        <div className="col-md-12">{field("Organization Name", "ClientName", true)}</div>
        <div className="col-md-6">{selectField("Organization Type", "ClientType", true, ClientTypeList, "Select type...")}</div>
        <div className="col-md-6">{selectField("Organization Category", "OrganizationType", false, OrganizationTypeList, "Select category...")}</div>
        <div className="col-md-12">{field("Website URL", "WebsiteURL", false, "url")}</div>
      </div>
    </div>,

    // Step 1 – Contact & Address
    <div key="contact">
      <div className="row">
        <div className="col-md-6">{field("Contact Person Name", "ContactPersonName", true)}</div>
        <div className="col-md-6">{field("Designation", "ContactPersonDesignation", false)}</div>
        <div className="col-md-6">{field("Contact Email", "ContactEmailId", false, "email")}</div>
        <div className="col-md-6">{field("Phone", "Phone", false, "tel")}</div>
        <div className="col-md-12">
          <hr style={{ margin: "8px 0 16px" }} />
          <p style={{ fontWeight: 600, fontSize: 13, color: "#555", marginBottom: 12 }}>Organization Address</p>
        </div>
        <div className="col-md-12">{field("Address Line 1", "AddressLine1", false)}</div>
        <div className="col-md-12">{field("Address Line 2", "AddressLine2", false)}</div>
        <div className="col-md-6">{field("City", "City", false)}</div>
        <div className="col-md-6">{field("Pincode", "Pincode", false)}</div>
        <div className="col-md-6">{field("State", "State", false)}</div>
        <div className="col-md-6">{field("Country", "Country", false)}</div>
      </div>
    </div>,

    // Step 2 – Billing
    <div key="billing">
      <div className="row">
        <div className="col-12 mb-3">
          <div
            style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
            onClick={() => setSameBilling((v) => !v)}
          >
            <Input type="checkbox" checked={sameBilling} readOnly style={{ margin: 0, cursor: "pointer" }} />
            <span style={{ fontSize: 13 }}>Same as organization address</span>
          </div>
        </div>
        <div className="col-md-12">{field("Billing Address Line 1", "BillingAddressLine1", false)}</div>
        <div className="col-md-12">{field("Billing Address Line 2", "BillingAddressLine2", false)}</div>
        <div className="col-md-6">{field("City", "BillingCity", false)}</div>
        <div className="col-md-6">{field("District", "BillingDistrict", false)}</div>
        <div className="col-md-6">{field("Pincode", "BillingPincode", false)}</div>
        <div className="col-md-6">{field("State", "BillingState", false)}</div>
        <div className="col-md-12">{field("Country", "BillingCountry", false)}</div>
        <div className="col-md-12">{field("GST Number", "GSTNumber", false)}</div>
      </div>
    </div>,

    // Step 3 – Bank Details (optional)
    <div key="bank">
      <p style={{ color: "#6c757d", fontSize: 13, marginBottom: 20 }}>
        Bank details are optional and can be added later from your profile settings.
      </p>
      <div className="row">
        <div className="col-md-6">{field("Bank Name", "Bank", false)}</div>
        <div className="col-md-6">{field("Account Number", "BankAccountNumber", false)}</div>
        <div className="col-md-6">{field("Branch", "Branch", false)}</div>
        <div className="col-md-6">{field("IFSC Code", "IFSCCode", false)}</div>
      </div>
    </div>,
  ];

  if (!userData || !clientProfileFetched) {
    return <Loader />;
  }

  return (
    <>
      <Head>
        <title>Auticare – Complete Your Setup</title>
      </Head>
      <div style={{ minHeight: "100vh", background: "#f4f5f7", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px" }}>
        <div style={{ width: "100%", maxWidth: 680, background: "#fff", borderRadius: 12, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", overflow: "hidden" }}>
          {/* Header */}
          <div style={{ background: "linear-gradient(135deg, #3b5bdb 0%, #1971c2 100%)", padding: "28px 32px 24px", color: "#fff" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: 1 }}>Auticare</span>
            </div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Complete Your Organization Setup</h2>
            <p style={{ margin: "6px 0 0", opacity: 0.85, fontSize: 14 }}>
              Welcome{userData?.UserData?.UserName ? `, ${userData.UserData.UserName}` : ""}! Fill in your details to get started.
            </p>
          </div>

          {/* Step indicator */}
          <div style={{ display: "flex", borderBottom: "1px solid #eee" }}>
            {STEPS.map((s, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  padding: "12px 8px",
                  textAlign: "center",
                  fontSize: 12,
                  fontWeight: i === step ? 700 : 400,
                  color: i === step ? "#1971c2" : i < step ? "#2f9e44" : "#adb5bd",
                  borderBottom: i === step ? "3px solid #1971c2" : "3px solid transparent",
                  transition: "all 0.2s",
                }}
              >
                <span style={{ display: "block", fontSize: 16, marginBottom: 2 }}>
                  {i < step ? "✓" : i + 1}
                </span>
                {s}
              </div>
            ))}
          </div>

          {/* Form body */}
          <div style={{ padding: "28px 32px" }}>
            <Form onSubmit={(e) => e.preventDefault()}>
              {stepContent[step]}
            </Form>
          </div>

          {/* Navigation */}
          <div style={{ padding: "0 32px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Button color="secondary" outline onClick={prev} disabled={step === 0}>
              Back
            </Button>
            <div style={{ color: "#adb5bd", fontSize: 13 }}>Step {step + 1} of {STEPS.length}</div>
            {step < STEPS.length - 1 ? (
              <Button color="primary" onClick={next}>
                Continue
              </Button>
            ) : (
              <Button color="success" onClick={handleSubmit} disabled={isOnboarding}>
                {isOnboarding ? "Saving…" : "Complete Setup"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
