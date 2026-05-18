import { useEffect, useState } from "react";
import userImg from "../../assets/user.png";
import { Check, X, X as CloseIcon } from "lucide-react";
import { api, getUser } from "../../api";
import "./RestaurantOrders.css";

function RestaurantOrders() {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);

  const currentUser = getUser();
  const restaurantId = Number(currentUser?.restaurant_id || sessionStorage.getItem("restaurantId") || 1);
  const loadOrders = () => api(`restaurant-orders&restaurant_id=${restaurantId}`).then((data) => setOrders(data.orders || [])).catch((err) => console.log(err.message));
  useEffect(() => { loadOrders(); }, [restaurantId]);
  const ordersQuantity = orders.length;

  const handleOpenDetails = (order) => { setSelectedOrder(order); setIsDetailsOpen(true); };
  const handleCloseDetails = () => { setIsDetailsOpen(false); setTimeout(() => setSelectedOrder(null), 200); };

  async function updateStatus(targetId, status) {
    await api("update-status", { method: "POST", body: JSON.stringify({ order_id: targetId, status }) });
    if (status === "received" || status === "cancelled") setOrders((prev) => prev.filter((order) => order.id !== targetId));
    else setOrders((prev) => prev.map((order) => order.id === targetId ? { ...order, state: status } : order));
    if (selectedOrder?.id === targetId && (status === "received" || status === "cancelled")) handleCloseDetails();
  }

  const renderOrderCard = (order) => (
    <div className="orders-list" key={order.id}>
      <div className="order-card"><img src={order.senderImg || userImg} alt="Customer" className="senderImg" /><p className="order-id">#{order.id}</p><div className="order-information"><h2>{order.senderName}</h2><p><strong>Payment:</strong> {order.paymentType}</p><p className="price-tag">{order.totalPrice} EGP</p></div></div>
      <div className="card-actions">
        {order.state === "pending" && <><button className="view-btn" onClick={() => handleOpenDetails(order)}>Details</button><div className="action-group"><button className="approval-btn approve" onClick={() => updateStatus(order.id, "preparing")}><Check size={18} /></button><button className="approval-btn reject" onClick={() => updateStatus(order.id, "cancelled")}><X size={18} /></button></div></>}
        {order.state === "preparing" && <><button className="view-btn" onClick={() => handleOpenDetails(order)}>Details</button><button className="ready-btn" onClick={() => updateStatus(order.id, "ready")}>Mark as Ready</button></>}
        {order.state === "ready" && <><button className="view-btn" onClick={() => handleOpenDetails(order)}>Details</button><button className="received-btn" onClick={() => updateStatus(order.id, "received")}>Mark Received</button></>}
      </div>
    </div>
  );

  return (
    <div className="active-orders-container">
      <div className="page-header"><h1>Active Orders</h1><span className="badge">Total: {ordersQuantity}</span></div>
      <div className="columns-wrapper">
        {['pending','preparing','ready'].map((status) => <div className="order-column" key={status}><h2 className={`list-name ${status}-title`}>{status[0].toUpperCase()+status.slice(1)} <span>({orders.filter(o => o.state === status).length})</span></h2><div className="list">{orders.filter((o) => o.state === status).map(renderOrderCard)}{orders.filter((o) => o.state === status).length === 0 && <p className="empty-state">No {status} orders</p>}</div></div>)}
      </div>
      <div className={`order-details-drawer ${isDetailsOpen ? "open" : ""}`}><div className="drawer-header"><h2>Order Details {selectedOrder && `#${selectedOrder.id}`}</h2><button className="close-drawer-btn" onClick={handleCloseDetails}><CloseIcon size={24} /></button></div>{selectedOrder ? <div className="drawer-content"><div className="drawer-customer-info"><img src={selectedOrder.senderImg || user} alt="" /><h3>{selectedOrder.senderName}</h3></div><div className="drawer-section"><h4>Items Ordered</h4><p className="item-row"><span>{selectedOrder.itemName}</span></p>{selectedOrder.note && <div className="order-note"><strong>Note:</strong> {selectedOrder.note}</div>}</div><div className="drawer-section"><h4>Payment Summary</h4><p><strong>Method:</strong> {selectedOrder.paymentType}</p><p className="total-price"><strong>Total:</strong> {selectedOrder.totalPrice} EGP</p></div></div> : <p className="empty-drawer">Select an order to view details</p>}</div>
      {isDetailsOpen && <div className="drawer-overlay" onClick={handleCloseDetails}></div>}
    </div>
  );
}
export default RestaurantOrders;
