

const BasicDetails = () => {
  return (
    <>
      <form action="#">
        <div className="row">
          <div className="col-md-3">
            <div className="mb-4">
              <label className="form-label">First Name</label>
              <input type="text" className="form-control" defaultValue="Mitchel" placeholder="Enter first name" />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-4">
              <label className="form-label">Middle Name</label>
              <input type="text" className="form-control" defaultValue="" placeholder="Enter middle name" />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-4">
              <label className="form-label">Last Name</label>
              <input type="text" className="form-control" defaultValue="Givens" placeholder="Enter last name" />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-4">
              <label className="form-label">Date of Birth</label>
              <input
                type="text"
                className="form-control"
                defaultValue="02 May, 2018"
                placeholder="select date of birth"
                data-provide="datepicker"
                data-date-format="dd M, yyyy"
                data-date-autoclose="true"
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-3">
            <div className="mb-4">
              <label className="form-label">Gender</label>
              <select className="form-control" defaultValue={"Male"}>
                <option>Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-4">
              <label className="form-label">Guardian Name</label>
              <input type="text" className="form-control" defaultValue="Givens Thomas" placeholder="Enter guardian name" />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-4">
              <label className="form-label">Guardian Phone No</label>
              <input type="text" className="form-control" defaultValue="+91 9876543210" placeholder="Enter guardian phone no" />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-4">
              <label className="form-label">Facilitator Name</label>
              <input type="text" className="form-control" defaultValue="Facilitator Name" placeholder="Enter facilitator name" />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-3">
            <div className="mb-4">
              <label className="form-label">Center</label>
              <input type="text" className="form-control" defaultValue="KIMS HEALTH Center, Kazhakootam" placeholder="Enter center name" />
            </div>
            <div className="mb-4">
              <label className="form-label">Department Name</label>
              <input type="text" className="form-control" defaultValue="KIMS Department" placeholder="Enter department name" />
            </div>
          </div>
          <div className="col-md-9">
            <div className="mb-4">
              <label className="form-label">Problem Details</label>
              <textarea
                id="textarea"
                className="form-control min_equal"
                rows="5"
                placeholder="Enter problem details..."
                defaultValue={`Poor eye contact, lack of social smile, less peer interaction.`}
              />
            </div>
          </div>
        </div>

        <div className="container-action d-flex justify-content-end">
          <button type="button" className="btn btn-primary btn-md waves-effect waves-light action_btn">
            Save Changes
          </button>
        </div>
      </form>
    </>
  );
};

export default BasicDetails;
