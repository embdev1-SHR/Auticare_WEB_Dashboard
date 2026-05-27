import { Button } from "reactstrap";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectTherapyGoalLoading } from "../../../../store/slice/goal.slice";
import { useEffect } from "react";
import { useFormikContext } from "formik";
import { setGoals } from "../../../../store/slice/patient.slice";

const GoalsLibrary = ({ TherapyGoals }) => {
  // Grab values and submitForm from context
  const { values } = useFormikContext();
  const dispatch = useDispatch();

  const IsTherapyGoalsLoading = useSelector(selectTherapyGoalLoading);

  const [activity, setActivity] = useState([]);
  const [plan, setPlan] = useState([]);


useEffect(() => {
  dispatch(setGoals(plan));
}, [plan]);


  useEffect(() => {
    const act = TherapyGoals.map((ele) => {
      return { GoalID: ele.GoalID, GoalName: ele.GoalName };
    });

    const newArr = [...activity, ...TherapyGoals];
    const uniqueArr = newArr?.filter((item, index) => {
      return (
        index ===
        newArr.findIndex((obj) => {
          return JSON.stringify(obj) === JSON.stringify(item);
        })
      );
    });
    console.log(uniqueArr?.filter((ele) => values.TherapyID.includes(ele.TherapyID)));
    setActivity(uniqueArr?.filter((ele) => values.TherapyID.includes(ele.TherapyID)));
  }, [TherapyGoals, values.TherapyID]);

  const onClickHandle = (goalSelected) => {
    const actArray = activity?.filter((el) => el.GoalID !== goalSelected.GoalID);

    setActivity(actArray);
    setPlan([...plan, goalSelected]);
  };

  const onremoveHandle = (goalremoved) => {
    const planArray = plan?.filter((el) => el.GoalID !== goalremoved.GoalID);

    setActivity([...activity, goalremoved]);
    setPlan(planArray);
  };
  return (
    <div className='d-flex'>
      <div className='flex-1 overflow-auto ' style={{ backgroundColor: "rgb(241, 245, 247)", borderRadius: "5px" }}>
        <div style={{ padding: "16px" }}>
          <h6>Goals Library</h6>

          {IsTherapyGoalsLoading ? (
            <div className='text-center' style={{ userSelect: "none", padding: "30px", margin: "0px 00px 8px", background: "rgb(255, 255, 255)" }}>
              <h5>Loading...</h5>
            </div>
          ) : activity.length > 0  ? (
            activity.map((item, key) => {
              return (
                <div key={key} tabIndex='0' role='button' style={{ userSelect: "none", padding: "12px", margin: "0px 0px 8px", background: "rgb(255, 255, 255)" }}>
                  <div>
                    {item.GoalName}
                    <Button color='success' size='sm' className='btn-rounded waves-effect waves-light float-end plan-goal' onClick={() => onClickHandle(item)}>
                      <i className='ri-add-line ri-lg align-middle'></i>
                    </Button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className='text-center' style={{ userSelect: "none", padding: "30px", margin: "0px 00px 8px", background: "rgb(255, 255, 255)" }}>
              <h5>No Goals</h5>
            </div>
          )}
        </div>
      </div>

      {(activity.length > 0 || plan.length>0) && (
        <div className='flex-1 overflow-auto  ml-4' style={{ backgroundColor: "rgb(241, 245, 247)", borderRadius: "5px" }}>
          <div style={{ padding: "16px", textAlign: "center" }}>
            {/* <div className='mb-2' style={{ position: "relative", top: "25%" }}>
            <i className='display-4 text-primary ri-folder-open-line' />
            <p>No selected plans.</p>
          </div> */}
            {plan.length > 0 ? (
              plan.map((item, key) => {
                console.log(item);
                return (
                  <div key={key} tabIndex='0' role='button' style={{ userSelect: "none", padding: "12px", margin: "0px 0px 8px", background: "rgb(255, 255, 255)" }}>
                    <div>
                      {item.GoalName}
                      <Button color='danger' size='sm' className='btn-rounded waves-effect waves-light float-end plan-goal' onClick={() => onremoveHandle(item)}>
                        <i className=' ri-subtract-line ri-lg align-middle'></i>
                      </Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className='mb-2 pt-5'>
                <i className='display-4 text-primary ri-folder-open-line' />
                <h6>No selected plans.</h6>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsLibrary;
