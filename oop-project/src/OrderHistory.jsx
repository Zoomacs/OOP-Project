import {  useEffect } from "react";
import "./OrderHistory.css";
import kfclogo from "./assets/kfc-logo.png";


const  OrderCard =({image,title,description,time})=>(
  <div className="Order-card">
    <div className="card-img">
      {<img src={image}/>}
    </div>
    <div className="card-content">
      <div className="card-header">
        <h2 className="card-title">{title}</h2>
      </div>
      <div className="card-details">
        <p className="card-description">{description}</p>
        <p className="card-time">{time}</p>
      </div>
    </div>
  </div>
);


function OrderHistory({ page }) {
   useEffect(() => {page("orderhistory"); }, [page]);
   const data = [
    { id: 1, title: "KFC", description: "2X  Mighty Zinger", time: "April 29, 2026, at 4:15 PM", image: kfclogo },
    { id: 2, title: "KFC", description: "3X Rizo (Spicy)", time: "April 27, 2026, at 6:07 PM", image: kfclogo }
  ];
  return (
    <>
     
     <div className="page-container">
        <div className="order-place">
          <div className="order-head">
            <h1>Your Orders</h1>
          </div>
          <div className="cards-list">
            {data.map((item) => (
            <OrderCard 
              key={item.id}
              image={item.image}
              title={item.title}
              description={item.description}
              time={item.time}
            />
          ))}
          </div>
        </div>
      </div>

    </>
  );
}

export default OrderHistory;
