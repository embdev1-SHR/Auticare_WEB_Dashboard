import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createContentService,
  deleteContentService,
  updateContentService,
  contentDetailsService,
  searchContentService,
  fetchAllContentsService,
  contentTherapiesList,
  MappingContentsService,
  tutorialLinkService,
  GetTutorialLinkService,
  deleteLinkUrlService,
  createContentMediaDataService,
  GetContentMediaDataService,
  UpdateContentMediaDataService,
} from "../../services/content.services";

import { setModalOpen } from "./layout.slice";

import { ToastNotification } from "../../components/shared/toast";
//import log from "video.js/dist/types/utils/log";

export const GetTutorialLink = createAsyncThunk("content/GetTutorialLink", async (ContentID) => {
  try {
    const res = await GetTutorialLinkService(ContentID);
    return res.data.results.data;
  } catch (error) {
    console.error(error);
    return error;
  }
});

export const tutorialLinkDelete = createAsyncThunk("content/tutorialLink", async (data, thunkApi) => {
  console.log("data",data);
  try {
    const res = await deleteLinkUrlService(data.key);
    ToastNotification("success", "Content tutorial links Deleted successfully");
    thunkApi.dispatch(GetTutorialLink(data.ContentID));
    return res.data.results.message;
  } catch (error) {
    ToastNotification("error", "Content tutorial links Deleted Failed");
    console.error(error);
    return error;
  }
});
export const tutorialLink = createAsyncThunk("content/tutorialLink", async (data, thunkApi) => {
  try {
    const res = await tutorialLinkService(data.ContentID, data.TutorialLinks);
    ToastNotification("success", "Content tutorial links added successfully");
    thunkApi.dispatch(GetTutorialLink(data.ContentID));
    return res.data.results.message;
  } catch (error) {
    ToastNotification("error", "Content tutorial links added Failed");
    console.error(error);
    return error;
  }
});
export const fetchAllContents = createAsyncThunk("content/fetchAllContents", async (thunkApi) => {
  try {
    const { data } = await fetchAllContentsService();
    return data.results.data;
  } catch (error) {
    const message = error.responce.data.message;
    return thunkApi.rejectWithMessage(message);
  }
});
export const createContent = createAsyncThunk("content/createContent", async (data, thunkApi) => {
  try {
    const res = await createContentService(data);
    ToastNotification("success", "Added Content Successfully");
    await thunkApi.dispatch(setModalOpen(false));
    await thunkApi.dispatch(fetchAllContents());
    await thunkApi.dispatch(ContentMappingList());
    return res.data.results.message;
  } catch (error) {
    ToastNotification("error", "Failed to add content");
    console.error(error);
    return error;
  }
});
export const updateContent = createAsyncThunk("content/updateContent", async (data, thunkApi) => {
  try {
    const res = await updateContentService(data);
    ToastNotification("success", res.data.results.message);
    await thunkApi.dispatch(SelectContent(data.ContentID));
    await thunkApi.dispatch(ContentMappingList());
    return res.data.results.message;
  } catch (error) {
    ToastNotification("error", "Update failed");
    console.error(error);
    return error.message;
  }
});

export const deleteContent = createAsyncThunk("content/deleteContent", async (data, thunkApi) => {
  try {
    const res = await deleteContentService(data);

    ToastNotification("success", "Deleted!", res.data.results.message);
    thunkApi.dispatch(fetchAllContents());
    return res.data.results.message;
  } catch (error) {
    ToastNotification("error", "Delete failed");
    console.error(error);
    return error.message;
  }
});
export const SelectContent = createAsyncThunk("content/SelectContent", async (id, thunkApi) => {
  const res = await contentDetailsService(id);
  return res.data.results.data[0];
});
export const TherapiesList = createAsyncThunk("content/SelectContent", async () => {
  try {
    const res = await contentTherapiesList();
    return res;
  } catch (error) {
    ToastNotification("error", " failed");
    console.error(error);
    return error.message;
  }
});

export const ContentMappingList = createAsyncThunk("content/ContentMappingList", async () => {
  try {
    const res = await MappingContentsService();
    return res.data.results.data;
  } catch (error) {
    ToastNotification("error", " failed");
    console.error(error);
    return error.message;
  }
});

export const searchContent = createAsyncThunk("content/searchContent", async (ContentName, thunkApi) => {
  try {
    const res = await searchContentService(ContentName);
    return res.data.results.data;
  } catch (error) {
    const message = error.responce.data.message;
    return thunkApi.rejectWithMessage(message);
  }
});

export const createContentMediaData = createAsyncThunk("content/createContentMediaData", async (values, thunkApi) => {
  try {
    const res = await createContentMediaDataService(values.ContentID, values.data);
    ToastNotification("success", "Creation Successful!", res.data.results.message);
    await thunkApi.dispatch(GetContentMediaData(values.ContentID));
    return res.data.results.message;
  } catch (error) {
    ToastNotification("error", "Creation failed");
    console.error(error);
    return error.message;
  }
});

export const GetContentMediaData = createAsyncThunk("content/GetContentMediaData", async (ContentID) => {

  try {
    const res = await GetContentMediaDataService(ContentID);
    return res.data.results.data;
  } catch (error) {
    console.error(error);
    return error;
  }
});

export const UpdateContentMediaData = createAsyncThunk("content/UpdateContentMediaData", async (values, thunkApi) => {
  try {
    const res = await UpdateContentMediaDataService(values.MediaID, values.data);
    ToastNotification("success", "Updation Successful!", res.data.results.message);
    await thunkApi.dispatch(GetContentMediaData(values.ContentID));
    return res.data.results.message;
  } catch (error) {
    ToastNotification("error", "Updation failed");
    console.error(error);
    return error.message;
  }
});

const initialState = {
  CondentMapping: [],
  contents: [],
  UrlList: [],
  selectedContent: null,
  isLoading: false,
  contentIsEdit: typeof window !== "undefined" && sessionStorage.getItem("contentIsEdit") ? JSON.parse(sessionStorage.getItem("contentIsEdit")) : false,
  currentContentId: null,
  IsSearch: false,
  isContentCreating: false,
  isContentUpdating: false,
  isContentDetails: false,
  contentFilterData: {},
  isPostContentMediaLoading: false,
  isContentMediaLoading: false,
  contentMediaList: [],
};
export const contentSlice = createSlice({
  name: "content",
  initialState: initialState,
  reducers: {
    setContentEdit: (state, action) => {
      typeof window && sessionStorage.setItem("contentIsEdit", action.payload);
      return {
        ...state,
        contentIsEdit: action.payload,
      };
    },
    setCurrentContentId: (state, action) => {
      return {
        ...state,
        currentContentId: action.payload,
      };
    },
    setContentFilterData: (state, action) => {
      return {
        ...state,
        contentFilterData: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllContents.pending, (state, action) => {
        state.isLoading = true;
      })

      .addCase(fetchAllContents.fulfilled, (state, action) => {
        state.isLoading = false;

        state.contents = action.payload;
      })
      .addCase(tutorialLink.pending, (state, action) => {
        state.isLoading = true;
      })

      .addCase(tutorialLink.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(createContent.pending, (state, action) => {
        state.isLoading = true;
        state.isContentCreating = true;
      })
      .addCase(createContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isContentCreating = false;
      })
      .addCase(createContent.rejected, (state, action) => {
        state.isLoading = false;
        state.isContentCreating = false;
      })
      .addCase(SelectContent.pending, (state, action) => {
        state.isContentDetails = true;
      })
      .addCase(SelectContent.fulfilled, (state, action) => {
        state.isContentDetails = false;
        state.selectedContent = action.payload;
      })
      .addCase(SelectContent.rejected, (state, action) => {
        state.isContentDetails = false;
      })
      .addCase(updateContent.pending, (state, action) => {
        state.isLoading = true;
        state.isContentUpdating = true;
      })
      .addCase(updateContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isContentUpdating = false;
      })
      .addCase(updateContent.rejected, (state, action) => {
        state.isLoading = false;
        state.isContentUpdating = false;
      })
      // .addCase(tutorialLinkDelete.pending, (state, action) => {
      //   state.isLoading = true;
      // })
      // .addCase(tutorialLinkDelete.fulfilled, (state, action) => {
      //   state.isLoading = false;
      // })
      // .addCase(tutorialLinkDelete.rejected, (state, action) => {
      //   state.isLoading = false;
      // })
      .addCase(deleteContent.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(deleteContent.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(deleteContent.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(GetTutorialLink.fulfilled, (state, action) => {
        state.UrlList = action.payload;
      })

      .addCase(searchContent.pending, (state, action) => {
        state.IsSearch = true;
      })
      .addCase(searchContent.fulfilled, (state, action) => {
        state.IsSearch = false;
        state.contents = action.payload;
      })
      .addCase(searchContent.rejected, (state, action) => {
        state.IsSearch = false;
      })
      .addCase(ContentMappingList.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(ContentMappingList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.CondentMapping = action.payload;
      })

      .addCase(createContentMediaData.pending, (state) => {
        state.isPostContentMediaLoading = true;
      })
      .addCase(createContentMediaData.fulfilled, (state, action) => {
        state.isPostContentMediaLoading = false;
      })
      .addCase(createContentMediaData.rejected, (state) => {
        state.isPostContentMediaLoading = false;
      })

      .addCase(GetContentMediaData.pending, (state) => {
        state.isContentMediaLoading = true;
      })
      .addCase(GetContentMediaData.fulfilled, (state, action) => {
        state.isContentMediaLoading = false;
        state.contentMediaList = action.payload;
      })
      .addCase(GetContentMediaData.rejected, (state) => {
        state.isContentMediaLoading = false;
      })

      .addCase(UpdateContentMediaData.pending, (state) => {
        state.isPostContentMediaLoading = true;
      })
      .addCase(UpdateContentMediaData.fulfilled, (state, action) => {
        state.isPostContentMediaLoading = false;
      })
      .addCase(UpdateContentMediaData.rejected, (state) => {
        state.isPostContentMediaLoading = false;
      });
  },
});
export const { setCurrentContentId, setContentEdit, setContentFilterData } = contentSlice.actions;
export const selectUrlList = (state) => state.content.UrlList;
export const selectContentList = (state) => state.content.contents;
export const contentDetailsLoading = (state) => state.content.isContentDetails;
export const ContentDetails = (state) => state.content.selectedContent;
export const contentIsLoading = (state) => state.content.isLoading;
export const SelectSearchContentLoading = (state) => state.content.IsSearch;
export const selectCurrentContentId = (state) => state.content.currentContentId;
export const selectContentIsEdit = (state) => state.content.contentIsEdit;
export const selectContentMapping = (state) => state.content.CondentMapping;
export const selectContentFilterData = (state) => state.content.contentFilterData;

export const selectIsPostContentMediaLoading = (state) => state.content.isPostContentMediaLoading;

export const selectIsContentMediaLoading = (state) => state.content.isContentMediaLoading;
export const selectContentMediaList = (state) => state.content.contentMediaList;
