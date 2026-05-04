import { useEffect, useState } from "react";
import "./RestaurantOrders.css";
import user from "./assets/user.png";
import { Check, X } from "lucide-react";

function RestaurantOrders() {
  const [orderDetails, setOrderDetails] = useState("hidden");
  const [selected, setSelected] = useState(null);

  function orderCard(order) {
    function toggleDetails() {
      orderDetails == "" ? setOrderDetails("hidden") : setOrderDetails("");
      setSelected(order);
    }
    function setRejection(targetId) {
      const updatedOrder = orders.filter((order) => order.id != targetId);
      setOrder(updatedOrder);
      setOrdersQuantity(orders.length - 1);
    }
    function setPreparing(targetId) {
      setOrder((prvOrders) =>
        prvOrders.map((order) => {
          if (order.id == targetId) {
            return { ...order, state: "preparing" };
          }
          return order;
        }),
      );
    }
    function setReady(targetId) {
      setOrder((prvOrders) =>
        prvOrders.map((order) => {
          if (order.id == targetId) {
            return { ...order, state: "ready" };
          }
          return order;
        }),
      );
    }
    function setReceived(targetId) {
      /*   setOrder((prvOrders) =>
        prvOrders.map((order) => {
          if (order.id == targetId) {
            return { ...order, state: " received" };
          }
          return order;
        }),
      ); */
      const updatedOrder = orders.filter((order) => order.id != targetId);
      setOrder(updatedOrder);
      setOrdersQuantity(orders.length - 1);
    }
    return (
      <>
        <div className="orders-list">
          <div className="order-card">
            <img
              src={order.senderImg}
              alt="sender picture"
              className="senderImg"
            />
            <p className="order-id">#{order.id + 1}</p>
            <div className="order-information">
              <h2>{order.senderName}</h2>
              <p>Payment Method: {order.paymentType}</p>
              <p>Total Price: {order.totalPrice} EGP</p>
            </div>
          </div>
          {order.state == "pending" && (
            <>
              <button className="view-btn" onClick={toggleDetails}>
                View Details
              </button>
              <button
                className="approval-btn approve"
                onClick={() => setPreparing(order.id)}
              >
                <Check />
              </button>
              <button
                className="approval-btn"
                onClick={() => setRejection(order.id)}
              >
                <X />
              </button>
            </>
          )}
          {order.state == "preparing" && (
            <>
              <button className="view-btn" onClick={toggleDetails}>
                View Details
              </button>
              <button className="ready-btn" onClick={() => setReady(order.id)}>
                Mark as Ready
              </button>
            </>
          )}
          {order.state == "ready" && (
            <>
              <p>Status: {order.receiveStatus}</p>
              <button className="view-btn" onClick={toggleDetails}>
                View Details
              </button>
              <button
                className="ready-btn"
                onClick={() => setReceived(order.id)}
              >
                Mark as Received
              </button>
            </>
          )}
        </div>
      </>
    );
  }

  useEffect(() => {
    setOrdersQuantity(orders.length);
  }, []);
  const [ordersQuantity, setOrdersQuantity] = useState(0);
  const [orders, setOrder] = useState([
    {
      id: 0,
      state: "pending",
      senderImg: user,
      senderName: "Ahmed",
      itemName: "Foul",
      Quantity: 1,
      note: "fff",
      totalPrice: 0,
      paymentType: "Cash",
      receiveStatus: "Waiting",
    },
    {
      id: 1,
      state: "preparing",
      senderImg: user,
      senderName: "Mohamed",
      totalPrice: 0,
      paymentType: "Cash",
      receiveStatus: "Waiting",
    },
    {
      id: 2,
      state: "preparing",
      senderImg: user,
      senderName: "Mohamed",
      totalPrice: 0,
      receiveStatus: "Waiting",
    },
    {
      id: 3,
      state: "ready",
      senderImg: user,
      senderName: "ss",
      totalPrice: 0,
      receiveStatus: "Waiting",
    },
    {
      id: 4,
      state: "ready",
      senderImg: user,
      senderName: "ss",
      totalPrice: 0,
      receiveStatus: "Waiting",
    },
    {
      id: 5,
      state: "ready",
      senderImg: user,
      senderName: "ss",
      totalPrice: 0,
      receiveStatus: "Waiting",
    },
    {
      id: 6,
      state: "pending",
      senderImg: user,
      senderName: "Ahmed",
      totalPrice: 0,
      paymentType: "InstaPay",
      receiveStatus: "Waiting",
    },
    {
      id: 7,
      state: "ready",
      senderImg: user,
      senderName: "ss",
      totalPrice: 0,
      receiveStatus: "Waiting",
    },
    {
      id: 8,
      state: "ready",
      senderImg: user,
      senderName: "ss",
      totalPrice: 0,
      receiveStatus: "Waiting",
    },
    {
      id: 9,
      state: "ready",
      senderImg: user,
      senderName: "ss",
      totalPrice: 0,
      receiveStatus: "Waiting",
    },
    {
      id: 10,
      state: "ready",
      senderImg: user,
      senderName: "ss",
      totalPrice: 0,
      receiveStatus: "Waiting",
    },
    {
      id: 11,
      state: "ready",
      senderImg: user,
      senderName: "ss",
      totalPrice: 0,
      receiveStatus: "Waiting",
    },
  ]);

  const pendingList = orders
    .filter((order) => order.state == "pending")
    .map((order) => <div key={order.id}>{orderCard(order)}</div>);

  const preparingList = orders
    .filter((order) => order.state == "preparing")
    .map((order) => <div key={order.id}>{orderCard(order)}</div>);

  const readyList = orders
    .filter((order) => order.state == "ready")
    .map((order) => <div key={order.id}>{orderCard(order)}</div>);

  return (
    <div className="active-orders">
      <div className="page-title">
        <h1>Active Orders</h1>
        <p>Total Orders: {ordersQuantity}</p>
      </div>
      <hr />

      <h1 className="list-name">Pending</h1>
      <div className="list">{pendingList}</div>

      <h1 className="list-name">Preparing</h1>
      <div className="list">{preparingList}</div>

      <h1 className="list-name">Ready</h1>
      <div className="list">{readyList}</div>

      <div className={`${orderDetails} order-details`}>
        <h1>Order Details</h1>
        <p> {selected != null && selected.itemName}</p>
      </div>
    </div>
  );
}
export default RestaurantOrders;
