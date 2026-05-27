

const ScreeningScoreSystem = ({ id }) => {
  return (
    <>

      <div className="btn-group mt-2 mt-xl-0" role="group" aria-label="Basic radio toggle button group">
        <input type="radio" className="btn-check" name={`opt${id}`} id={`option${id}1`} autoComplete="off" />
        <label className="btn btn-outline-green" htmlFor={`option${id}1`} style={{ borderTopLeftRadius: " 0.25rem", borderBottomLeftRadius: " 0.25rem" }}>
          Rarely
        </label>

        <input type="radio" className="btn-check" name={`opt${id}`} id={`option${id}2`} autoComplete="off" />
        <label className="btn btn-outline-green" htmlFor={`option${id}2`}>
          Sometimes
        </label>

        <input type="radio" className="btn-check" name={`opt${id}`} id={`option${id}3`} autoComplete="off" />
        <label className="btn btn-outline-green" htmlFor={`option${id}3`}>
          Frequently
        </label>

        <input type="radio" className="btn-check" name={`opt${id}`} id={`option${id}4`} autoComplete="off" />
        <label className="btn btn-outline-green" htmlFor={`option${id}4`}>
          Mostly
        </label>

        <input type="radio" className="btn-check" name={`opt${id}`} id={`option${id}5`} autoComplete="off" />
        <label className="btn btn-outline-green" htmlFor={`option${id}5`}>
          Always
        </label>
      </div>
    </>
  );
};

export default ScreeningScoreSystem;
