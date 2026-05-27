
import { Label } from "reactstrap";

import DropZoneForm from "../shared/dropzoneform";

function VendorDocuments() {
  return (
    <div>
      <div className="mb-4">
        <Label className="form-label required">Incorporation certificate</Label>
        <DropZoneForm />
      </div>
      <div className="mb-4">
        <Label className="form-label required">Registration certificate</Label>
        <DropZoneForm />
      </div>
    </div>
  );
}
export default VendorDocuments;
