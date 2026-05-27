import { useState, useEffect } from "react";
import { Button, Card, CardBody, CardHeader, Collapse, Row, Table } from "reactstrap";
import { setViewUpdateModal, setUpdateData } from "../../store/slice/scale.slice";
import { useDispatch } from "react-redux";

const Accordion = ({ title, content, setAlert, setCheck, setMetricId, hide }) => {

  const data = content.Score.filter((data) => data.weight != 0)
  const [isActive, setIsActive] = useState(!isActive);

  const dispatch = useDispatch();
  const toggle_col = () => {
    setIsActive(!isActive);
  };

  useEffect(() => {
    setIsActive(false);
  }, [title, content])

  const onEdit = () => {
    dispatch(setViewUpdateModal(true))
    dispatch(setUpdateData(content))
  }

  return (
    <Card className='mb-1 shadow-none'>
      <a onClick={toggle_col} style={{ cursor: "pointer" }} className='text-dark'>
        <CardHeader id={`heading${title}`}>
          <h6 className='m-0 font-14'>
            <span className='pl-2'>{title}</span>
            <i className={isActive ? "mdi mdi-minus float-end accor-plus-icon" : "mdi mdi-plus float-end accor-plus-icon"}></i>
          </h6>
        </CardHeader>
      </a>
      <Collapse isOpen={isActive}>
        <CardBody>
          <Row>
            <Table borderless>
              <tbody>
                {data.map((e, i) => {
                  return (
                    <tr key={i}>
                      <td>{e.value}</td>
                      <td>{e.weight}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            {/* TODO: Complete Edit Question */}
            {hide && <div className='text-center'>
              <> <Button onClick={onEdit} color='primary'>Edit Question</Button>
                <Button onClick={() => { setAlert(true), setCheck(true), setMetricId(content.MetricID) }} color='danger' style={{ marginLeft: "30px" }}>Delete</Button></></div>}
          </Row>
        </CardBody>
      </Collapse>
    </Card>
  );
};

export default Accordion;
