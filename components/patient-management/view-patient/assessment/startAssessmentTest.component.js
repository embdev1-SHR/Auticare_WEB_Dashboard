import moment from "moment";
import { Fragment, useState } from "react";
import AssessmentQuestionInformations from "./assessmentQuestionInfo.component";
import { useEffect } from "react";

const StartAssessmentTest = ({ Tab, AssessmentQuestions, color, handleShowColorDate, date, handleResponse, isSelected, handleRemoveResponse }) => {

  // console.log("AssessmentQuestions",AssessmentQuestions);
  //   useEffect(() => {
  //     AssessmentQuestions?.map((Question, key) => {
  //       let InputsArr = [];
  //       const sortedResponse = Question.Response?.sort((a, b) => b.ResponseID - a.ResponseID);
  //       for (let i = 0; i < Question.NumberOfScore; i++) {
  //         let response = sortedResponse?.find((obj) => {
  //           console.log("response",response);
  //           return obj.ScoreNumber === i + 1;
  //         });
  //       }
  //     })
  //   }, [AssessmentQuestions]);


  const handleScore = (Question, e) => {
    const checkedList = [];
    if (isSelected) {
      e.target.parentNode.childNodes.forEach((element) => {
        if (element.nodeName === "INPUT") {
          if (element.checked && element.value != Number(e.target.value)) {

            checkedList.push(element.value);
          }
        }
      })
      e.target.parentNode.childNodes.forEach((element) => {
        if (element.nodeName === "INPUT") {
          if (element.value === e.target.value) {
            const response = {
              MetricID: Question.MetricID,
              QuestionNumber: Question.QuestionNumber,
              ScoreNumber: Number(element.value),
              NumberOfScore: Question.NumberOfScore,
              Colour: color,
              Date: moment(new Date(date)).locale("en-in").format("MM/DD/YYYY"),
            };
            if (!element.checked) {
              element.checked = false;
              element.nextSibling.style.background = "#ffffff";
            } 
            !checkedList.includes(element.value) ? handleRemoveResponse(response) : null;
          }
        }
      });
      handleShowColorDate();
    }

    else {
      e.target.parentNode.childNodes.forEach((element) => {
        if (element.nodeName === "INPUT") {
          if (element.checked && element.value != Number(e.target.value)) {
            checkedList.push(element.value);
          }
        }
      })
      e.target.parentNode.childNodes.forEach((element) => {
        if (element.nodeName === "INPUT") {
          if (element.value <= e.target.value) {
            const response = {
              MetricID: Question.MetricID,
              QuestionNumber: Question.QuestionNumber,
              ScoreNumber: Number(element.value),
              NumberOfScore: Question.NumberOfScore,
              Colour: color,
              Date: moment(new Date(date)).locale("en-in").format("MM/DD/YYYY"),
            };

            if (!element.checked) {
              element.checked = true;
              // handleResponse(response);
              element.nextSibling.style.background = color;
            } else {
              if (e.target.nextSibling.style.background === "" || "#ffffff" ) {
                e.target.nextSibling.style.background = color;
                // handleResponse(response);
              }
            }
            !checkedList.includes(element.value) ? handleResponse(response) : null;
          }
        }
      });
      handleShowColorDate();
    }
  };

  return (
    <table className='table table-bordered dt-responsive nowrap hide_length' style={{ borderCollapse: "collapse", borderSpacing: 0, width: "100%" }}>
      <thead>
        <tr>
          <th>Q.No</th>
          <th>Assessment Name</th>
          <th>Score</th>
        </tr>
      </thead>

      <tbody>

        {AssessmentQuestions?.map((Question, key) => {
          let InputsArr = [];

          const sortedResponse = Question.Response?.sort((a, b) => b.ResponseID - a.ResponseID);
          for (let i = 0; i < Question.NumberOfScore; i++) {
            let response = sortedResponse?.find((obj) => {
              return obj.ScoreNumber === i + 1;
            });

            if (response?.Colour) {
              InputsArr.push(
                <Fragment key={i}>
                  <input
                    type='checkbox'
                    className='btn-check'
                    id={`btncheck${Tab}-${Question.CategoryID}-${Question.QuestionNumber}-${i}`}
                    autoComplete='off'
                    value={i + 1}
                    defaultChecked
                    style={{ background: response?.Colour }}
                    disabled={true}
                  />
                  <label className='btn' style={{ background: response?.Colour }} htmlFor={`btncheck${Tab}-${Question.CategoryID}-${Question.QuestionNumber}-${i}`}></label>
                </Fragment>
              );
            }

            else {
              InputsArr.push(
                <Fragment key={i} >
                  <input onChange={(e) => { handleScore(Question, e), Question.CategoryID }} type='checkbox' className='btn-check' key={i} id={`btncheck${Tab}-${Question.CategoryID}-${Question.QuestionNumber}-${i}`} autoComplete='off' value={i + 1} />
                  <label className='btn' htmlFor={`btncheck${Tab}-${Question.CategoryID}-${Question.QuestionNumber}-${i}`}></label>
                </Fragment>
              );
            }
          }
          return (
            <tr key={key}>
              <td>
                {Question.CategoryLabel}{key + 1}
                <AssessmentQuestionInformations data={Question} />
              </td>
              <td>{Question.Question}</td>
              <td>
                <div className='btn-group btn-group-sm score-group' role='group' aria-label='Basic checkbox toggle button group'>
                  {InputsArr}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default StartAssessmentTest;