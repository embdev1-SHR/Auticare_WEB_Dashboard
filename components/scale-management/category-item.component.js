import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Col, Input, Row } from "reactstrap";
import {
  selectScaleEdit,
  updateCategory
} from "../../store/slice/scale.slice";
import { useSelector } from "react-redux";

const CategoryItem = ({ index, Category, textFieldActive, handleCategoryEdit, setAlert, setId, hide }) => {
  const dispatch = useDispatch();

  console.log("textFieldActive", textFieldActive);
  const [updatedCategory, setUpdatedCategory] = useState(Category.CategoryName)
  const submitUpdate = () => {

    if (updatedCategory !== Category.CategoryName) {
      const status = Category.Status
      const categoryID = Category.CategoryID
      const scaleID = Category.ScaleID
      dispatch(updateCategory({ ID: { categoryID: categoryID, scaleID: scaleID }, payload: { CategoryName: updatedCategory, Status: status } }))
    }
    handleCategoryEdit(null)
  }


  return (
    <>

      <span className='d-none d-sm-block'>
        <Row>
          <Col md={1} className='pt-1'>
            {index}.
          </Col>
          {textFieldActive === index ? (
            <>
              <Col md={8}>
                <Input type='text' bsSize={"sm"} value={updatedCategory} onChange={(e) => setUpdatedCategory(e.target.value)} />{" "}
              </Col>
              <Col md={3}>
                <Button className='rounded-circle me-1' size='sm' color='success' onClick={submitUpdate}>
                  <i className='mdi mdi-check-bold'></i>
                </Button>
              </Col>
            </>
          ) : (
            <>
              <Col md={11} style={{ display: "flex", justifyContent: "space-between" }}>
                {Category.CategoryName}
                {hide && <>
                  <i className='ri ri-edit-2-line align-middle m-x text-warning p-2' style={{ cursor: "pointer" }} onClick={() => handleCategoryEdit(index)}></i>
                  <Button className='rounded-circle mdi mdi-trash-can font-size-18' size='sm' color='danger' onClick={() => { setAlert(true), setId(Category.CategoryID) }} >
                    {/* <i className='mdi mdi-check-bold'></i> */}
                  </Button>
                </>}

              </Col>
            </>
          )}
        </Row>
      </span>
    </>
  );
};

export default CategoryItem;
