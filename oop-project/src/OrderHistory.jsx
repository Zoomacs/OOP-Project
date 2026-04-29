import { useEffect } from "react";
function OrderHistory({ page }) {
  useEffect(() => {
    page("orderhistory");
  }, [page]);

  return (
    <>
      <p>order</p>
    </>
  );
}

export default OrderHistory;
