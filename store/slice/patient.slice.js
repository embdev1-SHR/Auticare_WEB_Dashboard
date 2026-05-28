import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createPatientService,
  deletePatientService,
  updatePatientService,
  patientDetailsService,
  searchPatientService,
  fetchAllPatientsService,
  patientMetricsService,
  patientMetricsCreateService,
  patientScreeningMetricResponseService,
  patientAssessmentMetricResponseService,
  patientAddCommentService,
  patientListCommentService,
  fetchMetricResponseDetailsService,
  fetchScreeningMetricResponseListService,
  fetchAssessmentMetricResponseListService,
  updatePatientCommentService,
  deletePatientCommentService,
  patientCompleteCheckService,
  patientPlanCreateService,
  patientPlanListService,
  patientPlanGoalListService,
  updatePatientPlanGoalService,
  updatePatientPlanService,
  deletePatientPlanGoalService,
  patientIssuesListService,
  updatePatientAssessment,
  MappingContentsListService,
  createPatientSessionService,
  patientSessionListService,
  HomeSessionCreationService,
  HomeSessionListService,
  homeSessionUpdateService,
  MarkAsReadService,
  patientStartSessionService,
  DetailsSessionService,
  SessionTrailFinishService,
  TrailDetailsService,
  BehaviorListService,
  probeDataCreationService,
  probDataListService,
  patientSessionDataListService,
  probDataMarkAsReadService,
  MandListService,
  patientSessionUpdateService,
  patientAssessmentMetricReportService,
  patientVrSessionCreateService,
  patientScreeningReportService,
  UnfinishedTrailsService,
  patientSessionReportService,
  SessionMandListService,
  SessionBehaviorListService
} from "../../services/patient.services";

import { setModalOpen } from "./layout.slice";
import { ToastNotification } from "../../components/shared/toast";
import Router from "next/router";


export const TrailDetails = createAsyncThunk("patient/TrailDetails", async (data,) => {
  try {
    const res = await TrailDetailsService(data);
    return res.data.results.data;
  } catch (error) {
    console.error(error);
    return error;
  }
});

export const BehaviorList = createAsyncThunk("patient/BehaviorList", async (data,) => {

  try {
    const res = await BehaviorListService(data);
    return res.data.results.data;
  } catch (error) {
    console.error(error);
    return error;
  }
});

export const SessionBehaviorList = createAsyncThunk("patient/SessionBehaviorList", async (data,) => {

  try {
    const res = await SessionBehaviorListService(data);
    return res.data.results.data;
  } catch (error) {
    console.error(error);
    return error;
  }
});

export const VrSessionCreate = createAsyncThunk("patient/VrSessionCreate", async (data, thunkApi) => {
  try {
    const res = await patientVrSessionCreateService(data);
    ToastNotification("success", "Vr Session Create Successfully");
    return res.data.results.data;
  } catch (error) {
    console.error(error);
    ToastNotification("error", "Create Session Failed");
    return error;
  }
});

export const MandList = createAsyncThunk("patient/MandList", async (data, thunkApi) => {
  try {
    const res = await MandListService(data);
    return res.data.results.data;
  } catch (error) {
    console.error(error);
    return error;
  }
});

export const SessionMandList = createAsyncThunk("patient/SessionMandList", async (data, thunkApi) => {
  try {
    const res = await SessionMandListService(data);
    return res.data.results.data;
  } catch (error) {
    console.error(error);
    return error;
  }
});

export const ScreeningReportSlice = createAsyncThunk("patient/ScreeningReport", async (data, thunkApi) => {
  try {
    const res = await patientScreeningReportService(data);
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${data.PatientName} ${data.ScaleMetricType} Screening Scale Report.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove()
    return;
  } catch (error) {
    console.error(error);
    return error;
  }
});



export const SessionReportSlice = createAsyncThunk("patient/SessionReportSlice", async (data, thunkApi) => {
  try {
    const res = await patientSessionReportService(data);
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${data.PatientName}-Session Report.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove()
    return;
  } catch (error) {
    console.error(error);
    return error;
  }
});


export const patientAssessmentMetricReport = createAsyncThunk("patient/patientAssessmentMetricReport", async (data) => {
  try {
    const res = await patientAssessmentMetricReportService(data);
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${data.PatientName} ${data.ScaleMetricType} Assessment Report.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove()
    return
  } catch (error) {
    console.error(error);
    return error;
  }
});



export const updatePatientAssessmentSlice = createAsyncThunk("patient/updatePatientAssessmentSlice", async (data, thunkApi) => {
  try {
    const res = await updatePatientAssessment(data);
    if (data.msg) {
      ToastNotification("success", data.msg);
    }
    else {
      ToastNotification("success", "Deleted Successfully");
    }
    await thunkApi.dispatch(fetchPatientMetrics(data.PatientID));
    await data.setAlert(false);
    return res.data.results.data;
  } catch (error) {
    console.error(error);
    return error;
  }
});


export const createHomeSession = createAsyncThunk("patient/createHomeSession", async (data, thunkApi) => {
  try {
    const res = await HomeSessionCreationService(data);
    ToastNotification("success", "Create Session Successfully");
    data.tog_standard()
    await thunkApi.dispatch(listHomeSession(data.PatientID));
    return res.data.results.data;
  } catch (error) {
    ToastNotification("error", "Create Session Failed");
    console.error(error);
    return error;
  }
});

export const updatePatientSession = createAsyncThunk("patient/updatePatientSession", async (data, thunkApi) => {

  try {
    const res = await patientSessionUpdateService(data);
    if (data.msg) {
      ToastNotification("success", data.msg);
    }
    else {
      ToastNotification("success", "Patient Session Updated Successfully");
    }
    Router.push(`/patients/${data.PatientId}`);
    // await thunkApi.dispatch(patientSessionList(data.PatientID));
    return res.data.results.data;
  } catch (error) {
    ToastNotification("error", "Patient Session Updation Failed");
    console.error(error);
    return error;
  }
});

export const probDataMarkAsRead = createAsyncThunk("patient/createHomeSession", async (data, thunkApi) => {
  try {
    const res = await probDataMarkAsReadService(data);
    ToastNotification("success", "Mark As Achieved Successfully");
    await thunkApi.dispatch(probeDataList(data.PatientID));
    return res.data.results.data;
  } catch (error) {
    ToastNotification("error", "Mark As Achieved Failed");
    console.error(error);
    return error;
  }
});

export const probeDataCreation = createAsyncThunk("patient/probeDataCreation", async (data, thunkApi) => {
  try {
    const res = await probeDataCreationService(data);
    ToastNotification("success", "probe Data creation Successfully");
    data.setModalOpen(false);
    data.resetForm();
    await thunkApi.dispatch(probeDataList(data.PatientID));
    return res.data.results.data;
  } catch (error) {
    ToastNotification("error", "probe Data creation Failed");
    console.error(error);
    return error;
  }
});

export const SessionDataList = createAsyncThunk("patient/SessionDataList", async (data, thunkApi) => {
  try {
    const res = await patientSessionDataListService(data);
    return res.data.results.data;
  } catch (error) {
    console.error(error);
    return error;
  }
});


export const probeDataList = createAsyncThunk("patient/probeDataList", async (data, thunkApi) => {
  try {
    const res = await probDataListService(data);
    return res.data.results.data;
  } catch (error) {
    console.error(error);
    return error;
  }
});


export const SessionTrailFinish = createAsyncThunk("patient/SessionTrailFinish", async (data, thunkApi) => {
  try {
    const res = await SessionTrailFinishService(data);
    ToastNotification("success", "Session Trial Finished Successfully");
    Router.push(`/patients/${data.PatientId}`);
    return res.data.results.data;
  } catch (error) {
    ToastNotification("error", "Finishing Session Trial Failed");
    console.error(error);
    return error;
  }
});


export const updateHomeSession = createAsyncThunk("patient/updateHomeSession", async (data, thunkApi) => {
  try {
    const res = await homeSessionUpdateService(data);
    if (data.msg) {
      ToastNotification("success", data.msg);
    }
    else {
      ToastNotification("success", "update Session Successfully");
    }
    await thunkApi.dispatch(setHomeSessionEdit(false));
    await thunkApi.dispatch(listHomeSession(data.PatientID));
    return res.data.results.data;
  } catch (error) {
    ToastNotification("error", "update Session Failed");
    console.error(error);
    return error;
  }
});


export const MarkAsRead = createAsyncThunk("patient/MarkAsRead", async (data, thunkApi) => {
  try {
    const res = await MarkAsReadService(data);
    ToastNotification("success", "Mark As Read Successfully");
    return res.data.results.data;
  } catch (error) {
    ToastNotification("error", "Mark As Read Failed");
    console.error(error);
    return error;
  }
});


export const DetailsSession = createAsyncThunk("patient/DetailsSession", async (data, thunkApi) => {

  try {
    const res = await DetailsSessionService(data);
    return res.data.results.data;
  } catch (error) {
    console.error(error);
    return error;
  }
});

export const listHomeSession = createAsyncThunk("patient/listHomeSession", async (data, thunkApi) => {
  try {
    const res = await HomeSessionListService(data);
    return res.data.results.data;
  } catch (error) {
    ToastNotification("error", "Create Session Failed");
    console.error(error);
    return error;
  }
});



export const createPatientSession = createAsyncThunk("patient/createPatientSession", async (data, thunkApi) => {
  try {
    const res = await createPatientSessionService(data);
    ToastNotification("success", "Create Session Successfully");
    await thunkApi.dispatch(patientSessionList(data.PatientId));
    data.setSelectedBillState([]);
    data.setDob("");
    data.setModalOpen(false);
    data.resetForm();
    return res.data.results.data;
  } catch (error) {
    ToastNotification("error", "Create Session Failed");
    console.error(error);
    return error;
  }
});


export const patientSessionList = createAsyncThunk("content/patientSessionList", async (PatientID) => {
  try {
    const res = await patientSessionListService(PatientID);
    return res.data.results.data;
  } catch (error) {
    console.error(error);
    return error.message;
  }
});


export const ContentMappingList = createAsyncThunk("content/ContentMappingList", async () => {
  try {
    const res = await MappingContentsListService();
    return res.data.results.data;
  } catch (error) {
    ToastNotification("error", " failed");
    console.error(error);
    return error.message;
  }
});

export const patientCompleteCheck = createAsyncThunk("patient/patientCompleteCheck", async (data, thunkApi) => {
  try {
    const res = await patientCompleteCheckService(data);
    ToastNotification("success", "comment Deleted Successfully");
    return res.data.results.data;
  } catch (error) {
    console.error(error);
    return error;
  }
});

export const PatientDeleteComment = createAsyncThunk("patient/PatientDeleteComment", async (data, thunkApi) => {
  try {
    const res = await deletePatientCommentService(data.currentId.CommentId);
    ToastNotification("success", "comment Deleted Successfully");
    await thunkApi.dispatch(PatientListComment(data.currentId.PatientId));
    return res.data.results.message;
  } catch (error) {
    ToastNotification("error", "comment Delete Failed");
    console.error(error);
    return error;
  }
});

export const PatientUpdateComment = createAsyncThunk("patient/PatientUpdateComment", async (data, thunkApi) => {
  try {
    const valueToSend = {
      Comment: data.Comment,
      Status: data.Status,
    };
    const res = await updatePatientCommentService(data.CommentID, valueToSend);
    ToastNotification("success", "comment Update Successfully");
    await thunkApi.dispatch(PatientListComment(data.PatientId));
    return res.data.results.message;
  } catch (error) {
    ToastNotification("error", "comment Update Failed");
    console.error(error);
    return error;
  }
});

export const fetchAllPatients = createAsyncThunk("patient/fetchAllPatients", async (thunkApi) => {
  try {

    const { data } = await fetchAllPatientsService();
    return data.results.data;
  } catch (error) {
    const message = error.responce.data.message;
    return thunkApi.rejectWithValue(message);
  }
});

export const PatientAddComment = createAsyncThunk("patient/PatientAddComment", async (data, thunkApi) => {
  const NewData = {
    PatientID: data.PatientID,
    Comment: data.Comment,
  };
  try {
    const res = await patientAddCommentService(NewData);
    ToastNotification("success", "Added comment Successfully");

    await thunkApi.dispatch(PatientListComment(data.PatientID));
    return res.data.results.message;
  } catch (error) {
    ToastNotification("error", "Failed to add comment");
    console.error(error);
    return error;
  }
});
export const PatientListComment = createAsyncThunk("patient/PatientListComment", async (data) => {
  try {
    const res = await patientListCommentService(data);
    return res.data.results;
  } catch (error) {
    console.error(error);
    return error;
  }
});

export const createPatient = createAsyncThunk("patient/createPatient", async (data, thunkApi) => {
  try {
    const res = await createPatientService(data);
    ToastNotification("success", "Added Patient Successfully");
    await thunkApi.dispatch(setModalOpen(false));
    await thunkApi.dispatch(fetchAllPatients());
    return res.data.results.message;
  } catch (error) {
    if (typeof error.errors === "object") {
      const err = error.errors.message.replace("Duplicate entry", "");
      const errorr = err.replace(" for key 'EmailId'", "");
      ToastNotification("error", "Failed", errorr + " is already exist");
    }

    else {
      error.response.data.errors.map((e) => {
        ToastNotification("error", "Failed", e.param + " " + e.msg);
      });
    }
    return error.message;
  }
});
export const updatePatient = createAsyncThunk("patient/updatePatient", async (data, thunkApi) => {
  try {
    const res = await updatePatientService(data);
    ToastNotification("success", "update Patient Successfully");
    await thunkApi.dispatch(SelectPatient(data.PatientID));
    await thunkApi.dispatch(fetchPatientIssuesList(data.PatientID));
    return res.data.results.message;
  } catch (error) {
    ToastNotification("error", "Update failed");
    console.error(error);
    return error.message;
  }
});

export const deletePatient = createAsyncThunk("patient/deletePatient", async (PatientID, thunkApi) => {
  try {
    const res = await deletePatientService(PatientID);
    ToastNotification("success", "Deleted!", res.data.results.message);
    await thunkApi.dispatch(fetchAllPatients());
    return res.data.results.message;
  } catch (error) {
    ToastNotification("error", "Delete failed");
    console.error(error);
    return error.message;
  }
});
export const SelectPatient = createAsyncThunk("patient/SelectPatient", async (id, thunkApi) => {

  try {
    const res = await patientDetailsService(id);
    await thunkApi.dispatch(fetchPatientMetrics(id));
    return res.data.results.data;
  } catch (error) {
    console.log(error);

  }
});

export const searchPatient = createAsyncThunk("patient/searchPatient", async (PatientName, thunkApi) => {
  console.log("*** trigger ");
  try {

    const res = await searchPatientService(PatientName);
    console.log("*** value",res);

    return res.data.results.data;
  } catch (error) {
    const message = error.responce.data.message;
    return thunkApi.rejectWithValue(message);
  }
});

export const fetchPatientMetrics = createAsyncThunk("patient/fetchPatientMetrics", async (patientId, thunkApi) => {
  try {
    const { data } = await patientMetricsService(patientId);
    const results = data.results.data;
    return results;
  } catch (error) {
    console.log(error);
    const message = error.response.data.errors.message;
    return thunkApi.rejectWithValue(message);
  }
});

export const createPatientMetrics = createAsyncThunk("patient/createPatientMetrics", async (payload, thunkApi) => {
  try {
    const { data } = await patientMetricsCreateService(payload.PatientId, payload.body);
    const results = data.results.data;
    Router.push(`${payload.PatientId}/scales/${payload.body.ScaleID}/${payload.body.ScaleMetricType.toLowerCase()}/${data.results.insertId}`);
    return results;
  } catch (error) {
    console.log(error);
    const message = error.response.data.errors.message;
    return thunkApi.rejectWithValue(message);
  }
});



export const patientStartSession = createAsyncThunk("patient/patientStartSession", async (payload, thunkApi) => {
  try {

    const unfinishedTrail = await UnfinishedTrailsService(payload);
    if (unfinishedTrail.data.results.data.length) {
      Router.push(`${payload.PatientId}/sessions/${payload.SessionID}/trials/${unfinishedTrail.data.results.data[0].SessionTrialID}`);
    } else {
      const { data } = await patientStartSessionService(payload);
      const results = data.results.data;
      Router.push(`${payload.PatientId}/sessions/${payload.SessionID}/trials/${data.results.insertId}`);
      return results;
    }
  } catch (error) {
    const message = error.response.data.errors.message;
    return thunkApi.rejectWithValue(message);
  }
});


export const patientScreeningMetricResponse = createAsyncThunk("patient/patientScreeningMetricResponse", async (payload, thunkApi) => {
  try {
    const { data } = await patientScreeningMetricResponseService(payload.PatientID, payload.PatientMetricID, payload.body);
    const results = data.results;
    Router.push(`${payload.asPath}/result`);
    return results;
  } catch (error) {
    console.log(error);
    ToastNotification("error", "failed");
    const message = error.response.data.errors.message;
    return thunkApi.rejectWithValue(message);
  }
});
export const patientAssessmentMetricResponse = createAsyncThunk("patient/patientAssessmentMetricResponse", async (payload, thunkApi) => {
  try {
    const { data } = await patientAssessmentMetricResponseService(payload.PatientID, payload.PatientMetricID, payload.body);
    const results = data.results;
    Router.push(`${payload.asPath}/result`);
    return results.message;
  } catch (error) {
    ToastNotification("error", "failed");
    console.log(error);
    const message = error.response.data.errors.message;
    return thunkApi.rejectWithValue(message);
  }
});
export const fetchMetricResponseDetails = createAsyncThunk("patient/fetchMetricResponseDetails", async (payload, thunkApi) => {
  try {
    const { data } = await fetchMetricResponseDetailsService(payload.PatientID, payload.PatientMetricID);
    const results = data.results.data[0];
    return results;
  } catch (error) {
    console.log(error);
    const message = error.response.data.errors.message;
    return thunkApi.rejectWithValue(message);
  }
});
export const fetchScreeningMetricResponseList = createAsyncThunk("patient/fetchScreeningMetricResponseList", async (payload, thunkApi) => {
  try {
    const { data } = await fetchScreeningMetricResponseListService(payload.PatientID, payload.PatientMetricID);
    const results = data.results.data;
    return results;
  } catch (error) {
    console.log(error);
    const message = error.response.data.errors.message;
    return thunkApi.rejectWithValue(message);
  }
});
export const fetchAssessmentMetricResponseList = createAsyncThunk("patient/fetchAssessmentMetricResponseList", async (payload, thunkApi) => {
  try {
    const { data } = await fetchAssessmentMetricResponseListService(payload.PatientID, payload.PatientMetricID);
    const results = data.results.data;
    return results;
  } catch (error) {
    console.log(error);
    const message = error.response.data.errors.message;
    return thunkApi.rejectWithValue(message);
  }
});
export const createPlan = createAsyncThunk("patient/createPlan", async (payload, thunkApi) => {
  try {
    const { data } = await patientPlanCreateService(payload.PatientId, payload.data);
    thunkApi.dispatch(fetchPatientPlanList(payload.PatientId))
    const results = data.results.data;
    ToastNotification("success", "plan created successfully");

    return results;
  } catch (error) {
    console.log(error);
    ToastNotification("error", "plan creation failed");
    const message = error.response.data.errors.message;
    return thunkApi.rejectWithValue(message);
  }
});
export const fetchPatientPlanList = createAsyncThunk("patient/fetchPatientPlanList", async (payload, thunkApi) => {
  try {
    const { data } = await patientPlanListService(payload);
    const results = data.results.data;
    return results;
  } catch (error) {
    console.log(error);
    const message = error.response.data.errors.message;
    return thunkApi.rejectWithValue(message);
  }
});
export const fetchPatientPlanGoalList = createAsyncThunk("patient/fetchPatientPlanGoalList", async (payload, thunkApi) => {
  try {
    const { data } = await patientPlanGoalListService(payload.PatientID, payload.PlanID);
    const results = data.results.data;
    console.log("results", results);

    return results;
  } catch (error) {
    console.log(error);
    const message = error.response.data.errors.message;
    return thunkApi.rejectWithValue(message);
  }
});
export const updatePatientPlan = createAsyncThunk("patient/updatePatientPlan", async (data, thunkApi) => {
  try {
    const res = await updatePatientPlanService(data.PatientID, data.PlanID, data.payload);

    ToastNotification("success", res.data.results.message);
    await thunkApi.dispatch(fetchPatientPlanList(data.PatientID, data.PlanID));
    return res.data.results.message;
  } catch (error) {
    ToastNotification("error", "Update failed");
    console.error(error);
    return error.message;
  }
});
export const deletePatientPlanGoal = createAsyncThunk("patient/deletePatientPlanGoal", async (data, thunkApi) => {
  try {
    const res = await deletePatientPlanGoalService(data.PlanGoalID);
    await thunkApi.dispatch(fetchPatientPlanGoalList(data));
    ToastNotification("success", res.data.results.message);
    return res.data.results.message;
  } catch (error) {
    ToastNotification("error", "Delete failed");
    console.error(error);
    return error.message;
  }
});
export const updatePatientPlanGoal = createAsyncThunk("patient/updatePatientPlanGoal", async (data, thunkApi) => {
  try {
    const res = await updatePatientPlanGoalService(data.PlanGoalID, data.payload);
    await thunkApi.dispatch(fetchPatientPlanGoalList(data));
    ToastNotification("success", res.data.results.message);
    return res.data.results.message;
  } catch (error) {
    ToastNotification("error", "Update failed");
    console.error(error);
    return error.message;
  }
});

export const fetchPatientIssuesList = createAsyncThunk("patient/fetchPatientIssuesList", async (PatientID, thunkApi) => {
  try {
    const res = await patientIssuesListService(PatientID);
    return res.data.results.data;
  } catch (error) {
    const message = error.responce.data.message;
    return thunkApi.rejectWithValue(message);
  }
});

const initialState = {
  CompleteCheck: [],
  editConfirm: {},
  Goals: [],
  patients: [],
  homeSessionList: [],
  selectedPatient: null,
  isLoading: false,
  patientIsEdit: typeof window !== "undefined" && sessionStorage.getItem("patientIsEdit") ? JSON.parse(sessionStorage.getItem("patientIsEdit")) : false,
  currentPatientId: null,
  IsSearch: false,
  isPatientCreating: false,
  isPatientUpdating: false,
  isPatientDetails: false,
  isPatientMetrics: false,
  patientScreeningList: [],
  patientAssessmentList: [],
  responseData: null,
  ListComment: [],
  responseList: null,
  metricDetails: null,
  isLoadingButton: false,
  currentCommentId: null,
  UpdateLoadingButton: false,
  patientPlanList: [],
  planGoals: [],
  isPlanLoading: false,
  isIssuesLoading: false,
  HomeSessionEdit: false,
  patientIssuesList: [],
  patientFilterData: {},
  CondentMapping: [],
  SessionListData: [],
  HomeSessionID: [],
  Tab: 1,
  DetailsSessionList: [],
  Trail: [],
  BehaviorListData: [],
  hList: [],
  mList: [],
  probeData: [],
  SessionDataInt: [],
  BehaviorListDataList: [],
  SessionBehaviorListData: [],
  MandListData: [],
  SessionMandListData: [],
  selectedPlan: {},
  CurrentScaleID: [],
  TableSearchData: [],
  TableSearchDataScreening: []
};

export const patientSlice = createSlice({
  name: "patient",
  initialState: initialState,
  reducers: {
    setPatientEdit: (state, action) => {
      typeof window && sessionStorage.setItem("patientIsEdit", action.payload);
      return {
        ...state,
        patientIsEdit: action.payload,
      };
    },
    setCurrentPatientId: (state, action) => {
      return {
        ...state,
        currentPatientId: action.payload,
      };
    },
    setResponseData: (state, action) => {
      return {
        ...state,
        responseData: action.payload,
      };
    },
    setCurrentCommentId: (state, action) => {
      return {
        ...state,
        currentCommentId: action.payload,
      };
    },
    setEdit: (state, action) => {
      return {
        ...state,
        editConfirm: action.payload,
      };
    },
    setHomeSessionEdit: (state, action) => {
      return {
        ...state,
        HomeSessionEdit: action.payload,
      };
    },
    setGoals: (state, action) => {
      return {
        ...state,
        Goals: action.payload,
      };
    },
    setSelectedPlan: (state, action) => {
      return {
        ...state,
        selectedPlan: action.payload,
      };
    },
    setPatientFilterData: (state, action) => {
      return {
        ...state,
        patientFilterData: action.payload,
      };
    },
    currentHomeSessionID: (state, action) => {
      return {
        ...state,
        HomeSessionID: action.payload,
      };
    },
    setCustomActiveTab: (state, action) => {
      return {
        ...state,
        Tab: action.payload,
      };
    },
    BehaviourList: (state, action) => {
      return {
        ...state,
        hList: [...state.hList, action.payload],
      };
    },
    mandList: (state, action) => {
      return {
        ...state,
        mList: [...state.mList, action.payload],
      };
    },

    resetBDData: (state, action) => {
      return {
        ...state,
        mList: [],
        hList: []
      }
    },

    resetPlanState: (state, action) => {
      return {
        ...state,
        planGoals: [],
        selectedPlan: {},
      }
    },

    ScaleIdList: (state, action) => {
      return {
        ...state,
        CurrentScaleID: action.payload,
      };
    },
    tableSearch: (state, action) => {
      return {
        ...state,
        TableSearchData: action.payload,
      };
    },
    tableSearchScreening: (state, action) => {
      return {
        ...state,
        TableSearchDataScreening: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPatients.pending, (state, action) => {
        state.isLoading = true;
      })

      .addCase(fetchAllPatients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.patients = action.payload;
      })
      .addCase(SessionBehaviorList.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(SessionBehaviorList.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(SessionBehaviorList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.SessionBehaviorListData = action.payload;
      })
      .addCase(MandList.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(MandList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.MandListData = action.payload;
      })
      .addCase(MandList.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(SessionMandList.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(SessionMandList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.SessionMandListData = action.payload;
      })
      .addCase(SessionMandList.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(updatePatientSession.pending, (state, action) => {
        state.isLoading = true;
      })

      .addCase(updatePatientSession.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(SessionTrailFinish.pending, (state, action) => {
        state.isLoading = true;
      })

      .addCase(SessionTrailFinish.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(SessionDataList.pending, (state, action) => {
        state.isLoading = true;
      })

      .addCase(SessionDataList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.SessionDataInt = action.payload;
      })
      .addCase(probeDataList.pending, (state, action) => {
        state.isLoading = true;
      })

      .addCase(probeDataList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.probeData = action.payload;
      })
      .addCase(probeDataCreation.pending, (state, action) => {
        state.isLoading = true;
      })

      .addCase(probeDataCreation.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(TrailDetails.pending, (state, action) => {
        state.isLoading = true;
      })

      .addCase(TrailDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.Trail = action.payload;
      })
      .addCase(BehaviorList.pending, (state, action) => {
        state.isLoading = true;
      })

      .addCase(BehaviorList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.BehaviorListData = action.payload;
      })
      .addCase(DetailsSession.pending, (state, action) => {
        state.isLoading = true;
      })

      .addCase(DetailsSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.DetailsSessionList = action.payload;
      })
      .addCase(listHomeSession.pending, (state, action) => {
        state.isLoading = true;
      })

      .addCase(listHomeSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.homeSessionList = action.payload;
      })
      .addCase(createPlan.pending, (state, action) => {
        state.isLoading = true;
      })

      .addCase(createPlan.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(createHomeSession.pending, (state, action) => {
        state.isLoading = true;
      })

      .addCase(createHomeSession.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(createPatientSession.pending, (state, action) => {
        state.isLoading = true;
      })

      .addCase(createPatientSession.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(patientCompleteCheck.pending, (state, action) => {
        state.isLoading = true;
      })

      .addCase(updateHomeSession.pending, (state, action) => {
        state.isLoading = true;
      })

      .addCase(updateHomeSession.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(patientCompleteCheck.fulfilled, (state, action) => {
        state.isLoading = false;
        state.CompleteCheck = action.payload;
      })
      .addCase(createPatient.pending, (state, action) => {
        state.isPatientCreating = true;
      })
      .addCase(createPatient.fulfilled, (state, action) => {
        state.isPatientCreating = false;
      })
      .addCase(createPatient.rejected, (state, action) => {
        state.isPatientCreating = false;
      })
      .addCase(PatientAddComment.pending, (state, action) => {
        state.isLoadingButton = true;
      })
      .addCase(PatientAddComment.fulfilled, (state, action) => {
        state.isLoadingButton = false;
      })
      .addCase(PatientAddComment.rejected, (state, action) => {
        state.isLoadingButton = false;
      })
      .addCase(PatientUpdateComment.pending, (state, action) => {
        state.UpdateLoadingButton = true;
      })
      .addCase(PatientUpdateComment.fulfilled, (state, action) => {
        state.UpdateLoadingButton = false;
      })
      .addCase(PatientUpdateComment.rejected, (state, action) => {
        state.UpdateLoadingButton = false;
      })
      .addCase(PatientListComment.pending, (state, action) => {
        state.isPatientCreating = true;
      })
      .addCase(PatientListComment.fulfilled, (state, action) => {
        state.ListComment = action.payload;
        state.isPatientCreating = false;
      })
      .addCase(PatientListComment.rejected, (state, action) => {
        state.isPatientCreating = false;
      })

      .addCase(SelectPatient.pending, (state, action) => {
        state.isPatientDetails = true;
      })
      .addCase(SelectPatient.fulfilled, (state, action) => {
        state.isPatientDetails = false;
        state.selectedPatient = action.payload;
      })
      .addCase(SelectPatient.rejected, (state, action) => {
        state.isPatientDetails = false;
      })
      .addCase(patientSessionList.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(patientSessionList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.SessionListData = action.payload;
        state.TableSearchData = action.payload;
      })
      .addCase(patientSessionList.rejected, (state, action) => {
        state.isLoading = false;
      })

      .addCase(updatePatient.pending, (state, action) => {
        state.isPatientUpdating = true;
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        state.isPatientUpdating = false;
      })
      .addCase(updatePatient.rejected, (state, action) => {
        state.isPatientUpdating = false;
      })
      .addCase(deletePatient.pending, (state, action) => {
        state.isLoading = true;
      })

      .addCase(deletePatient.fulfilled, (state, action) => {
        state.isLoading = false;
      })

      .addCase(deletePatient.rejected, (state, action) => {
        state.isLoading = false;
      })

      .addCase(patientAssessmentMetricResponse.pending, (state, action) => {
        state.isLoading = true;
      })

      .addCase(patientAssessmentMetricResponse.fulfilled, (state, action) => {
        state.isLoading = false;
      })

      .addCase(patientAssessmentMetricResponse.rejected, (state, action) => {
        state.isLoading = false;
      })

      .addCase(patientScreeningMetricResponse.pending, (state, action) => {
        state.isLoading = true;
      })

      .addCase(patientScreeningMetricResponse.fulfilled, (state, action) => {
        state.isLoading = false;
      })

      .addCase(patientScreeningMetricResponse.rejected, (state, action) => {
        state.isLoading = false;
      })

      .addCase(searchPatient.pending, (state, action) => {
        state.IsSearch = true;
      })
      .addCase(searchPatient.fulfilled, (state, action) => {
        state.IsSearch = false;
        state.patients = action.payload;
      })
      .addCase(searchPatient.rejected, (state, action) => {
        state.IsSearch = false;
      })
      .addCase(fetchPatientMetrics.pending, (state) => {
        state.isPatientMetrics = true;
      })
      .addCase(fetchPatientMetrics.fulfilled, (state, action) => {
        state.isPatientMetrics = false;
        state.patientAssessmentList = action.payload.filter((metric) => metric.ScaleMetric === "Assessment");
        state.patientScreeningList = action.payload.filter((metric) => metric.ScaleMetric === "Screening");
        state.TableSearchDataScreening = action.payload.filter((metric) => metric.ScaleMetric === "Screening");

      })
      .addCase(fetchPatientMetrics.rejected, (state) => {
        state.isPatientMetrics = false;
      })
      .addCase(fetchMetricResponseDetails.pending, (state, action) => {
        state.isLoading = true;
      })

      .addCase(fetchMetricResponseDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.metricDetails = action.payload;
      })

      .addCase(fetchMetricResponseDetails.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(createPatientMetrics.pending, (state, action) => {
        state.isLoading = true;
      })

      .addCase(createPatientMetrics.fulfilled, (state, action) => {
        state.isLoading = false;
      })

      .addCase(createPatientMetrics.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(fetchScreeningMetricResponseList.pending, (state, action) => {
        state.isLoading = true;
      })

      .addCase(fetchScreeningMetricResponseList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.responseList = action.payload;
      })

      .addCase(fetchScreeningMetricResponseList.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(patientStartSession.pending, (state, action) => {
        state.isLoading = true;
      })

      .addCase(patientStartSession.fulfilled, (state, action) => {
        state.isLoading = false;
      })

      .addCase(patientStartSession.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(fetchAssessmentMetricResponseList.pending, (state, action) => {
        state.isLoading = true;
      })

      .addCase(fetchAssessmentMetricResponseList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.responseList = action.payload;
      })

      .addCase(fetchAssessmentMetricResponseList.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(fetchPatientPlanList.pending, (state, action) => {
        state.isPlanLoading = true;
      })

      .addCase(fetchPatientPlanList.fulfilled, (state, action) => {
        state.isPlanLoading = false;
        state.patientPlanList = action.payload;
      })

      .addCase(fetchPatientPlanList.rejected, (state, action) => {
        state.isPlanLoading = false;
      })
      .addCase(fetchPatientPlanGoalList.pending, (state, action) => {
        state.isPlanLoading = true;
      })

      .addCase(fetchPatientPlanGoalList.fulfilled, (state, action) => {
        state.isPlanLoading = false;
        state.planGoals = action.payload;
      })

      .addCase(fetchPatientPlanGoalList.rejected, (state, action) => {
        state.isPlanLoading = false;
      })
      .addCase(fetchPatientIssuesList.pending, (state) => {
        state.isIssuesLoading = true;
      })
      .addCase(fetchPatientIssuesList.fulfilled, (state, action) => {
        state.isIssuesLoading = false;
        state.patientIssuesList = action.payload;
      })
      .addCase(fetchPatientIssuesList.rejected, (state) => {
        state.isIssuesLoading = false;
      })
      .addCase(ContentMappingList.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(ContentMappingList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.CondentMapping = action.payload;
      })
  },
});

export const {resetPlanState, resetBDData, tableSearchScreening, tableSearch, ScaleIdList, mandList, BehaviourList, setCustomActiveTab, setGoals, currentHomeSessionID, setHomeSessionEdit, setEdit, setPatientEdit, setCurrentPatientId, setResponseData, setCurrentCommentId, setPatientFilterData, setSelectedPlan } = patientSlice.actions;
export const selectPatientList = (state) => state.patient.patients;
export const PatientDetailsLoading = (state) => state.patient.isPatientDetails;
export const selectPatientDetails = (state) => state.patient.selectedPatient;
export const patientIsLoading = (state) => state.patient.isLoading;
export const selectpatientIsEdit = (state) => state.patient.patientIsEdit;
export const selectCurrentPatientId = (state) => state.patient.currentPatientId;
export const SelectSearchPatientLoading = (state) => state.patient.IsSearch;
export const SelectPatientMetricLoading = (state) => state.patient.isPatientMetrics;
export const SelectPatientScreeningList = (state) => state.patient.patientScreeningList;
export const SelectPatientAssessmentList = (state) => state.patient.patientAssessmentList;
export const selectResponseData = (state) => state.patient.responseData;
export const selectListComment = (state) => state.patient.ListComment;
export const selectResponseList = (state) => state.patient.responseList;
export const selectMetricDetails = (state) => state.patient.metricDetails;
export const IsLOadingButton = (state) => state.patient.isLoadingButton;
export const selectCurrentCommentId = (state) => state.patient.currentCommentId;
export const selectEditConfirm = (state) => state.patient.editConfirm;
export const UpdateLOadingButton = (state) => state.patient.UpdateLoadingButton;
export const UpdatePatientCheck = (state) => state.patient.CompleteCheck;
export const GoalsData = (state) => state.patient.Goals;
export const selectPlanList = (state) => state.patient.patientPlanList;
export const selectPlanGoals = (state) => state.patient.planGoals;
export const selectIsPlanLoading = (state) => state.patient.isPlanLoading;
export const selectIssuesLoading = (state) => state.patient.isIssuesLoading;
export const selectPatientIssuesList = (state) => state.patient.patientIssuesList;
export const selectPatientFilterData = (state) => state.patient.patientFilterData;
export const selectContentMapping = (state) => state.patient.CondentMapping;
export const selectSessionList = (state) => state.patient.SessionListData;
export const selectHomeSessionList = (state) => state.patient.homeSessionList;
export const selectHomeSessionEdit = (state) => state.patient.HomeSessionEdit;
export const patientID = (state) => state.patient.HomeSessionID;
export const ActiveTabSlice = (state) => state.patient.Tab;
export const DetailsSessionListData = (state) => state.patient.DetailsSessionList;
export const TrailData = (state) => state.patient.Trail;
export const PatientBehaviorListData = (state) => state.patient.BehaviorListData;
export const patientHlist = (state) => state.patient.hList;
export const patientmlist = (state) => state.patient.mList;
export const selectSelectedPlan = (state) => state.patient.selectedPlan;
export const probeDataListSlice = (state) => state.patient.probeData;
export const SessionDataListSlice = (state) => state.patient.SessionDataInt;
export const BehaviorListDataListSlice = (state) => state.patient.BehaviorListDataList;
export const SessionBehaviorListDataSlice = (state) => state.patient.SessionBehaviorListData;
export const MandListDataListSlice = (state) => state.patient.MandListData;
export const SessionMandListDataSlice = (state) => state.patient.SessionMandListData;
export const CurrentScaleIdSlice = (state) => state.patient.CurrentScaleID;
export const tableSearchDataSlice = (state) => state.patient.TableSearchData;
export const tableSearchDataScreeningSlice = (state) => state.patient.TableSearchDataScreening;
