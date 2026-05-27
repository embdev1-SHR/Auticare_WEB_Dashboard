import { Button } from "reactstrap";
import CommentsList from "./commentsList.component";

const Comments = () => {
  return (
    <>
      <div className='tab_data_header'>
        <div className='tab_title'>
          <h3>Comments</h3>
        </div>
      </div>

      <div
        className='mb-3 p-2'
        style={{
          borderRadius: "3px",
          border: "2px dashed #e8eaed",
        }}>
        <textarea className='form-control' style={{ border: "none" }} placeholder='Write your comment here...'></textarea>
        <div className='text-end border-top m-1 pt-2'>
          <Button color='primary'>Add Comment</Button>
        </div>
      </div>

      <CommentsList />
    </>
  );
};

export default Comments;
