import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loader from "../logoutLoader";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { signOut, selectUserData, LogoutLoading, logoutLoader } from "../../../store/slice/auth.slice";
import { ToastNotification } from "../toast";
import Axios from "../../../util/api.util";

const INDIAN_LANGUAGES = [
  { code: "hi-IN", name: "Hindi" },
  { code: "bn-IN", name: "Bengali" },
  { code: "te-IN", name: "Telugu" },
  { code: "mr-IN", name: "Marathi" },
  { code: "ta-IN", name: "Tamil" },
  { code: "ur-IN", name: "Urdu" },
  { code: "gu-IN", name: "Gujarati" },
  { code: "kn-IN", name: "Kannada" },
  { code: "ml-IN", name: "Malayalam" },
  { code: "or-IN", name: "Odia" },
  { code: "pa-IN", name: "Punjabi" },
  { code: "as-IN", name: "Assamese" },
  { code: "mai-IN", name: "Maithili" },
  { code: "sa-IN", name: "Sanskrit" },
  { code: "kok-IN", name: "Konkani" },
  { code: "ne-IN", name: "Nepali" },
  { code: "sd-IN", name: "Sindhi" },
  { code: "ks-IN", name: "Kashmiri" },
  { code: "doi-IN", name: "Dogri" },
  { code: "mni-IN", name: "Manipuri" },
  { code: "sat-IN", name: "Santali" },
  { code: "brx-IN", name: "Bodo" },
];

const INTERNATIONAL_LANGUAGES = [
  { code: "en-US", name: "English (US)" },
  { code: "en-GB", name: "English (UK)" },
  { code: "es-ES", name: "Spanish" },
  { code: "fr-FR", name: "French" },
  { code: "de-DE", name: "German" },
  { code: "ar-SA", name: "Arabic" },
  { code: "pt-PT", name: "Portuguese" },
  { code: "ru-RU", name: "Russian" },
  { code: "ja-JP", name: "Japanese" },
  { code: "zh-CN", name: "Chinese (Mandarin)" },
  { code: "ko-KR", name: "Korean" },
  { code: "it-IT", name: "Italian" },
  { code: "nl-NL", name: "Dutch" },
  { code: "tr-TR", name: "Turkish" },
  { code: "pl-PL", name: "Polish" },
  { code: "sv-SE", name: "Swedish" },
  { code: "da-DK", name: "Danish" },
  { code: "fi-FI", name: "Finnish" },
  { code: "nb-NO", name: "Norwegian" },
  { code: "el-GR", name: "Greek" },
  { code: "he-IL", name: "Hebrew" },
  { code: "sw-KE", name: "Swahili" },
  { code: "id-ID", name: "Indonesian" },
  { code: "th-TH", name: "Thai" },
  { code: "vi-VN", name: "Vietnamese" },
];

function ProfileMenu() {
  const [menu, setMenu] = useState(false);
  const [pwModal, setPwModal] = useState(false);
  const [langModal, setLangModal] = useState(false);
  const [accessModal, setAccessModal] = useState(false);

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [selectedLang, setSelectedLang] = useState({ code: "en-US", name: "English (US)" });
  const [speechEnabled, setSpeechEnabled] = useState(false);

  const router = useRouter();
  const UserData = useSelector(selectUserData);
  const loading = useSelector(LogoutLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("auticare_language");
      if (savedLang) setSelectedLang(JSON.parse(savedLang));
      const savedSpeech = localStorage.getItem("auticare_speech_enabled");
      if (savedSpeech !== null) setSpeechEnabled(JSON.parse(savedSpeech));
    } catch (_) {}
  }, []);

  const setLogout = async () => {
    dispatch(logoutLoader(true));
    const result = await dispatch(signOut()).unwrap();
    if (result.success) ToastNotification("success", result.results.message);
    else ToastNotification("Failed", "Log Out Failed");
    dispatch(logoutLoader(false));
  };

  const handleChangePassword = async () => {
    if (!currentPw || !newPw || !confirmPw) {
      return ToastNotification("error", "All fields are required");
    }
    if (newPw !== confirmPw) {
      return ToastNotification("error", "New passwords do not match");
    }
    if (newPw.length < 6) {
      return ToastNotification("error", "New password must be at least 6 characters");
    }
    setPwLoading(true);
    try {
      await Axios.put("/api/v1/auth/change-password", {
        CurrentPassword: currentPw,
        NewPassword: newPw,
      });
      ToastNotification("success", "Password changed successfully");
      setPwModal(false);
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
    } catch (error) {
      const msg = error.response?.data?.errors?.message || error.errors?.message || "Failed to change password";
      ToastNotification("error", msg);
    }
    setPwLoading(false);
  };

  const handleSaveLanguage = () => {
    localStorage.setItem("auticare_language", JSON.stringify(selectedLang));
    ToastNotification("success", `Language set to ${selectedLang.name}`);
    setLangModal(false);
  };

  const handleSaveAccessibility = () => {
    localStorage.setItem("auticare_speech_enabled", JSON.stringify(speechEnabled));
    ToastNotification("success", `Speech ${speechEnabled ? "enabled" : "disabled"}`);
    setAccessModal(false);
  };

  const testSpeech = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance("Hello, welcome to Auticare");
    utter.lang = selectedLang.code;
    window.speechSynthesis.speak(utter);
  };

  const allLanguages = [...INDIAN_LANGUAGES, ...INTERNATIONAL_LANGUAGES];

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <Dropdown isOpen={menu} toggle={() => setMenu(!menu)} className="d-inline-block user-dropdown">
            <DropdownToggle
              tag="button"
              className="btn header-item waves-effect"
              id="page-header-user-dropdown">
              <img
                className="rounded-circle header-profile-user me-1"
                src="/images/users/avatar_sample.jpg"
                alt="Header Avatar"
              />
              <span className="d-none d-xl-inline-block ms-1 text-transform">{UserData?.EmailId}</span>
              <i className="mdi mdi-chevron-down d-none ms-1 d-xl-inline-block"></i>
            </DropdownToggle>

            <DropdownMenu className="dropdown-menu-end dropdown-menu-right">
              <DropdownItem
                onClick={() => { setMenu(false); router.push("/my-profile"); }}
                className="d-flex align-items-center gap-2">
                <i className="ri-user-line font-size-16"></i>
                <span>Profile</span>
              </DropdownItem>

              <DropdownItem
                onClick={() => { setMenu(false); setPwModal(true); }}
                className="d-flex align-items-center gap-2">
                <i className="ri-lock-password-line font-size-16"></i>
                <span>Account Details</span>
              </DropdownItem>

              <DropdownItem
                onClick={() => { setMenu(false); setLangModal(true); }}
                className="d-flex align-items-center gap-2">
                <i className="ri-translate-2 font-size-16"></i>
                <span>Language</span>
              </DropdownItem>

              <DropdownItem
                onClick={() => { setMenu(false); setAccessModal(true); }}
                className="d-flex align-items-center gap-2">
                <i className="ri-accessibility-line font-size-16"></i>
                <span>Accessibility</span>
              </DropdownItem>

              <DropdownItem divider />

              <DropdownItem
                className="text-danger d-flex align-items-center gap-2"
                onClick={setLogout}>
                <i className="ri-shut-down-line font-size-16 text-danger"></i>
                <span>Logout</span>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          {/* Change Password Modal */}
          <Modal isOpen={pwModal} toggle={() => setPwModal(!pwModal)} centered>
            <ModalHeader toggle={() => setPwModal(!pwModal)}>
              <i className="ri-lock-password-line me-2"></i>Account Details
            </ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label>Current Password</Label>
                <div className="input-group">
                  <Input
                    type={showCurrent ? "text" : "password"}
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                    placeholder="Enter current password"
                  />
                  <Button color="light" onClick={() => setShowCurrent(!showCurrent)}>
                    <i className={`mdi ${showCurrent ? "mdi-eye-off" : "mdi-eye"}`}></i>
                  </Button>
                </div>
              </FormGroup>
              <FormGroup>
                <Label>New Password</Label>
                <div className="input-group">
                  <Input
                    type={showNew ? "text" : "password"}
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    placeholder="Enter new password (min 6 chars)"
                  />
                  <Button color="light" onClick={() => setShowNew(!showNew)}>
                    <i className={`mdi ${showNew ? "mdi-eye-off" : "mdi-eye"}`}></i>
                  </Button>
                </div>
              </FormGroup>
              <FormGroup>
                <Label>Confirm New Password</Label>
                <div className="input-group">
                  <Input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    placeholder="Re-enter new password"
                  />
                  <Button color="light" onClick={() => setShowConfirm(!showConfirm)}>
                    <i className={`mdi ${showConfirm ? "mdi-eye-off" : "mdi-eye"}`}></i>
                  </Button>
                </div>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="light" onClick={() => setPwModal(false)}>Cancel</Button>
              <Button color="primary" onClick={handleChangePassword} disabled={pwLoading}>
                {pwLoading ? "Saving..." : "Change Password"}
              </Button>
            </ModalFooter>
          </Modal>

          {/* Language Modal */}
          <Modal isOpen={langModal} toggle={() => setLangModal(!langModal)} centered>
            <ModalHeader toggle={() => setLangModal(!langModal)}>
              <i className="ri-translate-2 me-2"></i>Select Language
            </ModalHeader>
            <ModalBody style={{ maxHeight: "420px", overflowY: "auto" }}>
              <p className="text-muted mb-3 small">Indian Languages</p>
              {INDIAN_LANGUAGES.map((lang) => (
                <div
                  key={lang.code}
                  className={`d-flex align-items-center p-2 rounded mb-1 cursor-pointer ${selectedLang.code === lang.code ? "bg-primary text-white" : "bg-light"}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedLang(lang)}>
                  {selectedLang.code === lang.code && (
                    <i className="mdi mdi-check me-2"></i>
                  )}
                  {lang.name}
                </div>
              ))}
              <p className="text-muted mt-3 mb-3 small">International Languages</p>
              {INTERNATIONAL_LANGUAGES.map((lang) => (
                <div
                  key={lang.code}
                  className={`d-flex align-items-center p-2 rounded mb-1 cursor-pointer ${selectedLang.code === lang.code ? "bg-primary text-white" : "bg-light"}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedLang(lang)}>
                  {selectedLang.code === lang.code && (
                    <i className="mdi mdi-check me-2"></i>
                  )}
                  {lang.name}
                </div>
              ))}
            </ModalBody>
            <ModalFooter>
              <Button color="light" onClick={() => setLangModal(false)}>Cancel</Button>
              <Button color="primary" onClick={handleSaveLanguage}>Save Language</Button>
            </ModalFooter>
          </Modal>

          {/* Accessibility Modal */}
          <Modal isOpen={accessModal} toggle={() => setAccessModal(!accessModal)} centered>
            <ModalHeader toggle={() => setAccessModal(!accessModal)}>
              <i className="ri-accessibility-line me-2"></i>Accessibility
            </ModalHeader>
            <ModalBody>
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                  <h6 className="mb-1">Text-to-Speech</h6>
                  <p className="text-muted small mb-0">Read page content aloud in your selected language</p>
                </div>
                <div className="form-check form-switch ms-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="speechToggle"
                    checked={speechEnabled}
                    onChange={(e) => setSpeechEnabled(e.target.checked)}
                    style={{ width: "3rem", height: "1.5rem", cursor: "pointer" }}
                  />
                </div>
              </div>

              <div className="mb-3">
                <Label className="mb-2">Speech Language</Label>
                <Input
                  type="select"
                  value={selectedLang.code}
                  onChange={(e) => {
                    const lang = allLanguages.find((l) => l.code === e.target.value);
                    if (lang) setSelectedLang(lang);
                  }}>
                  <optgroup label="Indian Languages">
                    {INDIAN_LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>{l.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="International Languages">
                    {INTERNATIONAL_LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>{l.name}</option>
                    ))}
                  </optgroup>
                </Input>
              </div>

              <Button color="light" size="sm" onClick={testSpeech}>
                <i className="mdi mdi-volume-high me-1"></i>Test Speech
              </Button>
            </ModalBody>
            <ModalFooter>
              <Button color="light" onClick={() => setAccessModal(false)}>Cancel</Button>
              <Button color="primary" onClick={handleSaveAccessibility}>Save Settings</Button>
            </ModalFooter>
          </Modal>
        </Fragment>
      )}
    </>
  );
}

export default ProfileMenu;
