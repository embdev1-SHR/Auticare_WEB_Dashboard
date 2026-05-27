import CommentActions from "./commentActions.component";
import { useDispatch, useSelector } from "react-redux";
import { PatientListComment, selectListComment } from "../../../../store/slice/patient.slice"
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import moment from "moment";
import { selectUserID } from "../../../../store/slice/auth.slice"


const CommentsList = () => {

  const ListOfComments = useSelector(selectListComment);
  const UserId = useSelector(selectUserID);

  const dispatch = useDispatch();
  const router = useRouter();
  const { PatientId } = router.query;


  const comments = ListOfComments?.data?.filter((comment) => comment.Status == 1).map((e) => {
    let time = moment(e.Create_TS).fromNow();
    return { Comment: e.Comment, TherapistName: `${e.Salutation} ${e.Name} `, DateTime: `${time}`, UserId: `${e.Create_By}`,CommentID: `${e.CommentID}`  }
  })

  useEffect(() => {
    dispatch(PatientListComment(PatientId));
  }, [dispatch]);

  return <>
    {comments?.slice(0).reverse().map((comment, key) => {
      const nameArr = comment.TherapistName.split(" ");
      return (
        <div key={key} className='p-3 border mb-2 bg-light' style={{ borderRadius: "5px" }}>
          <div className='d-flex'>
            <div className='align-self-center me-3'>
              <div className='user_media d-flex align-items-center'>
                <div className={`user_icon d-flex align-items-center justify-content-center mr-2 user_color${key + 1}`}>
                  <span>{nameArr[1].slice(0, 1)}</span>
                </div>
              </div>
            </div>
            <div className='flex-1'>
              <h5 className='font-size-15 mt-0 mb-1'>
                {comment.TherapistName}
                <small className='text-muted ml-1'>{comment.DateTime}</small>
              </h5>
              <p className='text-muted mb-0'>{comment.Comment}</p>
            </div>
            {comment.UserId == UserId && <CommentActions CommentId={comment.CommentID} PatientId={PatientId}/>}
          </div>
        </div>
      );
    })}

  </>
};
export default CommentsList;
