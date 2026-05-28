import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setModalOpen } from "./layout.slice";
import { fetchAllSkillsService, createSkillService, deleteSkillService, updateSkillService, skillDetailsService, searchSkillService, skillMappingService } from "../../services/skill.services";
import { ToastNotification } from "../../components/shared/toast";

export const fetchAllSkills = createAsyncThunk("skill/fetchAllSkills", async (args, thunkApi) => {
  try {
    const { data } = await fetchAllSkillsService();
    return data.results.data;
  } catch (error) {
    const message = error.responce.data.message;
    return thunkApi.rejectWithValue(message);
  }
});
export const createSkill = createAsyncThunk("skill/createSkill", async (data, thunkApi) => {
  try {
    const res = await createSkillService(data);
    ToastNotification("success", "Added Successfully");
    thunkApi.dispatch(setModalOpen(false));
    thunkApi.dispatch(fetchAllSkills());
    thunkApi.dispatch(fetchSkillMappings());
    return res.data.results.message;
  } catch (error) {
    ToastNotification("error", "Failed to add skill");
    return error;
  }
});
export const updateSkill = createAsyncThunk("skill/updateSkill", async (data, thunkApi) => {
  try {
    const res = await updateSkillService(data);
    ToastNotification("success", res.data.results.message);
    thunkApi.dispatch(setModalOpen(false));
    thunkApi.dispatch(fetchAllSkills());
    thunkApi.dispatch(fetchSkillMappings());
    thunkApi.dispatch(skillIsEditForm(false));
    return res.data.results.message;
  } catch (error) {
    ToastNotification("error", "failed");
    return error;
  }
});

export const deleteSkill = createAsyncThunk("skill/deleteSkill", async (SkillID, thunkApi) => {
  try {
    const res = await deleteSkillService(SkillID);
    ToastNotification("success", "Deleted!", res.data.results.message);
    thunkApi.dispatch(fetchAllSkills());
    return res.data.results.message;
  } catch (error) {
    ToastNotification("error", "Delete failed");
  }
});
export const SelectSkill = createAsyncThunk("skill/SelectSkill", async (id) => {
  const res = await skillDetailsService(id);
  return res.data.results.data[0];
});
export const searchSkill = createAsyncThunk("skill/searchSkill", async (SkillName, thunkApi) => {
  try {
    const res = await searchSkillService(SkillName);
    return res.data.results.data;
  } catch (error) {
    const message = error.responce.data.message;
    return thunkApi.rejectWithValue(message);
  }
});

export const fetchSkillMappings = createAsyncThunk("skill/fetchSkillMappings", async (thunkApi) => {
  try {
    const { data } = await skillMappingService();
    return data.results.data;
  } catch (error) {
    const message = error.responce.data.message;
    return thunkApi.rejectWithValue(message);
  }
});
const initialState = {
  skills: [],
  skillMappings: [],
  selectedSkill: {},
  isLoading: false,
  isEdit: false,
  currentSkillId: null,
  IsSearch: false,
  isSkillCreating: false,
  isSkillUpdating: false,
  skillMappingByID: []
};
export const skillSlice = createSlice({
  name: "skill",
  initialState: initialState,
  reducers: {
    skillIsEditForm: (state, action) => {
      return {
        ...state,
        isEdit: action.payload,
      };
    },
    setCurrentSkillId: (state, action) => {
      return {
        ...state,
        currentSkillId: action.payload,
      };
    },
    setSkillMappingByID: (state, action) => {
      return {
        ...state,
        skillMappingByID: action.payload,
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSkills.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllSkills.fulfilled, (state, action) => {
        state.isLoading = false;
        state.skills = action.payload;
      })
      .addCase(fetchAllSkills.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(createSkill.pending, (state) => {
        state.isSkillCreating = true;
      })
      .addCase(createSkill.fulfilled, (state) => {
        state.isSkillCreating = false;
      })
      .addCase(createSkill.rejected, (state) => {
        state.isSkillCreating = false;
      })
      .addCase(SelectSkill.fulfilled, (state, action) => {
        state.selectedSkill = action.payload;
      })

      .addCase(updateSkill.pending, (state) => {
        state.isSkillUpdating = true;
      })
      .addCase(updateSkill.fulfilled, (state) => {
        state.isSkillUpdating = false;
      })
      .addCase(updateSkill.rejected, (state) => {
        state.isSkillUpdating = false;
      })
      .addCase(deleteSkill.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(deleteSkill.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteSkill.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(searchSkill.pending, (state) => {
        state.IsSearch = true;
      })
      .addCase(searchSkill.fulfilled, (state, action) => {
        state.IsSearch = false;
        state.skills = action.payload;
      })
      .addCase(searchSkill.rejected, (state) => {
        state.IsSearch = false;
      })
      .addCase(fetchSkillMappings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSkillMappings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.skillMappings = action.payload;
      })
      .addCase(fetchSkillMappings.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { skillIsEditForm, setCurrentSkillId, setSkillMappingByID } = skillSlice.actions;

export const selectSkillList = (state) => state.skill.skills;
export const selectSkillMappings = (state) => state.skill.skillMappings;
export const selectSkillMappingByID = (state) => state.skill.skillMappingByID;
export const selectSkillState = (state) => state.skill.selectedSkill;
export const selectSkillIsLoading = (state) => state.skill.isLoading;
export const selectSkillIsEdit = (state) => state.skill.isEdit;
export const selectCurrentSkillId = (state) => state.skill.currentSkillId;
export const SelectSearchSkillLoading = (state) => state.skill.IsSearch;
