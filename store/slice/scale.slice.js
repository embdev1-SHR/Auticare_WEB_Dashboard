import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setModalOpen } from "./layout.slice";
import {
  fetchAllScaleService,
  createScaleServices,
  fetchAllCategoryByScaleIDService,
  fetchAllQuestionService,
  createCategoryService,
  createQuestionService,
  fetchAllAssessmentQuestionService,
  createAssessmentQuestionService,
  updateCategoryService,
  updateQuestionService,
  updateTaskService,
  ScaleSearchService,
  deleteScaleService,
  deleteScaleMetricService,
  CategorydeleteScaleService,
  ScaleDetailService,
  ScoreUpdateService,
  ScaleSkillService,
  ScaleUpdateService
} from "../../services/scale.services";
import { ToastNotification } from "../../components/shared/toast";
import Router from "next/router";


export const ScaleSearchScales = createAsyncThunk(
  "scale/ScaleSearchScales",
  async (data, thunkApi) => {
    try {
      const res = await ScaleSearchService(data);
      return res.data.results.data
        ;
    } catch (error) {
      const message = error.responce.data.message;
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const ScaleDetails = createAsyncThunk(
  "scale/ScaleDetails",
  async (data, thunkApi) => {
    try {
      const res = await ScaleDetailService(data);
      return res.data.results.data
        ;
    } catch (error) {
      const message = error.responce.data.message;
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const DeleteScale = createAsyncThunk(
  "scale/DeleteScale",
  async (data, thunkApi) => {
    try {
      const res = await deleteScaleService(data.scaleID);
      await thunkApi.dispatch(fetchAllScales());
      await data.setAlert(false);
      ToastNotification("success", "Deleted Successfully");
      return res.data.results.message;
    } catch (error) {
      ToastNotification("error", "Failed to Delete");
      return error;
    }
  }
);


export const CategoryDeleteScale = createAsyncThunk(
  "scale/CategoryDeleteScale",
  async (data, thunkApi) => {
    try {
      const res = await CategorydeleteScaleService(data.id);
      thunkApi.dispatch(fetchAllCategoryScaleID(data.ScaleID));
      ToastNotification("success", "Deleted Successfully");
      return res.data.results.message;
    } catch (error) {
      ToastNotification("error", "Failed to Delete");
      return error;
    }
  }
);


export const ScoreScaleUpdate = createAsyncThunk(
  "scale/ScoreScaleUpdate",
  async (data, thunkApi) => {
    try {
      const res = await ScoreUpdateService(data);
      ToastNotification("success", "Update Successfully");
      data.setModel(false)
      return res.data.results.data;
    } catch (error) {
      ToastNotification("error", "update Failed");
      return error;
    }
  }
);


export const fetchAllScales = createAsyncThunk(
  "scale/fetchAllScales",
  async (thunkApi) => {
    console.log("triggeeeeeeeeerrrrrrrrr --------------->>>>>>");
    try {
      const { data } = await fetchAllScaleService();
      console.log("data", data);
      return data.results.data;
    } catch (error) {
      const message = error.responce.data.message;
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const createScale = createAsyncThunk(
  "scale/createScale",
  async (data, thunkApi) => {
    try {
      const res = await createScaleServices(data);
      thunkApi.dispatch(setModalOpen(false));
      thunkApi.dispatch(fetchAllScales());
      Router.push(
        `scales/${res.data.results.insertId
        }/${data.ScaleMetric.toLowerCase()}/${data.ScaleMetricType.toLowerCase()}`
      );
      ToastNotification("success", "Added Successfully");
      return res.data.results.message;
    } catch (error) {
      const message = error.responce.data.message;
      ToastNotification("error", message);
      // console.log("error from scale",error);
      // ToastNotification("error", "Failed to add scale");
      return error;
    }
  }
);

export const fetchAllCategoryScaleID = createAsyncThunk(
  "scale/fetchAllCategoryScaleID",
  async (ScaleID, thunkApi) => {
    try {
      const res = await fetchAllCategoryByScaleIDService(ScaleID);
      return res.data.results.data;
    } catch (error) {
      const message = error.responce.data.message;
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const fetchAllQuestions = createAsyncThunk(
  "scale/fetchAllQuestions",
  async (data, thunkApi) => {
    try {
      const res = await fetchAllQuestionService(data);
      return res.data.results.data;
    } catch (error) {
      const message = error.responce.data.message;
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const fetchAllAssessmentQuestions = createAsyncThunk(
  "scale/fetchAllAssessmentQuestions",
  async (data, thunkApi) => {
    try {
      const res = await fetchAllAssessmentQuestionService(data);
      return res.data.results.data;
    } catch (error) {
      const message = error.responce.data.message;
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const createCategory = createAsyncThunk(
  "scale/createCategory",
  async (data, thunkApi) => {
    try {
      const res = await createCategoryService(data);
      ToastNotification("success", "Added Successfully");
      thunkApi.dispatch(fetchAllCategoryScaleID(data.ScaleID));
      return res.data.results.message;
    } catch (error) {
      ToastNotification("error", "Failed to add category");
      console.log("failed add");
      return error;
    }
  }
);

export const createQuestion = createAsyncThunk(
  "scale/createQuestion",
  async (data, thunkApi) => {
    try {
      const res = await createQuestionService(data);
      ToastNotification("success", "Added Successfully");
      thunkApi.dispatch(fetchAllQuestions(data.ScaleID));
      thunkApi.dispatch(setModalOpen(false));

      return res.data.results.message;
    } catch (error) {
      ToastNotification("error", "Failed to add questions");
      console.log("failed add");
      return error;
    }
  }
);

export const createAssessmentQuestion = createAsyncThunk(
  "scale/createAssessmentQuestion",
  async (data, thunkApi) => {
    try {
      const res = await createAssessmentQuestionService(data);
      ToastNotification("success", "Added Successfully");
      await thunkApi.dispatch(fetchAllAssessmentQuestions(data.ScaleID));
      await thunkApi.dispatch(setModalOpen(false));
      return res.data.results.message;
    } catch (error) {
      ToastNotification("error", "Failed to add questions");
      return error;
    }
  }
);

export const updateCategory = createAsyncThunk(
  "scale/updateCategory",
  async (data, thunkApi) => {
    try {
      const res = await updateCategoryService(data.ID.categoryID, data.payload);
      ToastNotification("success", "Updated Successfully");
      thunkApi.dispatch(fetchAllCategoryScaleID(data.ID.scaleID));
      return res.data.results.message;
    } catch (error) {
      ToastNotification("error", "Failed to upadate category");
      return error;
    }
  }
);
export const updateQuestion = createAsyncThunk(
  "scale/updateQuestion",
  async (data, thunkApi) => {
    try {
      const updateData = thunkApi.getState().scale.updateData;
      const res = await updateQuestionService(updateData.ScaleID, updateData.MetricID, data);
      ToastNotification("success", "Updated Successfully");
      await thunkApi.dispatch(fetchAllQuestions(updateData.ScaleID));
      await thunkApi.dispatch(setUpdateData({}));
      await thunkApi.dispatch(setViewUpdateModal(false));
      return res.data.results.message;
    } catch (error) {
      ToastNotification("error", "Failed to add questions");
      return error;
    }
  }
);

export const updateTask = createAsyncThunk(
  "scale/updateTask",
  async (data, thunkApi) => {
    try {
      const updateData = thunkApi.getState().scale.updateData;
      const res = await updateTaskService(updateData.ScaleID || data.ScaleID, updateData.MetricID || data.MetricID, data);
      ToastNotification("success", "Updated Successfully");
      await thunkApi.dispatch(fetchAllAssessmentQuestions(data.ScaleID));
      await thunkApi.dispatch(setUpdateData({}));
      await thunkApi.dispatch(setViewUpdateModal(false));
      return res.data.results.message;
    } catch (error) {
      ToastNotification("error", "Failed to add questions");
      return error;
    }
  }
);

export const ScaleSkill = createAsyncThunk(
  "scale/ScaleSkill",
  async (data, thunkApi) => {
    try {
      const res = await ScaleSkillService(data);
      return res.data.results.data;
    } catch (error) {
      return error;
    }
  }
);

export const ScaleUpdate = createAsyncThunk(
  "scale/ScaleUpdate",
  async (data, thunkApi) => {
    try {
      const res = await ScaleUpdateService(data);
      ToastNotification("success", "Scale Updated Successfully");
      await thunkApi.dispatch(fetchAllScales());
      await thunkApi.dispatch(setModalOpen(false));
      return res.data.results.message;
    } catch (error) {
      ToastNotification("error", "Scale Update Failed ");
      return error;
    }
  }
);

export const DeleteMetric = createAsyncThunk(
  "scale/updateTask",
  async (data, thunkApi) => {
    try {
      const res = await deleteScaleMetricService(data);
      ToastNotification("success", "Deleted Successfully");
      await thunkApi.dispatch(fetchAllAssessmentQuestions(data.ScaleID));
      await thunkApi.dispatch(fetchAllQuestions(data.ScaleID));
      return res.data.results.message;
    } catch (error) {
      ToastNotification("error", "Deleted Failed ");
      return error;
    }
  }
);


const initialState = {
  scales: [],
  categoriesByScaleID: [],
  questions: [],
  isLoading: false,
  isScaleCreating: false,
  isCategoryCreating: false,
  isQuestionCreating: false,
  isQuestionCreated: false,
  viewUpdateModal: false,
  updateData: {},
  scalesSearch: [],
  scalesDetail: [],
  AssesQuestions: [],
  activeTab: [],
  Edit: false,
  Tab: false,
  Scale: [],
  skillData: []
};
export const scaleSlice = createSlice({
  name: "scale",
  initialState: initialState,
  reducers: {
    setViewUpdateModal: (state, action) => {
      return {
        ...state,
        viewUpdateModal: action.payload,
      };
    },
    setUpdateData: (state, action) => {
      return {
        ...state,
        updateData: action.payload,
      };
    },
    StateActiveTap: (state, action) => {
      return {
        ...state,
        activeTab: action.payload,
      };
    },
    isEditScale: (state, action) => {
      return {
        ...state,
        Edit: action.payload,
      };
    },
    currentScale: (state, action) => {
      return {
        ...state,
        Scale: action.payload,
      };
    },
    ActiveTab: (state, action) => {
      return {
        ...state,
        Tab: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllScales.pending, (state) => {
        state.isLoading = true;
        state.scales = []
      })
      .addCase(fetchAllScales.fulfilled, (state, action) => {
        state.isLoading = false;
        state.scales = action.payload;
      })
      .addCase(fetchAllScales.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(ScaleDetails.pending, (state) => {
      })
      .addCase(ScaleDetails.fulfilled, (state, action) => {
        state.scalesDetail = action.payload;
      })
      .addCase(ScaleDetails.rejected, (state) => {
      })
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(updateTask.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateQuestion.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateQuestion.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(updateQuestion.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(ScaleUpdate.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(ScaleUpdate.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(ScaleUpdate.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(ScaleSkill.pending, (state) => {
      })
      .addCase(ScaleSkill.fulfilled, (state, action) => {
        state.skillData = action.payload;
      })
      .addCase(ScaleSkill.rejected, (state) => {
      })
      .addCase(createScale.pending, (state) => {
        state.isScaleCreating = true;
      })
      .addCase(createScale.fulfilled, (state) => {
        state.isScaleCreating = false;
      })
      .addCase(createScale.rejected, (state) => {
        state.isScaleCreating = false;
      })
      .addCase(fetchAllCategoryScaleID.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllCategoryScaleID.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categoriesByScaleID = action.payload;
      })
      .addCase(fetchAllCategoryScaleID.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(ScaleSearchScales.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(ScaleSearchScales.fulfilled, (state, action) => {
        state.scales = action.payload;
        state.isLoading = false;
      })
      .addCase(ScaleSearchScales.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchAllQuestions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllQuestions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.questions = action.payload;
        state.AssesQuestions = action.payload;

      })
      .addCase(fetchAllQuestions.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(createCategory.pending, (state) => {
        state.isCategoryCreating = true;
      })
      .addCase(createCategory.fulfilled, (state) => {
        state.isCategoryCreating = false;
      })
      .addCase(createCategory.rejected, (state) => {
        state.isCategoryCreating = false;
      })
      .addCase(createQuestion.pending, (state) => {
        state.isLoading = true;
        state.isQuestionCreating = true;
      })
      .addCase(createQuestion.fulfilled, (state) => {
        state.isQuestionCreating = false;
        state.isLoading = false;
      })
      .addCase(createQuestion.rejected, (state) => {
        state.isQuestionCreating = false;
        state.isLoading = false;
      })
      .addCase(fetchAllAssessmentQuestions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllAssessmentQuestions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.questions = action.payload;
      })
      .addCase(fetchAllAssessmentQuestions.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(createAssessmentQuestion.pending, (state) => {
        state.isLoading = true;
        state.isQuestionCreating = true;
        state.isQuestionCreated = false;
      })
      .addCase(createAssessmentQuestion.fulfilled, (state) => {
        state.isLoading = false;
        state.isQuestionCreating = false;
        state.isQuestionCreated = true;
      })
      .addCase(createAssessmentQuestion.rejected, (state) => {
        state.isLoading = false;
        state.isQuestionCreating = false;
        state.isQuestionCreated = false;
      })
  },
});
export const { setViewUpdateModal, setUpdateData, StateActiveTap, isEditScale, currentScale, ActiveTab } = scaleSlice.actions;
export const selectScaleList = (state) => state.scale.scales;
export const selectByScaleIDCategory = (state) => state.scale.categoriesByScaleID;
export const selectQuestion = (state) => state.scale.questions;
export const selectAssesQuestion = (state) => state.scale.AssesQuestions;
export const selectScaleIsLoading = (state) => state.scale.isLoading;
export const selectIsQuestionCreated = (state) => state.scale.isQuestionCreated;
export const selectViewModal = (state) => state.scale.viewUpdateModal;
export const selectUpdateData = (state) => state.scale.updateData;
export const selectScaleDetail = (state) => state.scale.scalesDetail;
export const selectActiveTab = (state) => state.scale.activeTab;
export const selectScaleEdit = (state) => state.scale.Edit;
export const selectCurrentScaleId = (state) => state.scale.Scale;
export const selectScaleData = (state) => state.scale.skillData;
export const selectScaleCreating = (state) => state.scale.isScaleCreating;
export const selectActiveTabQuestion = (state) => state.scale.Tab;