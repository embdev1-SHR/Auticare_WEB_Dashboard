import Link from "next/link";
import { Button, Card, CardBody, CardTitle } from "reactstrap";
import { VideoPreviewPlayer } from "./tutorialUrlPreview.component";

const URLListItem = () => {
  return (
    <Card>
      <CardBody>
        <CardTitle className='h4 d-flex justify-content-between'>
          <Link href={`${comment.TherapistName}`} passHref>
            <a target='_blank'>{comment.TherapistName}</a>
          </Link>
          <div>
            <Button className='rounded-circle' disabled={Loading} size='sm' color='danger' onClick={() => handleDeleteInput(comment.TutorialLinkID)}>
              <i className='mdi mdi-trash-can'></i>
            </Button>
          </div>
        </CardTitle>
        {match ? (
          <div className='mt-3'>
            <VideoPreviewPlayer file_type={"video/youtube"} file_src={comment.TherapistName} />
          </div>
        ) : null}
      </CardBody>
    </Card>
  );
};

export default URLListItem;
