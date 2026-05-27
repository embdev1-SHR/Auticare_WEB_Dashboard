import moment from "moment";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { fetchAllStoreList } from "../../store/slice/store.slice";
import ReactTable from "../shared/react-table";
import EnquiryActions from "./enquiry-actions.component";

const EnquiryList = () => {

  const data = useSelector(fetchAllStoreList);
  function createFormatDate(date) {
    return moment(new Date(date)).locale("en-in").format("MM/DD/YYYY");
  }


  const columns = useMemo(
    () => [
      {
        Header: "SL.No",
        accessor: (row, index) => index + 1,
      },
      {
        Header: "Enquiry ID",
        accessor: "StoreEnquiryID",
        sortType: "string",
      },
      {
        Header: "Enquiry",
        accessor: "Enquiry",
      },
      {
        Header: "Product",
        accessor: "ProductName",
      },
      {
        Header: "Date",
        accessor: (row) => {
          return (
            <>
              { createFormatDate(row.Create_TS)}
            </>
          );
        },
      },
      {
        Header: "Name",
        accessor: "Name",
      },
      {
        Header: "Viewed",
        accessor: "IsAdminViewed",
        Cell: ({ row }) => {
          return (row.original.IsAdminViewed == 0 ? "No" : "Yes")
        }
      },
      {
        Header: "",
        id: "Actions",
        accessor: (e) => {
        return <EnquiryActions  StoreEnquiryID={e.StoreEnquiryID} />},
      },
    ],
    []
  );
  return <ReactTable columns={columns} data={data} />;
};

export default EnquiryList;
