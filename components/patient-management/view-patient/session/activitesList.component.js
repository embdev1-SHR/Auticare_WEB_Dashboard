import { useState } from "react";
import { Row, Col } from "reactstrap";

const ActivitiesList = () => {
  const initialColumns = ["item 1", "item 2", "item 3", "item 4", "item 5", "item 6"];
  const [activity, setActivity] = useState(initialColumns);
  const [plan, setPlan] = useState([]);

  const onClickHandle = (e) => {
    const text = e.target.parentNode.textContent;
    const itemValue = text.slice(0, text.length - 1);

    const actArray = activity?.filter((el) => !el.includes(itemValue));
    const planArray = initialColumns?.filter((el) => el.includes(itemValue));

    setActivity(actArray);
    setPlan([...plan, planArray]);
  };

  const onremoveHandle = (e) => {
    const text = e.target.parentNode.textContent;
    const itemValue = text.slice(0, text.length - 1);

    const planArray = plan?.filter((el) => !el.includes(itemValue));
    const actArray = initialColumns?.filter((el) => el.includes(itemValue));

    setActivity([...activity, actArray]);
    setPlan(planArray);
  };

  return (
    <div className='d-flex'>
      <div className='flex-1 overflow-auto ' style={{ backgroundColor: "rgb(241, 245, 247)", borderRadius: "5px" }}>
        <div style={{ padding: "16px" }}>
          <h6>Choose Activity</h6>
          {activity.map((item, key) => {
            return (
              <div key={key} tabIndex='0' role='button' style={{ userSelect: "none", padding: "12px", margin: "0px 0px 8px", background: "rgb(255, 255, 255)" }}>
                <div>
                  {item}
                  <button
                    onClick={onClickHandle}
                    className='btn-rounded waves-effect waves-light btn-sm btn btn-success btn-sm '
                    style={{ borderRadius: "50%", backgroundColor: "rgb(22, 171, 180)", fontSize: "15px", float: "right" }}>
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className='flex-1 overflow-auto  ml-4' style={{ backgroundColor: "rgb(241, 245, 247)", borderRadius: "5px" }}>
        <div style={{ padding: "16px", textAlign: "center" }}>
          {/* <div className='mb-2' style={{ position: "relative", top: "25%" }}>
            <i className='display-4 text-primary ri-folder-open-line' />
            <p>No selected plans.</p>
          </div> */}
          {plan.map((item, key) => {
            return (
              <div key={key} tabIndex='0' role='button' style={{ userSelect: "none", padding: "12px", margin: "0px 0px 8px", background: "rgb(255, 255, 255)" }}>
                <div>
                  {item}
                  <button onClick={onremoveHandle} className='btn-rounded waves-effect waves-light btn-sm btn btn-danger btn-sm ' style={{ borderRadius: "50%", fontSize: "15px", float: "right" }}>
                    -
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ActivitiesList;
