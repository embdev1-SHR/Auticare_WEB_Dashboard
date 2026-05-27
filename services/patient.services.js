import Axios, { AxiosBlob } from "../util/api.util";

export const fetchAllPatientsService = async () => {
  const result = await Axios.get(`/api/v1/patients`);
  return result;
};

export const createPatientService = async (data) => {
  const result = await Axios.post(`/api/v1/patients`, data);
  return result;
};
export const updatePatientService = async ({ ...data }) => {
  const result = await Axios.put(`/api/v1/patients/${data.PatientID}`, data);
  return result;
};
export const deletePatientService = async (PatientID) => {
  const result = await Axios.delete(`/api/v1/patients/${PatientID}`);
  return result;
};
export const patientDetailsService = async (PatientID) => {
  const result = await Axios.get(`/api/v1/patients/${PatientID}`);
  return result;
};
export const searchPatientService = async (PatientName) => {
  console.log("*** from service",PatientName);

  const result = await Axios.post(`/api/v1/patients/search`, PatientName.PatientName);
  return result;
};
export const patientMetricsService = async (PatientID) => {
  const result = await Axios.get(`/api/v1/patients/${PatientID}/metrics`);
  return result;
};
export const patientMetricsCreateService = async (PatientID, payload) => {
  const result = await Axios.post(`/api/v1/patients/${PatientID}/metrics`, payload);
  return result;
};
export const patientScreeningMetricResponseService = async (PatientID, MetricID, payload) => {
  const result = await Axios.post(`/api/v1/patients/${PatientID}/metrics/${MetricID}/screening`, payload);
  return result;
};
export const patientAssessmentMetricResponseService = async (PatientID, MetricID, payload) => {
  const result = await Axios.post(`/api/v1/patients/${PatientID}/metrics/${MetricID}/assessment`, payload);
  return result;
};
export const fetchMetricResponseDetailsService = async (PatientID, MetricID) => {
  const result = await Axios.get(`/api/v1/patients/${PatientID}/metrics/${MetricID}`);
  return result;
};
export const fetchScreeningMetricResponseListService = async (PatientID, MetricID) => {
  const result = await Axios.get(`/api/v1/patients/${PatientID}/metrics/${MetricID}/screening`);
  return result;
};
export const fetchAssessmentMetricResponseListService = async (PatientID, MetricID) => {
  const result = await Axios.get(`/api/v1/patients/${PatientID}/metrics/${MetricID}/assessment`);
  return result;
};
export const patientAddCommentService = async (payload) => {
  const result = await Axios.post(`/api/v1/patients/comments`, payload);
  return result;
};

export const patientListCommentService = async (PatientID) => {
  const result = await Axios.get(`/api/v1/patients/comments/${PatientID}`);
  return result;
};
export const updatePatientCommentService = async (CommentID, payload) => {
  const result = await Axios.put(`/api/v1/patients/comments/${CommentID}`, payload);
  return result;
};
export const deletePatientCommentService = async (CommentID) => {
  const result = await Axios.delete(`/api/v1/patients/comments/${CommentID}`);
  return result;
};
export const patientCompleteCheckService = async (payload) => {
  const result = await Axios.get(`/api/v1/patients/${payload.PatientId}/metrics/${payload.PatientMetricID}`);
  return result;
};
export const patientPlanCreateService = async (PatientID, payload) => {
  const result = await Axios.post(`/api/v1/patients/${PatientID}/plans`, payload);
  return result;
};
export const patientPlanListService = async (PatientID) => {
  const result = await Axios.get(`/api/v1/patients/${PatientID}/plans`);
  return result;
};
export const patientPlanGoalListService = async (PatientID, PlanID) => {
  const result = await Axios.get(`/api/v1/patients/${PatientID}/plans/${PlanID}/goals`);
  return result;
};
export const updatePatientPlanGoalService = async (PlanGoalID, payload) => {
  const result = await Axios.put(`/api/v1/patients/plans/goals/${PlanGoalID}`, payload);
  return result;
};
export const updatePatientPlanService = async (PatientID, PlanID, payload) => {
  const result = await Axios.put(`/api/v1/patients/${PatientID}/plans/${PlanID}`, payload);
  return result;
};
export const deletePatientPlanGoalService = async (PlanGoalID) => {
  const result = await Axios.delete(`/api/v1/patients/plans/goals/${PlanGoalID}`);
  return result;
};
export const patientIssuesListService = async (PatientID) => {
  const result = await Axios.get(`/api/v1/patients/issues/${PatientID}`);
  console.log("result *** issue **** ", result);
  return result;
};
export const updatePatientAssessment = async (data) => {
  const result = await Axios.put(`/api/v1/patients/${data.PatientID}/metrics/${data.PatientMetricID}`, data.data);
  return result;
};
export const MappingContentsListService = async () => {
  const result = await Axios.get(`/api/v1/contents`);
  return result;
};
export const createPatientSessionService = async (data) => {
  const result = await Axios.post(`/api/v1/patients/${data.PatientId}/sessions`, data.data);
  return result;
};
export const patientSessionListService = async (PatientID) => {
  const result = await Axios.get(`/api/v1/patients/${PatientID}/sessions`);
  return result;
};
export const HomeSessionCreationService = async (data) => {
  const result = await Axios.post(`/api/v1/homeSessions`, data);
  return result;
};
export const HomeSessionListService = async (PatientID) => {
  const result = await Axios.get(`/api/v1/homeSessions/${PatientID}`);
  return result;
};
export const MarkAsReadService = async (data) => {
  const result = await Axios.put(`/api/v1/homeSessions/${data}/read`,);
  return result;
};
export const homeSessionUpdateService = async (data) => {
  const result = await Axios.put(`/api/v1/homeSessions/${data.HomeSessionID.HomeSessionID || data.HomeSessionID}`, data.data);
  return result;
};
export const patientStartSessionService = async (payload) => {
  const result = await Axios.get(`/api/v1/patients/${payload.PatientId}/sessions/trials/${payload.SessionID}`);
  return result;
};
export const DetailsSessionService = async (payload) => {
  const result = await Axios.get(`/api/v1/patients/${payload.PatientId}/sessions/${payload.SessionID}`,);
  return result;
};
export const SessionTrailFinishService = async (data) => {
  const result = await Axios.post(`/api/v1/patients/${data.PatientId}/sessions/${data.SessionID}/trials/${data.SessionTrialID}`, data.data);
  return result;
};
export const TrailDetailsService = async (payload) => {
  const result = await Axios.get(`/api/v1/patients/sessions/trials/${payload}`,);
  return result;
};
export const BehaviorListService = async (payload) => {
  const result = await Axios.get(`/api/v1/patients/sessions/trials/${payload}/behaviours`,);
  return result;
};

export const SessionBehaviorListService = async (payload) => {
  const result = await Axios.get(`/api/v1/patients/sessions/${payload}/behaviours`);
  return result;
};

export const MandListService = async (payload) => {
  const result = await Axios.get(`/api/v1/patients/sessions/trials/${payload}/mands`,);
  return result;
};

export const SessionMandListService = async (payload) => {
  const result = await Axios.get(`/api/v1/patients/sessions/${payload}/mands`,);
  return result;
};

export const TrailsListService = async (payload) => {
  const result = await Axios.get(`/api/v1/patients/${payload.PatientId}/sessions/${payload.SessionID}/trials`,);
  return result;
};

export const UnfinishedTrailsService = async (payload) => {
  const result = await Axios.get(`/api/v1/patients/${payload.PatientId}/sessions/${payload.SessionID}/trials/unfinished`,);
  return result;
};

export const probeDataCreationService = async (data) => {
  const result = await Axios.post(`/api/v1/probdatas`, data);
  return result;
};
export const probDataListService = async (payload) => {
  const result = await Axios.get(`/api/v1/probdatas/patients/${payload}`,);
  return result;
};

export const patientSessionDataListService = async (payload) => {
  const result = await Axios.get(`/api/v1/patients/${payload.PatientId}/sessions/${payload.SessionID}/trials`,);
  return result;
};
export const probDataMarkAsReadService = async (data) => {
  const result = await Axios.put(`/api/v1/probdatas/${data.ProbDataID}`, data);
  return result;
};
export const patientSessionUpdateService = async (data) => {
  const result = await Axios.put(`/api/v1/patients/sessions/${data.SessionID}`, data);
  return result;
};

export const patientAssessmentMetricReportService = async (payload) => {
  const result = await AxiosBlob.get(`/api/v1/others/${payload.PatientID}/scales/${payload.ScaleID}/metrics/${payload.PatientMetricID}/assessment`,);
  return result;
};

export const patientScreeningReportService = async (payload) => {
  const result = await AxiosBlob.get(`/api/v1/others/${payload.PatientID}/scales/${payload.ScaleID}/metrics/${payload.PatientMetricID}/screening`,);
  return result;
};


export const patientSessionReportService = async (payload) => {
  const result = await AxiosBlob.get(`/api/v1/others/${payload.PatientID}/session/${payload.SessionID}/report`,);
  return result;
};


export const patientVrSessionCreateService = async (payload) => {
  const result = await Axios.get(`/api/v1/patients/${payload.PatientId}/sessions/${payload.SessionID}/vr/${payload.ScenarioName}`,);
  return result;
};

