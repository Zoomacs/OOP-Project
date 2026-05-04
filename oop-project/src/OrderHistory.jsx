import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./OrderHistory.css";
import kfclogo from "./assets/kfc-logo.png";


const  OrderCard =({image,title,description,time,points,onViewDetails})=>(
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
        <div className="card-actions">
          <button className="details-btn" onClick={onViewDetails}>Details</button>
        </div>
      </div>
    </div>
      <div className="card-points">
        <p className="card-points">+{points} Points</p>
      </div>
  </div>
);


function OrderHistory({ page }) {
   const navigate = useNavigate();
   useEffect(() => {page("orderhistory"); }, [page]);

   const [sortBy, setSortBy] = useState("date");
   const [sortedData, setSortedData] = useState([]);

  const data = [
    { id: 1, title: "KFC", description: "2X Mighty Zinger", time: "April 29, 2026, 4:15 PM", dateStr: "2026-04-29T16:15:00", rating: 5.0, points: 50, image: kfclogo, 
      items: [{ name: "Mighty Zinger", variant: "Spicy", qty: 2, price: 8.50 }] 
    },
    { id: 2, title: "KFC", description: "3X Rizo (Spicy)", time: "April 28, 2026, 6:00 PM", dateStr: "2026-04-28T18:00:00", rating: 4.2, points: 30, image: kfclogo,
      items: [{ name: "Rizo", variant: "Spicy", qty: 3, price: 4.25 }] 
    },
    { id: 3, title: "KFC", description: "Family Bucket", time: "April 27, 2026, 7:30 PM", dateStr: "2026-04-27T19:30:00", rating: 4.9, points: 120, image: kfclogo,
      items: [
        { name: "Original Recipe Chicken", variant: "15 Pcs", qty: 1, price: 24.99 }, 
        { name: "Family Fries", variant: "Large", qty: 1, price: 5.50 }, 
        { name: "Coleslaw", variant: "Large", qty: 1, price: 4.00 }
      ] 
    },
    { id: 4, title: "KFC", description: "1X Twister Combo", time: "April 26, 2026, 1:15 PM", dateStr: "2026-04-26T13:15:00", rating: 3.8, points: 25, image: kfclogo,
      items: [
        { name: "Twister Wrap", variant: "Regular", qty: 1, price: 6.00 }, 
        { name: "Fries", variant: "Medium", qty: 1, price: 2.50 }, 
        { name: "Cola", variant: "Medium", qty: 1, price: 1.50 }
      ] 
    },
    { id: 5, title: "KFC", description: "Spicy Fries Large", time: "April 25, 2026, 5:45 PM", dateStr: "2026-04-25T17:45:00", rating: 4.6, points: 15, image: kfclogo,
      items: [{ name: "Spicy Fries", variant: "Large", qty: 1, price: 3.50 }] 
    },
    { id: 6, title: "Fresh Greens", description: "Chicken Caesar Salad", time: "April 24, 2026, 12:45 PM", dateStr: "2026-04-24T12:45:00", rating: 4.1, points: 25, image: kfclogo,
      items: [{ name: "Chicken Caesar Salad", variant: "With Extra Dressing", qty: 1, price: 9.00 }] 
    },
    { id: 7, title: "KFC", description: "Family Bucket, 2X Fries", time: "April 22, 2026, 7:00 PM", dateStr: "2026-04-22T19:00:00", rating: 4.7, points: 120, image: kfclogo,
      items: [{ name: "Original Recipe Chicken", variant: "15 Pcs", qty: 1, price: 24.99 }, { name: "Fries", variant: "Medium", qty: 2, price: 2.50 }] 
    }
  ];

  useEffect(() => {
    const dataToSort = [...data];
    
    dataToSort.sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.dateStr) - new Date(a.dateStr);
      } else if (sortBy === "rating") {
        return b.rating - a.rating;
      }
      return 0;
    });

    setSortedData(dataToSort);
  }, [sortBy]);

  return (
    <>
     <div className="oh-page-container">
        <div className="order-place">
          <div className="order-head">
            <div className="order-head-title">
               <h1>Your Past Orders</h1>
               <span className="total-badge">24 TOTAL ORDERS</span>
            </div>
           <p className="order-head-desc">
              Manage and track your recent campus dining activities. Use the compact view to scan your frequency.
            </p>
          </div>
          <div className="order-filters">
            <button 
              className={sortBy === "date" ? "active" : ""} 
              onClick={() => setSortBy("date")}
            >
              Sort by Date
            </button>
            <button 
              className={sortBy === "rating" ? "active" : ""} 
              onClick={() => setSortBy("rating")}
            >
              Sort by Rating
            </button>
          </div>
          <div className="cards-list">
            {sortedData.map((item) => (
            <OrderCard 
              key={item.id}
              image={item.image}
              title={item.title}
              description={item.description}
              time={item.time}
              points={item.points}
              onViewDetails={() => navigate("/ordertrack", { state: { orderData: item } })}
            />
          ))}
          </div>
        </div>
      </div>

    </>
  );
}

export default OrderHistory;
