const ScreeningScoreSystem = ({Question, keyId, score,handleResponse }) => {
  const response={
    MetricID: Question.MetricID,
    QuestionNumber: Question.QuestionNumber,
    ResponseSelected: "",
    ResponseScore: null
  }
  const onHandleClick = (index) => {
    response={...response, ResponseSelected:score[index].value,ResponseScore: score[index].weight}
    handleResponse(Question.index,response)
  };
  return (
    <div className='btn-group mt-2 mt-xl-0' role='group' aria-label='Basic radio toggle button group'>
      {score.map((response, index) => {
        if (response?.value)
          return (
            <div key={index}>
              <input type='radio' className='btn-check' name={`opt${keyId}`} id={`option${keyId}-${index}`} autoComplete='off' onClick={()=>onHandleClick(index)} />
              <label className='btn btn-outline-green' htmlFor={`option${keyId}-${index}`}>
                {response?.value}
              </label>
            </div>
          );
      })}
    </div>
  );
};

export default ScreeningScoreSystem;
