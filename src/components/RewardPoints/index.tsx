import React, { useState } from 'react';

function RewardPoints() {
  const [loading] = useState<any>(false);

  const renderEmpty = () => {
    // setLoading(false);
    return (
      <div className="row">
        <div className="col-12">No reward points data found</div>
      </div>
    );
  };

  const renderRewardPoints = () => {
    return <>{renderEmpty()}</>;
  };

  return (
    <section className="tab-RewardPoints animated faster fadeIn">
      <h1>Reward Points</h1>
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
        renderRewardPoints()
      )}
    </section>
  );
}
export default RewardPoints;
