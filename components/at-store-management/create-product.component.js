import { useState } from "react";
import Select from "react-select";
import { Button, CardTitle, Label, Modal, ModalBody, ModalFooter, ModalHeader, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import MultiSelectTextField from "../shared/multi-select-text.component";
import * as Yup from "yup";
import { ErrorMessage, Field, Formik } from "formik";
import TextConfig from "../../components/content-management/create-content/textConfig.component";
import { useDispatch } from "react-redux";
import { AtStoreCreationSlice, AtStoreDetail, AtStoreDetails, AtStoreUpdateSlice, IsEditStore, StoreEdit, selectAtStoreID, setAtStoreEdit } from "../../store/slice/store.slice";
import { selectIsLoading, uploadImage } from "../../store/slice/common.slice";
import { useSelector } from "react-redux";
import { selectAtStoreIsEdit } from "../../store/slice/store.slice";
import { useEffect } from "react";
import FileDropZoneForm from "../shared/filedropzoneform";

const CreateProduct = () => {
  const dispatch = useDispatch();
  const imageUploading = useSelector(selectIsLoading);
  const EditStore = useSelector(selectAtStoreIsEdit);
  const CurrentStoreID = useSelector(selectAtStoreID);
  const StoreDetails = useSelector(AtStoreDetail)[0];
  console.log("StoreDetails",StoreDetails);
  const Edit = useSelector(StoreEdit);
  const [FileType, setFileType] = useState([".jpeg", ".jpg", ".png", ".gif"]);
  const [StateCategory, setStateCategory] = useState();
  let array = StoreDetails?.Highlights?.split(", ");
  const highlightsData = array?.map(e => ({ label: e, value: e }))
  const [activeTab, setActiveTab] = useState(1);
  const [subSkills, setSubSkills] = useState();
  const [load, setload] = useState(false);
  const [load1, setload1] = useState(false);
  const [load2, setload2] = useState(false);
  const [loadHead, setloadHead] = useState(false);


  const toggleTab = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    dispatch(AtStoreDetails(CurrentStoreID));
  }, [CurrentStoreID]);

  useEffect(() => {
    setSubSkills(Edit ? highlightsData : [])
    }, [StoreDetails]);

  function YupValidation(tap) {
    if (tap == 1) {
      return Yup.object().shape({
        productname: Yup.string().min(2, "Too Short!").max(200, "Too Long!").required("Please enter Product Name"),
        DiscountedPrice: Yup.string().min(2, "Too Short!").max(7, "Too Long!").required("Please enter Discounted Price"),
        price: Yup.string().min(2, "Too Short!").max(7, "Too Long!").required("Please enter Price"),
        SubSkill: Yup.mixed().required("Please enter Highlights"),
        ActivityInstructionTitle: Yup.mixed().required("Please enter activity instruction"),
        Category: Yup.mixed().required("Please enter Category"),
      })
    }
    else {
      return Yup.object().shape({
        Upload: Yup.mixed().required("Please  Upload the image")
      })
    }
  }



  const onSubmit = async (values) => {
    if (activeTab === 2) {
      const commaSeparatedString = values.SubSkills?.join(", ");
      console.log("commaSeparatedString", commaSeparatedString);
      const valueToSend = {
        "ProductName": values.productname,
        "Category": values.Category,
        "Price": values.price,
        "DiscountedPrice": values.DiscountedPrice,
        "Highlights": `${commaSeparatedString}`,
        "ProductDescription": values.ActivityInstructionTitle,
        "ImageURL": values.Upload,
        "ImageURL1": values.Upload1 ? values.Upload1 : undefined,
        "ImageURL2": values.Upload2 ? values.Upload2 : undefined,
        "ImageURL3": values.Upload3 ? values.Upload3 : undefined,
        "Status": 1
      }
      const valueToSendUpdate = {
        "ProductName": values.productname,
        "Category": values.Category.value,
        "Price": values.price,
        "DiscountedPrice": values.DiscountedPrice,
        "Highlights": `${commaSeparatedString}`,
        "ProductDescription": values.ActivityInstructionTitle,
        "ImageURL": values.Upload,
        "ImageURL1": values.Upload1 ? values.Upload1 : StoreDetails?.ImageURL1,
        "ImageURL2": values.Upload2 ? values.Upload2 : StoreDetails?.ImageURL2,
        "ImageURL3": values.Upload3 ? values.Upload3 : StoreDetails?.ImageURL3,
        "Status": 1,
        "ProductID": CurrentStoreID
      }

      console.log("valueToSend",valueToSend);

      !Edit ? dispatch(AtStoreCreationSlice(valueToSend)) : dispatch(AtStoreUpdateSlice(valueToSendUpdate));
      dispatch(setAtStoreEdit(!EditStore));
    }
    else {
      console.log("clicked");
      toggleTab(activeTab + 1);
    }
  };
  const uploadMedia = async (Files, setFieldValue) => {
    if (Files.length > 0) {
      let formData = new FormData();
      formData.append("imageFile", Files[0]);
      try {
        setloadHead(true)
        const originalPromiseResult = await dispatch(uploadImage(formData)).unwrap();
        const filename = originalPromiseResult.split("/").pop();
        const nonSpaceName = filename.indexOf("%20") >= 0 ? filename.replace(/%20/g, " ") : filename;
        if (setFieldValue) {
          setFieldValue("Upload", originalPromiseResult);
        }
        setloadHead(false)
      } catch (err) {
        setloadHead(false)
        console.log(err);
      }
    }
  };

  const uploadMedia1 = async (Files, setFieldValue) => {
    if (Files.length > 0) {
      let formData = new FormData();
      formData.append("imageFile", Files[0]);
      try {
        setload(true)
        const originalPromiseResult = await dispatch(uploadImage(formData)).unwrap();
        const filename = originalPromiseResult.split("/").pop();
        const nonSpaceName = filename.indexOf("%20") >= 0 ? filename.replace(/%20/g, " ") : filename;
        if (setFieldValue) {
          setFieldValue("Upload1", originalPromiseResult);
        }
        setload(false)
      } catch (err) {
        setload(false)
        console.log(err);
      }
    }
  };

  const uploadMedia2 = async (Files, setFieldValue) => {
    if (Files.length > 0) {
      let formData = new FormData();
      formData.append("imageFile", Files[0]);
      try {
        setload1(true)
        const originalPromiseResult = await dispatch(uploadImage(formData)).unwrap();
        const filename = originalPromiseResult.split("/").pop();
        const nonSpaceName = filename.indexOf("%20") >= 0 ? filename.replace(/%20/g, " ") : filename;
        if (setFieldValue) {
          setFieldValue("Upload2", originalPromiseResult);
        }
        setload1(false)
      } catch (err) {
        setload1(false)
        console.log(err);
      }
    }
  };
  const uploadMedia3 = async (Files, setFieldValue) => {
    if (Files.length > 0) {
      let formData = new FormData();
      formData.append("imageFile", Files[0]);
      try {
        setload2(true)
        const originalPromiseResult = await dispatch(uploadImage(formData)).unwrap();
        const filename = originalPromiseResult.split("/").pop();
        const nonSpaceName = filename.indexOf("%20") >= 0 ? filename.replace(/%20/g, " ") : filename;
        if (setFieldValue) {
          setFieldValue("Upload3", originalPromiseResult);
        }
        setload2(false)
      } catch (err) {
        setload2(false)
        console.log(err);
      }
    }
  };

  const options = [
    { value: "Low tech", label: "Low tech" },
    { value: "Mid tech", label: "Mid tech" },
    { value: "Low tech", label: "Low tech" },
  ];
  return (
    <>
      <Button
        type='button'
        onClick={() => {
          dispatch(setAtStoreEdit(!EditStore));
          dispatch(IsEditStore(false));
        }}
        color='primary'
        className='waves-effect waves-light'>
        Create Product
      </Button>
      <Formik initialValues={{
        productname: Edit ? StoreDetails.ProductName : "",
        DiscountedPrice: Edit ? StoreDetails.DiscountedPrice : "",
        price: Edit ? StoreDetails.Price : "",
        SubSkill: Edit ? StoreDetails.Highlights : "",
        ActivityInstructionTitle: Edit ? StoreDetails.ProductDescription : "",
        Category: Edit ? { value: StoreDetails.Category, label: StoreDetails.Category } : "",
        Upload: Edit ? StoreDetails.ImageURL : ""
      }} validationSchema={YupValidation(activeTab)} onSubmit={onSubmit} enableReinitialize={true}>
        {({ touched, errors, values, handleSubmit, resetForm, isSubmitting, setFieldValue }) => (
          <Modal
            isOpen={EditStore}
            toggle={() => {
              dispatch(setAtStoreEdit(!EditStore));
            }}
            scrollable={true}
            className='modal right app_modal'>
            <ModalHeader
              toggle={() => {
                dispatch(setAtStoreEdit(!EditStore));
                setActiveTab(1)
              }}>
              {Edit ? "Edit" : "Add"} Product
            </ModalHeader>
            <ModalBody>
              <div id='addproduct-nav-pills-wizard' className='twitter-bs-wizard'>
                <Nav className='twitter-bs-wizard-nav nav nav-pills nav-justified'>
                  <NavItem>
                    <NavLink
                      onClick={() => {
                        toggleTab(1);
                      }}>
                      <span className='step-number'>01</span>
                      <span className='step-title'>Basic Info</span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      onClick={() => {
                        toggleTab(2);
                      }}>
                      <span className='step-number'>02</span>
                      <span className='step-title'>Product Image</span>
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent activeTab={activeTab} className='twitter-bs-wizard-tab-content'>
                  <TabPane tabId={1}>
                    <CardTitle className='h5'>Basic Information</CardTitle>
                    <form>
                      <div className='mb-3'>
                        <Label className='form-label' htmlFor='productname'>
                          Product Name
                        </Label>
                        <Field id='productname' name='productname' type='text' className='form-control' />
                        {errors.productname && touched.productname ? <ErrorMessage className='text-danger small' name='productname' component='div' /> : null}
                      </div>

                      <div className='row'>
                        <div className='col-md-6'>
                          <div className='mb-3'>
                            <Label className='form-label' htmlFor='DiscountedPrice'>
                              Discounted Price
                            </Label>
                            <Field id='DiscountedPrice' name='DiscountedPrice' type='text' className='form-control' />
                            {errors.DiscountedPrice && touched.DiscountedPrice ? <ErrorMessage className='text-danger small' name='DiscountedPrice' component='div' /> : null}
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className='mb-3'>
                            <Label className='form-label' htmlFor='price'>
                              Price
                            </Label>
                            <Field id='price' name='price' type='text' className='form-control' />
                            {errors.price && touched.price ? <ErrorMessage className='text-danger small' name='price' component='div' /> : null}
                          </div>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-md-6'>
                          <div className='mb-3'>
                            <Label className='form-label'>Highlights</Label>
                            <Field name="SubSkill"
                              component={MultiSelectTextField}
                              value={subSkills}
                              setValue={setSubSkills}
                              placeholder='Type Highlights and press enter...' nameAttribute='SubSkills' />
                            {errors.SubSkill && touched.SubSkill ? <ErrorMessage className='text-danger small' name='SubSkill' component='div' /> : null}
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className='mb-3'>
                            <Label className='form-label'>Category</Label>
                            <Field component={Select}
                              classNamePrefix='select2-selection' name="Category" placeholder='Choose...'
                              value={Edit ? { value: StoreDetails.Category, label: StoreDetails.Category } : StateCategory}
                              onChange={(Category) => {
                                setFieldValue("Category", Category.value);
                                setStateCategory({ value: Category.value, label: Category.value })
                              }}
                              title='Country' options={options} />
                            {errors.Category && touched.Category ? <ErrorMessage className='text-danger small' name='Category' component='div' /> : null}
                          </div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <Field
                          component={TextConfig}
                          label="Title"
                          name="ActivityInstructionTitle"
                          value={values.ActivityInstructionTitle}
                          setValue={(value) =>
                            setFieldValue("ActivityInstructionTitle", value)
                          }
                          placeholder="Enter activity instruction title ..."
                        />
                        {errors.ActivityInstructionTitle && touched.ActivityInstructionTitle ? <ErrorMessage className='text-danger small' name='ActivityInstructionTitle' component='div' /> : null}
                      </div>
                    </form>
                  </TabPane>
                  <TabPane tabId={2}>
                    <CardTitle className='h4'>Product Images</CardTitle>
                    <p className='card-title-desc'>Upload product image</p>
                    <FileDropZoneForm multiFiles={false} fileData={uploadMedia} isUploading={loadHead} accept={FileType} setFieldValue={setFieldValue} displayName={ Edit ? StoreDetails?.ImageURL: undefined}/>
                    {errors.Upload && touched.Upload ? <ErrorMessage className='text-danger small' name='Upload' component='div' /> : null}
                    <CardTitle className='h4' style={{ marginTop: "20px" }}>Product Images</CardTitle>
                    <p className='card-title-desc'>Upload product image</p>
                    <FileDropZoneForm multiFiles={false} fileData={uploadMedia1} isUploading={load} accept={FileType} setFieldValue={setFieldValue} displayName={Edit ? StoreDetails?.ImageURL1: undefined}/>
                    <CardTitle className='h4' style={{ marginTop: "20px" }}>Product Images</CardTitle>
                    <p className='card-title-desc'>Upload product image</p>
                    <FileDropZoneForm multiFiles={false} fileData={uploadMedia2} isUploading={load1} accept={FileType} setFieldValue={setFieldValue} displayName={Edit ? StoreDetails?.ImageURL2: undefined}/>
                    <CardTitle className='h4' style={{ marginTop: "20px" }}>Product Images</CardTitle>
                    <p className='card-title-desc'>Upload product image</p>
                    <FileDropZoneForm multiFiles={false} fileData={uploadMedia3} isUploading={load2} accept={FileType} setFieldValue={setFieldValue} displayName={Edit ? StoreDetails?.ImageURL3: undefined}/>
                  </TabPane>
                </TabContent>
              </div>
            </ModalBody>
            <ModalFooter>
              <ul className='pager wizard twitter-bs-wizard-pager-link w-100' style={{ listStyle: "none" }}>
                {activeTab !== 1 ? (
                  <li className={"previous"}>
                    <Button
                      type='button'
                      color='light'
                      className='btn-md m-1 waves-effect waves-light action_btn'
                      onClick={() => {
                        toggleTab(activeTab - 1);
                      }}>
                      Previous
                    </Button>
                  </li>
                ) : null}
                {activeTab === 2 ? (
                  <li className={"submit"}>
                    <Button type='button' color='primary' className='btn-md m-1 waves-effect waves-light action_btn' onClick={handleSubmit}>
                      Submit
                    </Button>
                  </li>
                ) : (
                  <li className={"next"}>
                    <Button type='button' color='primary' className='btn-md m-1 waves-effect waves-light action_btn' onClick={handleSubmit}>
                      Next
                    </Button>
                  </li>
                )}
              </ul>
            </ModalFooter>
          </Modal>
        )}
      </Formik>
    </>
  );
};

export default CreateProduct;
