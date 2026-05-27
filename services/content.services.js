import Axios from "../util/api.util";

export const fetchAllContentsService = async () => {
  const result = await Axios.get(`/api/v1/contents`);
  return result;
};

export const createContentService = async (data) => {
  const result = await Axios.post(`/api/v1/contents`, data);
  return result;
};
export const updateContentService = async ({ ...data }) => {
  const result = await Axios.put(`/api/v1/contents/${data.ContentID}`, data);
  return result;
};
export const deleteContentService = async (ContentID) => {
  const result = await Axios.delete(`/api/v1/contents/${ContentID}`);
  return result;
};
export const contentDetailsService = async (ContentID) => {
  const result = await Axios.get(`/api/v1/contents/${ContentID}`);
  return result;
};
export const searchContentService = async (ContentName) => {
  const result = await Axios.post(`/api/v1/contents/search`, ContentName);
  return result;
};
export const contentTherapiesList = async () => {
  const result = await Axios.get(`/api/v1/therapies`);
  return result;
};

export const MappingContentsService = async () => {
  const result = await Axios.get(`/api/v1/contents/mappings`);
  return result;
};

export const tutorialLinkService = async (ContentID, data) => {
  const result = await Axios.post(`/api/v1/contents/${ContentID}/tutorial-links`, data);
  return result;
};

export const GetTutorialLinkService = async (ContentID) => {
  const result = await Axios.get(`/api/v1/contents/${ContentID}/tutorial-links`);
  return result;
};
export const deleteLinkUrlService = async (TutorialLinkID) => {
  const result = await Axios.delete(`/api/v1/contents/tutorial-links/${TutorialLinkID}`);
  return result;
};
export const createContentMediaDataService = async (ContentID, data) => {
  const result = await Axios.post(`/api/v1/contents/${ContentID}/medias`, data);
  return result;
};

export const GetContentMediaDataService = async (ContentID) => {
  const result = await Axios.get(`/api/v1/contents/${ContentID}/medias`);

  return result;
};

export const UpdateContentMediaDataService = async (MediaID, data) => {
  const result = await Axios.put(`/api/v1/contents/medias/${MediaID}`, data);
  return result;
};
