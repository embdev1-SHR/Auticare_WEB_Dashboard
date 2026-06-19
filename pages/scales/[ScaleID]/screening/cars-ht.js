import { ErrorMessage, Field, Formik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Label, Nav, NavItem, NavLink, Row } from "reactstrap";
import * as yup from "yup";
import AddQuestion from "../../../../components/scale-management/add-question.component";
import Accordion from "../../../../components/scale-management/category-accordion.component";
import CategoryItem from "../../../../components/scale-management/category-item.component";
import UpdateQuestion from "../../../../components/scale-management/update-question.comnponent";
import Layout from "../../../../components/shared/layout";
import Pagetitle from "../../../../components/shared/pagetitle";
import SimpleBarComponent from "../../../../components/shared/simplebar";
import { changeBreadcrumb, changeTitle } from "../../../../store/slice/layout.slice";
import {
  ActiveTab,
  CategoryDeleteScale,
  DeleteMetric,
  ScaleDetails,
  StateActiveTap,
  createCategory,
  fetchAllCategoryScaleID,
  fetchAllQuestions,
  selectActiveTab,
  selectActiveTabQuestion,
  selectByScaleIDCategory,
  selectQuestion,
  selectScaleDetail,
  selectScaleEdit,
  selectScaleIsLoading,
  selectViewModal,
} from "../../../../store/slice/scale.slice";
import Loader from "../../../../components/shared/loader";
import withAuth from "../../../../util/helpers/withAuth";
import Alert from "../../../../components/shared/alert";
import ScoreCriteria from "../../../../components/scale-management/scoreCriteria.component";
import { selectUserData } from "../../../../store/slice/auth.slice";

const contentSchema = yup.object().shape({
  Comment: yup.string().required("Category is required"),
});

function CarsHtScale() {
  const { query } = useRouter();
  const { ScaleID } = query;
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(false);
  const qtab = useSelector(selectActiveTabQuestion);
  const categories = useSelector(selectByScaleIDCategory);
  let values = categories.filter((e) => e.Status == 1);
  const SliceActiveTab = useSelector(selectActiveTab);
  const questions = useSelector(selectQuestion);
  const viewModal = useSelector(selectViewModal);
  const scaleDetails = useSelector(selectScaleDetail)[0];
  const Loading = useSelector(selectScaleIsLoading);
  const [selectedCatQn, setSelectedCatQn] = useState([]);
  let values2 = selectedCatQn.filter((e) => e.Status == 1);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [textFieldActive, setTextFieldActive] = useState(null);
  const [ButtonDisabled, setButtonDisabled] = useState(false);
  const [alert, setAlert] = useState(false);
  const [id, setId] = useState();
  const [MetricId, setMetricId] = useState();
  const [check, setCheck] = useState(false);
  const UserData = useSelector(selectUserData);

  const toggleTab = (tab, catID) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }

    const qn = arrangeQuestions(questions, catID).map((q) => {
      return {
        Score: [
          { value: q.ResponseOption1, weight: q.ResponseScore1 },
          { value: q.ResponseOption2, weight: q.ResponseScore2 },
          { value: q.ResponseOption3, weight: q.ResponseScore3 },
          { value: q.ResponseOption4, weight: q.ResponseScore4 },
          { value: q.ResponseOption5, weight: q.ResponseScore5 },
        ],
        ...q,
      };
    });
    setSelectedCategory(catID);
    setSelectedCatQn(qn);
  };
  const arrangeQuestions = (questions, catID) => {
    const qn = questions.filter((q) => q.CategoryID === catID).sort((a, b) => a.QuestionNumber - b.QuestionNumber);
    return qn;
  };
  useEffect(() => {
    const breadcrumb_Items = [
      { title: "Dashboard", link: "/dashboard" },
      { title: "Scales", link: "/scales" },
    ];
    dispatch(changeTitle("CARS-HT Scale"));
    dispatch(changeBreadcrumb(breadcrumb_Items));
    dispatch(fetchAllCategoryScaleID(ScaleID));
    dispatch(fetchAllQuestions(ScaleID));
    dispatch(ScaleDetails(ScaleID));
  }, [dispatch, ScaleID]);

  useEffect(() => {
    const size = categories.length;
    if (size > 0) toggleTab(size, categories[size - 1].CategoryID);
  }, [questions, categories]);

  const handleCategoryEdit = (currentIndex) => {
    setTextFieldActive(currentIndex);
  };

  const onSubmit = async (values) => {
    dispatch(ActiveTab(false));
    await setButtonDisabled(true);
    await dispatch(createCategory({ ScaleID, CategoryName: values.Comment }));
    await setButtonDisabled(false);
  };

  const onHandleConfirm = () => {
    const ValueToSend = {
      ScaleID,
      id,
    };
    const ValueToSendMetric = {
      ScaleID,
      MetricId,
      ScaleMetricType: "Screening",
    };

    check ? dispatch(DeleteMetric(ValueToSendMetric)) : dispatch(CategoryDeleteScale(ValueToSend));
    setCheck(false);
    setAlert(false);
  };

  const onDelete = () => {
    setAlert(false);
    setCheck(false);
  };

  const [finalTab, setFinalTab] = useState();

  useEffect(() => {
    const QuestionActiveTab = qtab ? qtab : activeTab;
    setFinalTab(QuestionActiveTab);
  }, [qtab, activeTab]);

  return (
    <Layout>
      {alert ? <Alert onHandleConfirm={onHandleConfirm} onDelete={onDelete} /> : null}
      {viewModal ? <UpdateQuestion activeTab={activeTab} /> : null}
      <div className="page-content">
        <Pagetitle />
        {Loading ? (
          <Loader />
        ) : (
          <Formik
            enableReinitialize={true}
            initialValues={{ Comment: "" }}
            validationSchema={contentSchema}
            onSubmit={onSubmit}
          >
            {({ touched, errors, handleSubmit, resetForm, setFieldValue, isSubmitting }) => (
              <Row>
                <Col md={6}>
                  {UserData.UserID === scaleDetails?.Create_By && <div className="mb-4">
                    <Label className="form-label required" htmlFor="scale-name">
                      Category
                    </Label>
                    <Row>
                      <Col md={10}>
                        <Field
                          name="Comment"
                          type="text"
                          className="form-control"
                          id="category-name"
                          placeholder="Enter category"
                        />
                        {errors.Comment && touched.Comment ? (
                          <ErrorMessage className="text-danger small" name="Comment" component="div" />
                        ) : null}
                      </Col>
                      <Col md={2}>
                        <Button
                          type="submit"
                          onClick={() => {
                            handleSubmit();
                          }}
                          disabled={ButtonDisabled}
                          color="success"
                          className="rounded-circle"
                        >
                          <i className="mdi mdi-check-bold"></i>
                        </Button>
                      </Col>
                    </Row>
                  </div>}
                  <div className="tab_scale">
                    <SimpleBarComponent>
                      <Nav tabs className="nav-tabs-custom nav-justified flex-column" role="tablist">
                        {values.map((category, key) => {
                          return (
                            <NavItem key={key}>
                              <NavLink
                                style={{ cursor: "default" }}
                                className={finalTab === key + 1 ? "active" : ""}
                                onClick={() => {
                                  toggleTab(key + 1, category.CategoryID);
                                }}
                              >
                                <CategoryItem
                                  index={key + 1}
                                  Category={category}
                                  textFieldActive={textFieldActive}
                                  handleCategoryEdit={handleCategoryEdit}
                                  setAlert={setAlert}
                                  setId={setId}
                                  hide={UserData.UserID === scaleDetails?.Create_By}
                                />
                              </NavLink>
                            </NavItem>
                          );
                        })}
                      </Nav>
                    </SimpleBarComponent>
                  </div>
                </Col>
                <Col md={6}>
                  {values.length > 0 ? (UserData.UserID === scaleDetails?.Create_By &&
                    <div style={{ marginLeft: "200px", marginBottom: "20px" }}>
                      <AddQuestion
                        data={{
                          CategoryID: selectedCategory,
                          ScaleID,
                          questionNumber: selectedCatQn.length + 1,
                        }}
                      />
                      <ScoreCriteria ScaleID={ScaleID} />
                    </div>
                  ) : null}
                  <div className="mb-4">
                    <div id="accordion">
                      {values2.map((q, i) => {
                        return (
                          <Accordion
                            key={i}
                            title={q.Question}
                            content={q}
                            setAlert={setAlert}
                            setCheck={setCheck}
                            setMetricId={setMetricId}
                            hide={UserData.UserID === scaleDetails?.Create_By}
                          />
                        );
                      })}
                    </div>
                  </div>
                </Col>
              </Row>
            )}
          </Formik>
        )}
      </div>
    </Layout>
  );
}

export default withAuth(CarsHtScale, "ScaleManagement");
