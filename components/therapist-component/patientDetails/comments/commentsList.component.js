import CommentActions from "./commentActions.component";

const CommentsList = () => {
  const comments = [
    { Comment: "Nice! Did you use 8222 ones? Any idea how they look like under sun?", TherapistName: "Dr. Anjith Augustine T ", DateTime: "3 mins ago" },
    { Comment: "Nice! Did you use 8222 ones? Any idea how they look like under sun?", TherapistName: "Dr. Susna Sarah Paul", DateTime: "1 day ago" },
  ];

  return comments.map((comment, key) => {
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
          <CommentActions />
        </div>
      </div>
    );
  });
};

export default CommentsList;
