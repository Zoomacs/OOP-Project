import { useState, useEffect } from "react";
import "./Notification.css";
import kfclogo from "./assets/kfc-logo.png";

const  NotificationCard =({image,title,discreption,time})=>(
  <div className="notification-card">
    <div className="card-img">
      <img src={image}/>
    </div>
    <div className="card-componants">
      <p className="card-text">
        <span className="card-title">{title}</span>
        <span className="card-discreption">{discreption}</span>
      </p>
      <span className="card-time">{time}</span>
    </div>
  </div>
);


function Notification({ page }) {
   useEffect(() => {
    page("notification"); 
  }, [page]);
  const data = [
    { id: 1, title: "test", discreption: "test test testtest teeafnwjenfjenfe", time: "test", image: "" },
    { id: 2, title: "KFC", discreption: "Your meal is ready for pickup!", time: "Just now", image: kfclogo },
  ];
  return (
    <>
      <div className="page-container">
        <div className="notifiaction-place">
          <div className="notfication-head">
            <h1>Notification</h1>
          </div>
          <div className="cards-list">
            {data.map((item) => (
            <NotificationCard 
              key={item.id}
              image={item.image}
              title={item.title}
              discreption={item.discreption}
              time={item.time}
            />
          ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Notification;
