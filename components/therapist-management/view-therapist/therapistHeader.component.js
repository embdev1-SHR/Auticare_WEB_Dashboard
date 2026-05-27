import { useSelector } from "react-redux";
import { selectTherapist } from "../../../store/slice/therapist.slice";
import BreadcrumbComponent from "../../shared/breadcrumb";

function TherapistHeader() {
  const Therapist = useSelector(selectTherapist);
  const Pic = Therapist[0]?.Photo.indexOf("-") >= 0 ? Therapist[0]?.Photo.replace(/-/g, "%20") : Therapist[0]?.Photo;
  return (
    <div className='patient_card'>
      <div className='patient_details'>
        <div className='user_pic'>
          <img src={Therapist[0]?.Photo} width={100} height={100} />
        </div>
        <div className='user_basic'>
          <h2>
            {Therapist[0]?.Salutation} {Therapist[0]?.Name}
          </h2>
          <BreadcrumbComponent other={"p-0"} />
        </div>
      </div>
    </div>
  );
}
export default TherapistHeader;
