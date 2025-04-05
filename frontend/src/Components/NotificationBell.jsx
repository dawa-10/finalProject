// /frontend/src/components/NotificationBell.js
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "../Styles/NotificationBell.css";

const socket = io("http://localhost:3000");

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.on("tournamentUpdate", (data) => {
      // You can compare data with a stored state if needed, or simply notify:
      alert(`New ${data.type} tournaments are available!`);
      setNotifications((prev) => [{ message: `New ${data.type} tournaments available!` }, ...prev]);
    });
    return () => {
      socket.off("tournamentUpdate");
    };
  }, []);
  

  return (
    <div className="notification-bell">
      <span role="img" aria-label="bell">🔔</span>
      {notifications.length > 0 && (
        <div className="notification-dropdown">
          {notifications.map((note, index) => (
            <div key={index} className="notification-item">{note.message}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
