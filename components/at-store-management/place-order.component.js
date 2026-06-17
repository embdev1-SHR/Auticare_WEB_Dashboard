import { ErrorMessage, Field, Formik } from "formik";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import * as Yup from "yup";
import { StoreMainIsLoading, storeOrderCreate } from "../../store/slice/store.slice";

const validationSchema = Yup.object().shape({
  Quantity: Yup.number().min(1, "Minimum 1").required("Quantity is required"),
  ShippingAddress: Yup.string().min(5, "Too short").max(500, "Too long").required("Shipping address is required"),
  ContactName: Yup.string().min(2, "Too short").max(100, "Too long").required("Contact name is required"),
  Phone: Yup.string().matches(/^[0-9+\-\s()]{7,15}$/, "Invalid phone number").required("Phone is required"),
  OrderNotes: Yup.string().max(500, "Too long"),
});

const PlaceOrder = ({ ProductId, ProductName }) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const loading = useSelector(StoreMainIsLoading);

  const initialValues = {
    Quantity: 1,
    ShippingAddress: "",
    ContactName: "",
    Phone: "",
    OrderNotes: "",
  };

  const onSubmit = (values, { resetForm }) => {
    const data = {
      ProductID: Number(ProductId),
      Quantity: Number(values.Quantity),
      ShippingAddress: values.ShippingAddress,
      ContactName: values.ContactName,
      Phone: values.Phone,
      OrderNotes: values.OrderNotes,
    };
    dispatch(storeOrderCreate({ data, setOpen, resetForm }));
  };

  return (
    <>
      <Button
        type="button"
        color="success"
        onClick={() => setOpen(true)}
        className="waves-effect waves-light me-1">
        Place Order
      </Button>

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize>
        {({ errors, touched, handleSubmit }) => (
          <Modal isOpen={open} toggle={() => setOpen(!open)}>
            <ModalHeader toggle={() => setOpen(!open)}>Place Order (Drop Shipping)</ModalHeader>
            <ModalBody>
              {ProductName && (
                <div className="mb-3">
                  <label className="form-label">Product</label>
                  <p className="fw-bold mb-0">{ProductName}</p>
                </div>
              )}
              <div className="mb-3">
                <label className="form-label" htmlFor="Quantity">Quantity *</label>
                <Field name="Quantity" type="number" min="1" className="form-control" />
                {errors.Quantity && touched.Quantity && (
                  <ErrorMessage className="text-danger small" name="Quantity" component="div" />
                )}
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="ContactName">Contact Name *</label>
                <Field name="ContactName" type="text" className="form-control" placeholder="Full name" />
                {errors.ContactName && touched.ContactName && (
                  <ErrorMessage className="text-danger small" name="ContactName" component="div" />
                )}
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="Phone">Phone *</label>
                <Field name="Phone" type="text" className="form-control" placeholder="Contact phone" />
                {errors.Phone && touched.Phone && (
                  <ErrorMessage className="text-danger small" name="Phone" component="div" />
                )}
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="ShippingAddress">Shipping Address *</label>
                <Field as="textarea" name="ShippingAddress" rows={3} className="form-control" placeholder="Full delivery address" />
                {errors.ShippingAddress && touched.ShippingAddress && (
                  <ErrorMessage className="text-danger small" name="ShippingAddress" component="div" />
                )}
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="OrderNotes">Order Notes</label>
                <Field as="textarea" name="OrderNotes" rows={2} className="form-control" placeholder="Optional notes (size, colour, etc.)" />
                {errors.OrderNotes && touched.OrderNotes && (
                  <ErrorMessage className="text-danger small" name="OrderNotes" component="div" />
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button type="submit" color="success" disabled={loading} onClick={handleSubmit} className="waves-effect waves-light">
                {loading ? "Placing..." : "Place Order"}
              </Button>
              <Button color="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            </ModalFooter>
          </Modal>
        )}
      </Formik>
    </>
  );
};

export default PlaceOrder;
