import React, { useState } from 'react';

function Transactions() {
  const [loading] = useState<any>(false);

  const renderEmpty = () => {
    // setLoading(false);
    return (
      <div className="row">
        <div className="col-12">No transaction data found</div>
      </div>
    );
  };

  const renderTransactions = () => {
    return <>{renderEmpty()}</>;
  };

  return (
    <section className="tab-Transactions animated faster fadeIn">
      <h1>Transactions</h1>
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
        renderTransactions()
      )}
    </section>
  );
}
export default Transactions;
