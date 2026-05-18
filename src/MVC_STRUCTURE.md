# Frontend MVC Structure

The frontend is organized using Model, View, and Controller folders.

## model
Contains object-oriented JavaScript model classes that represent application data:
User, Restaurant, MenuItem, Order, Payment, Ticket, and Notification.

## controller
Contains controller classes that communicate with the backend API and coordinate actions:
AuthController, RestaurantController, MenuController, OrderController, AdminController, TicketController, and NotificationController.

## view
Contains all React screens, reusable visual components, CSS, assets, and the router. These files are responsible for rendering the interface.

The backend is also organized using MVC:
- backend/models
- backend/controllers
- backend/core router/database/response classes
