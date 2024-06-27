import React from "react";

const StoreDetail = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <div>testestes{params.id}</div>
    </div>
  );
};

export default StoreDetail;
