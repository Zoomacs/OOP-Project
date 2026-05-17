import { useState } from "react";
import "./RestaurantOrders.css";
import user from "./assets/user.png";
import { Check, X, X as CloseIcon } from "lucide-react";

function RestaurantOrders() {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [orders, setOrders] = useState([
    { id: 0, state: "pending", senderImg: user, senderName: "Ahmed", itemName: "Foul & Falafel", quantity: 2, note: "Extra spicy", totalPrice: 45, paymentType: "Cash", receiveStatus: "Waiting" },
    { id: 1, state: "preparing", senderImg: user, senderName: "Mohamed", itemName: "Beef Burger", quantity: 1, note: "No onions", totalPrice: 120, paymentType: "Credit Card", receiveStatus: "Waiting" },
    { id: 2, state: "preparing", senderImg: user, senderName: "Sarah", itemName: "Pizza Margherita", quantity: 1, note: "", totalPrice: 150, paymentType: "InstaPay", receiveStatus: "Waiting" },
    { id: 3, state: "ready", senderImg: user, senderName: "Khaled", itemName: "Chicken Shawarma", quantity: 3, note: "Extra garlic sauce", totalPrice: 180, paymentType: "Cash", receiveStatus: "Waiting" },
    { id: 6, state: "pending", senderImg: user, senderName: "Omar", itemName: "Pasta Alfredo", quantity: 1, note: "", totalPrice: 110, paymentType: "InstaPay", receiveStatus: "Waiting" },
    { id: 7, state: "ready", senderImg: user, senderName: "Laila", itemName: "Caesar Salad", quantity: 1, note: "Dressing on the side", totalPrice: 85, paymentType: "Credit Card", receiveStatus: "Waiting" }
  ]);

  const ordersQuantity = orders.length;

  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setTimeout(() => setSelectedOrder(null), 200); 
  };

  const handleReject = (targetId) => {
    setOrders(orders.filter((order) => order.id !== targetId));
    if (selectedOrder?.id === targetId) handleCloseDetails();
  };

  const handleApprove = (targetId) => {
    setOrders((prev) => prev.map((order) => order.id === targetId ? { ...order, state: "preparing" } : order));
  };

  const handleReady = (targetId) => {
    setOrders((prev) => prev.map((order) => order.id === targetId ? { ...order, state: "ready" } : order));
  };

  const handleReceived = (targetId) => {
    setOrders(orders.filter((order) => order.id !== targetId));
    if (selectedOrder?.id === targetId) handleCloseDetails();
  };

  const renderOrderCard = (order) => (
    <div className="orders-list" key={order.id}>
      <div className="order-card">
        <img src={order.senderImg || user} alt="Customer" className="senderImg" />
        <p className="order-id">#{order.id}</p>
        <div className="order-information">
          <h2>{order.senderName}</h2>
          <p><strong>Payment:</strong> {order.paymentType}</p>
          <p className="price-tag">{order.totalPrice} EGP</p>
        </div>
      </div>
      
      <div className="card-actions">
        {order.state === "pending" && (
          <>
            <button className="view-btn" onClick={() => handleOpenDetails(order)}>Details</button>
            <div className="action-group">
              <button className="approval-btn approve" onClick={() => handleApprove(order.id)}>
                <Check size={18} />
              </button>
              <button className="approval-btn reject" onClick={() => handleReject(order.id)}>
                <X size={18} />
              </button>
            </div>
          </>
        )}
        {order.state === "preparing" && (
          <>
            <button className="view-btn" onClick={() => handleOpenDetails(order)}>Details</button>
            <button className="ready-btn" onClick={() => handleReady(order.id)}>Mark as Ready</button>
          </>
        )}
        {order.state === "ready" && (
          <>
            <button className="view-btn" onClick={() => handleOpenDetails(order)}>Details</button>
            <button className="received-btn" onClick={() => handleReceived(order.id)}>Mark Received</button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="active-orders-container">
      <div className="page-header">
        <h1>Active Orders</h1>
        <span className="badge">Total: {ordersQuantity}</span>
      </div>

      <div className="columns-wrapper">
        <div className="order-column">
          <h2 className="list-name pending-title">Pending <span>({orders.filter(o => o.state === "pending").length})</span></h2>
          <div className="list">
            {orders.filter((o) => o.state === "pending").map(renderOrderCard)}
            {orders.filter((o) => o.state === "pending").length === 0 && <p className="empty-state">No pending orders</p>}
          </div>
        </div>

        <div className="order-column">
          <h2 className="list-name preparing-title">Preparing <span>({orders.filter(o => o.state === "preparing").length})</span></h2>
          <div className="list">
            {orders.filter((o) => o.state === "preparing").map(renderOrderCard)}
            {orders.filter((o) => o.state === "preparing").length === 0 && <p className="empty-state">No orders in preparation</p>}
          </div>
        </div>

        <div className="order-column">
          <h2 className="list-name ready-title">Ready <span>({orders.filter(o => o.state === "ready").length})</span></h2>
          <div className="list">
            {orders.filter((o) => o.state === "ready").map(renderOrderCard)}
            {orders.filter((o) => o.state === "ready").length === 0 && <p className="empty-state">No ready orders</p>}
          </div>
        </div>
      </div>

      <div className={`order-details-drawer ${isDetailsOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <h2>Order Details {selectedOrder && `#${selectedOrder.id}`}</h2>
          <button className="close-drawer-btn" onClick={handleCloseDetails}>
            <CloseIcon size={24} />
          </button>
        </div>
        
        {selectedOrder ? (
          <div className="drawer-content">
            <div className="drawer-customer-info">
               <img src={selectedOrder.senderImg || user} alt="" />
               <h3>{selectedOrder.senderName}</h3>
            </div>
            
            <div className="drawer-section">
              <h4>Items Ordered</h4>
              <p className="item-row">
                <span>{selectedOrder.quantity}x {selectedOrder.itemName}</span>
              </p>
              {selectedOrder.note && (
                <div className="order-note">
                  <strong>Note:</strong> {selectedOrder.note}
                </div>
              )}
            </div>

            <div className="drawer-section">
              <h4>Payment Summary</h4>
              <p><strong>Method:</strong> {selectedOrder.paymentType}</p>
              <p className="total-price"><strong>Total:</strong> {selectedOrder.totalPrice} EGP</p>
            </div>
          </div>
        ) : (
          <p className="empty-drawer">Select an order to view details</p>
        )}
      </div>

      {isDetailsOpen && <div className="drawer-overlay" onClick={handleCloseDetails}></div>}
    </div>
  );
}

export default RestaurantOrders;