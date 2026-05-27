import React, { useEffect, useState } from 'react'
import { Row, Col, Label, Input, Button } from "reactstrap";
import { BehaviourList } from '../../../../store/slice/patient.slice';
import { useDispatch } from 'react-redux';


function AddField() {
    const [inputList, setInputList] = useState([""]);
const [INValue, setINValue]=useState("")
    console.log("inputList",inputList);
    const dispatch = useDispatch();

    // TODO: dispatch issue

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...inputList];
        list[index] = value;
        setInputList(list);
    };

    const handleRemoveClick = index => {
        const list = [...inputList];
        list.splice(index, 1);
        dispatch(BehaviourList(list));
        setInputList(list);
    };

    const handleAddClick = () => {
        dispatch(BehaviourList(inputList));
        setINValue("")
        // setInputList([...inputList, ""]);
    };

    // useEffect(() => {
    //     // dispatch(mandList(inputList));
    // }, [inputList]);

    return (
        <>
            <div >
                {inputList.map((x, i) => {
                    return (

                        <Row key={i}>
                            <Col md='8'>
                                <div className='mb-4'>
                                    <Label className='form-label required' htmlFor='Behaviour'>
                                    Behaviour Name
                                    </Label>
                                    <input
                                        type='text'
                                        className='form-control'
                                        value={INValue}
                                        onChange={e => {handleInputChange(e, i);
                                            setINValue(e.target.value)}}
                                    />
                                </div>
                            </Col>
                            <Col md='1 text-center'>
                                {/* <div className='mb-4'>
                                    {inputList.length !== 1 && <Button onClick={() => handleRemoveClick(i)} style={{ position: "absolute", top: "25%", left: "15%", borderRadius: "50%" }} color='danger'>
                                        <i className='mdi mdi-trash-can'></i>
                                    </Button>}
                                </div> */}
                                <div className='mb-4'>
                                    {inputList.length - 1 === i && <Button onClick={handleAddClick} style={{ position: "absolute", top: "25%", left: "65%", borderRadius: "50%" }} color='success'>
                                        <i className='mdi mdi-plus-thick'></i>
                                    </Button>}
                                </div>
                            </Col>
                        </Row>

                    );
                })}
            </div>
        </>
    );
}

export default AddField