const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  textDirection: "ltr",
  leftSideBarType: "default",
  title: "",
  breadcrumbItems: [],
  modalOpen: false,
  alertConfirm: false,
  goalId: [],
};

/**
 * reference
 * @link https://blog.logrocket.com/use-redux-next-js/
 * @link https://github.com/kirill-konshin/next-redux-wrapper#redux-toolkit
 */
export const layoutSlice = createSlice({
  name: "layout",
  initialState: initialState,
  reducers: {
    setTextDirection: (state, action) => {
      return { ...state, textDirection: action.payload };
    },
    changeSidebarType: (state, action) => {
      return {
        ...state,
        leftSideBarType: action.payload,
      };
    },
    changeBreadcrumb: (state, action) => {
      return {
        ...state,
        breadcrumbItems: action.payload,
      };
    },
    changeTitle: (state, action) => {
      return {
        ...state,
        title: action.payload,
      };
    },
    setModalOpen: (state, action) => {
      return {
        ...state,
        modalOpen: action.payload,
      };
    },

    setAlertConfirm: (state, action) => {
      return {
        ...state,
        alertConfirm: action.payload,
      };
    },
    setGoalId: (state, action) => {
      return {
        ...state,
        goalId: action.payload,
      };
    },
    
  },
});

export const {
  setTextDirection,
  changeSidebarType,
  changeBreadcrumb,
  changeTitle,
  setModalOpen,
  setAlertConfirm,
  setGoalId
} = layoutSlice.actions;

export const selectChangeSidebarTypeState = (state) =>state.layout.leftSideBarType;
export const selectChangeBreadcrumbState = (state) =>state.layout.breadcrumbItems;
export const selectChangeTitleState = (state) => state.layout.title;
export const selectSetModalOpenState = (state) => state.layout.modalOpen;
export const selectAlertConfirm = (state) => state.layout.alertConfirm;
export const getGoalId = (state) => state.layout.goalId;
