import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Col,
  Input,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent
} from "reactstrap";
import AddTask from "../../../../components/assessment-management/add-task.component";
import AssessmentTaskTable from "../../../../components/assessment-management/task-table.component";
import UpdateTask from "../../../../components/assessment-management/update-task.component";
import Layout from "../../../../components/shared/layout";
import Loader from "../../../../components/shared/loader";
import PageTitle from "../../../../components/shared/pagetitle";
import SimpleBarComponent from "../../../../components/shared/simplebar";
import {
  changeBreadcrumb,
  changeTitle,
} from "../../../../store/slice/layout.slice";
import {
  fetchAllAssessmentQuestions,
  fetchAllCategoryScaleID,
  selectByScaleIDCategory,
  selectIsQuestionCreated,
  selectQuestion,
  selectScaleIsLoading,
  selectViewModal,
  updateCategory
} from "../../../../store/slice/scale.slice";
import withAuth from "../../../../util/helpers/withAuth";

const AddAssessment = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(1);
  const [labelEdit, setLabelEdit] = useState(false);
  const [editValue, setEditValue] = useState("")
  const Loading = useSelector(selectScaleIsLoading);

  const { query } = useRouter();
  const { ScaleID } = query;
  const categories = useSelector(selectByScaleIDCategory);
  const isQuestionCreated = useSelector(selectIsQuestionCreated);
  const questions = useSelector(selectQuestion);
  console.log("questions",questions);
  const [selectedCatQn, setSelectedCatQn] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const viewModal = useSelector(selectViewModal);
  const toggleTab = (tab, catID) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
    const qn = arrangeQuestions(questions, catID).map((q) => {
      return { ...q };
    });
    setSelectedCategory(catID);
    console.log("qn",qn);
    setSelectedCatQn(qn);
    setEditValue(categories[tab - 1]?.CategoryName)
  };
  const arrangeQuestions = (questions, catID) => {
    const qn = questions
      .filter((q) => q.CategoryID === catID)
      .sort((a, b) => a.QuestionNumber - b.QuestionNumber);
    return qn;
  };

  useEffect(() => {
    const breadcrumb_Items = [
      { title: "Dashboard", link: "/dashboard" },
      { title: "Assessment", link: "/assessments" },
    ];
    dispatch(changeTitle("Ablls"));
    dispatch(changeBreadcrumb(breadcrumb_Items));
    dispatch(fetchAllCategoryScaleID(ScaleID));
    dispatch(fetchAllAssessmentQuestions(ScaleID));
  }, [dispatch, ScaleID]);
  
  useEffect(() => {
    if (isQuestionCreated) {
      toggleTab(activeTab, selectedCategory);
    } else toggleTab(1, categories[0]?.CategoryID);
  }, [categories, questions]);

  const onCatEdit = () => {
    if (editValue !== categories[activeTab - 1].CategoryName) {
      const status = categories[activeTab - 1].Status
      const categoryID = categories[activeTab - 1].CategoryID
      const scaleID = categories[activeTab - 1].ScaleID
      dispatch(updateCategory({ ID: { categoryID: categoryID, scaleID: scaleID }, payload: { CategoryName: editValue, Status: status } }))
    }
    setLabelEdit(false)
  }
  return (
    <>
      <Layout>
        {viewModal ? <UpdateTask  ScaleID={ScaleID}/> : null}

        <div className="page-content add_assessment">
          <PageTitle />
          {Loading ? (
            <Loader />
          ) : (
            <div
              className="vertical_tab"
              style={{
                top: "0px",
                height: "100%",
              }}
            >
              <div className="tab_grid_copy" >
                <SimpleBarComponent className="sidebar_tab" style={{ maxWidth:"100px"}}>
                  <Nav
                    tabs
                    className="nav-tabs-custom nav-justified flex-column"
                    role="tablist"
                  >
                    {categories.map((category, key) => {
                      return (
                        <NavItem key={key}>
                          <NavLink
                            style={{ cursor: "pointer", }}
                            className={activeTab === key + 1 ? "active" : ""}
                            onClick={() => {
                              toggleTab(key + 1, category.CategoryID);
                            }}
                          >
                            <span className="d-none d-sm-block">
                              {category.CategoryLabel}
                            </span>
                          </NavLink>
                        </NavItem>
                      );
                    })}
                  </Nav>
                </SimpleBarComponent>
                <SimpleBarComponent className="full_screen_content">
                  <TabContent
                    activeTab={activeTab}
                    className="p-0 text-muted"
                    id="v-tabContent"
                  >
                    <Row className="mb-2">
                      <Col sm="8">
                          {labelEdit ? (
                            <Row >
                              <Col  sm="10" md={6}>
                                <Input
                                  className="form-control"
                                  value={editValue}
                                  onChange={(e) => {
                                    setEditValue(e.target.value)
                                  }}
                                />
                              </Col>
                              <Col sm={6} md={4} className="p-0 pt-1">
                                <Button className="btn-success me-1" size="sm" onClick={onCatEdit}>
                                  <i className="mdi mdi-check-bold"></i>
                                </Button>
                                <Button
                                  color="secondary"
                                  size="sm"
                                  onClick={() => setLabelEdit(false)}
                                >
                                  <i className="mdi mdi-close-thick"></i>
                                </Button>
                              </Col>
                            </Row>
                          ) : (
                            <h5 className="text-primary pt-1">
                              {categories[activeTab - 1]?.CategoryName}{" "}
                              <i
                                className="ri ri-edit-2-line align-middle m-x text-warning"
                                onClick={() => setLabelEdit(true)}
                              ></i>
                            </h5>
                          )}
                      </Col>
                      <Col sm="4">
                        <div className="text-sm-end">
                          <AddTask
                            data={{
                              ScaleID: ScaleID,
                              CategoryID: selectedCategory,
                              questionNumber: selectedCatQn.length + 1,
                            }}
                          />
                        </div>
                      </Col>
                    </Row>
                    <div className="tab_data_table table-responsive">
                      <AssessmentTaskTable question={selectedCatQn} />
                    </div>
                  </TabContent>
                </SimpleBarComponent>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
};

export default withAuth(AddAssessment, "ScaleManagement");