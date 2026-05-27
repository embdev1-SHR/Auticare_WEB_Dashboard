import { useFormikContext } from "formik";
import { useRouter } from "next/router";

import { useSelector } from "react-redux";
import { Button } from "reactstrap";
import { selectIsEdit } from "../../../store/slice/client.slice";

const ClientFooter = () => {
  const router = useRouter();
  const { handleSubmit, isSubmitting } = useFormikContext();

  const IsEdit = useSelector(selectIsEdit);

  return (
    <div className='container-action d-flex justify-content-end px-3'>
      {IsEdit ? (
        <>
          <Button type='button' color='light' className='btn-md waves-effect waves-light action_btn mr-3' onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type='submit' color='primary' className='btn-md waves-effect waves-light action_btn' disabled={isSubmitting} onClick={handleSubmit}>
            Update
          </Button>
        </>
      ) : (
        <Button type='button' color='secondary' className='btn-md waves-effect waves-light action_btn' onClick={() => router.back()}>
          Back
        </Button>
      )}
    </div>
  );
};

export default ClientFooter;
