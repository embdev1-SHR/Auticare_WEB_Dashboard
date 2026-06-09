
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Button, Label } from "reactstrap";
import Alert from "../../shared/alert";
import { activateClientSubscription, clientDeletion, clientPermanentDeletion, selectClient, selectIsLoading } from "../../../store/slice/client.slice";
import Breadcrumb from "../../shared/breadcrumb";

function ClientHeader() {
  const client = useSelector(selectClient);
  const loading = useSelector(selectIsLoading);
  const [deleteAlert, setDeleteAlert] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const date = client[0] && new Date(client[0].SubcriptionPlanEndDate),
    formattedDate =
      date &&
      date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

  const start = client[0] && new Date(client[0].SubscriptionPlanActivatedDate),
    end = client[0] && new Date(client[0].SubcriptionPlanEndDate),
    today = new Date(),
    subscriptionProgress = Math.round(((today - start) / (end - start)) * 100);

  function HandleSuspend() {
    dispatch(clientDeletion({ clientId: client[0].ClientID, client: false }));
  }

  function HandleEnable() {
    dispatch(clientDeletion({ clientId: client[0].ClientID, client: true }));
  }

  async function onDeleteConfirm() {
    setDeleteAlert(false);
    await dispatch(clientPermanentDeletion(client[0].ClientID));
    router.push("/clients");
  }

  return client.length > 0 ? (
    <div className='patient_card'>
      <div className='patient_details'>
        <div className='user_pic'>
          <img src={client[0]?.ClientLogo} alt='' />
        </div>
        <div className='user_basic'>
          <h2>{client[0]?.ClientName}</h2>
          <Breadcrumb other={"p-0"} />
        </div>
      </div>
      <div className='patient_plan'>
        <div className='plan_grid' style={{width:"130%"}}>
          <div className='plan_ico'>
            <i className='ri-heart-line'></i>
          </div>
          <div className='plan_dtl'>
            <Label>Current Plan</Label>
            <h4>{client[0].PlanName}</h4>
          </div>
        </div>
        <div className='plan_grid' style={{width:"130%", marginLeft:"30%"}}>
          <div className='plan_ico'>
            <i className='ri-calendar-line'></i>
          </div>
          <div className='plan_dtl'>
            <Label>Due Date</Label>
            <h4>{formattedDate}</h4>
          </div>
        </div>
      </div>
      <div className='card_action justify-content-end' style={{ gap: "8px", display: "flex" }}>
        <Button
          type='button'
          disabled={loading}
          color='success'
          className='btn waves-effect waves-light'
          onClick={() => dispatch(activateClientSubscription(client[0]))}
        >
          Activate (1 Month)
        </Button>
        {client[0].Status == 1
          ? <Button type='button' disabled={loading} className='btn btn-danger waves-effect waves-light' onClick={HandleSuspend}>Suspend</Button>
          : <Button type='button' disabled={loading} color='success' className='btn waves-effect waves-light' onClick={HandleEnable}>Enable</Button>
        }
        <Button type='button' disabled={loading} color='danger' className='btn waves-effect waves-light' onClick={() => setDeleteAlert(true)}>
          Delete
        </Button>
      </div>
      {deleteAlert && <Alert onHandleConfirm={onDeleteConfirm} onDelete={() => setDeleteAlert(false)} />}
    </div>
  ) : null;
}
export default ClientHeader;
