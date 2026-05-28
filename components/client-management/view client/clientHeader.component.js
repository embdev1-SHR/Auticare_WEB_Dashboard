
import { useDispatch, useSelector } from "react-redux";
import { Button, Label } from "reactstrap";
import { activateClientSubscription, clientDeletion, selectClient, selectIsLoading } from "../../../store/slice/client.slice";
import Breadcrumb from "../../shared/breadcrumb";

function ClientHeader() {
  const client = useSelector(selectClient);
  const loading = useSelector(selectIsLoading);



  const dispatch = useDispatch();
  //Subscription Due Date
  const date = client[0] && new Date(client[0].SubcriptionPlanEndDate),
    formattedDate =
      date &&
      date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
  // Subscription Progress
  const start = client[0] && new Date(client[0].SubscriptionPlanActivatedDate),
    end = client[0] && new Date(client[0].SubcriptionPlanEndDate),
    today = new Date(),
    subscriptionProgress = Math.round(((today - start) / (end - start)) * 100);


  function HandleSuspend() {

    const valueToSend={
      clientId:client[0].ClientID,
      client:false
    }

    dispatch(clientDeletion(valueToSend));
  }
  function HandleEnable() {
    const valueToSend={
      clientId:client[0].ClientID,
      client:true
    }
    dispatch(clientDeletion(valueToSend));
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
        <div className='plan_grid' style={{width:"130%"}}
        >
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
        {client[0].Status == 1 ? <Button type='button' disabled={loading} className='btn btn-danger waves-effect waves-light' onClick={HandleSuspend}>
          Suspend
        </Button> : <Button type='button' disabled={loading}  color='success'  className='btn  waves-effect waves-light' onClick={HandleEnable}>
          Enable
        </Button>}
      </div>
    </div>
  ) : null;
}
export default ClientHeader;
