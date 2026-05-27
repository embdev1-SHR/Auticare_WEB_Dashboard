import CreatePlan from "./createPlan.component";
import InterventionPlan from "./interventionPlan.component";

const Plan = () => {
  return (
    <>
      <div className='dropzone mb-4'>
        <section>
          <div className='dz-message needsclick' style={{ textAlign: "center" }}>
            <div className='mb-2'>
              <i className='display-4 text-muted ri-folder-open-line' />
            </div>
            <h5 className='mb-5'>This patient has no plans yet.</h5>
            <CreatePlan />
          </div>
        </section>
      </div>
    </>
  );
};

export default Plan;
