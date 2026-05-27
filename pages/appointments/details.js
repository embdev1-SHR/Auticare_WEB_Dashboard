import { useEffect } from "react";
import { useDispatch } from "react-redux";
import DropdownComponent from "../../components/shared/dropdown";
import Layout from "../../components/shared/layout";
import Loader from "../../components/shared/loader";
import PageTitle from "../../components/shared/pagetitle";
import Search from "../../components/shared/search";
import { DetailAppointmentsList } from "../../components/therapist-component/appointments/detailAppointmentsList.component";
import { changeBreadcrumb, changeTitle } from "../../store/slice/layout.slice";

function Details() {
    const dispatch = useDispatch();
    useEffect(() => {
        const breadcrumb_Items = [
            { title: "Dashboard", link: "dashboard" },
            { title: "Appointments", link: "appointments" },
        ];
        dispatch(changeTitle("Appointments Details"));
        dispatch(changeBreadcrumb(breadcrumb_Items));
    }, [dispatch]);

    return (
        <Layout>
            <div className='page-content'>
                <PageTitle />
                {false ? (
                    <Loader />
                ) : (
                    <div className='main_listing'>
                        <div className='tab_data_header'>
                            <div className='tab_actions'>
                                {/* Search To Handle Search function */}
                                <Search />
                                {/* Export DropDown To Handle Download The data as Different Formats*/}
                                <DropdownComponent color={"secondary"} name={"Export"} items={["Excel", "CSV", "JSON", "XML"]} names={"Appointments"} />
                            </div>
                        </div>
                        {/* patient Details list Table To Handle patient Details */}
                        <DetailAppointmentsList />
                    </div>
                )}
            </div>
        </Layout>
    );
};


export default Details