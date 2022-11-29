import React, { useState } from 'react';

function MyReturn() {
  const [loading] = useState<any>(false);

  const renderEmpty = () => {
    // setLoading(false);
    return (
      <div className="row">
        <div className="col-12">No return data found</div>
      </div>
    );
  };

  const renderMyReturn = () => {
    return <>{renderEmpty()}</>;
  };

  return (
    <section className="tab-MyReturn animated faster fadeIn">
      <h1>My Return</h1>
      {loading ? (
        <div className="wrapper-loading">
          <div className="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      ) : (
        renderMyReturn()
      )}
    </section>
  );
}
export default MyReturn;
