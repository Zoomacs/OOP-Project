export const users = [
  { name: "Ahmed Hassan", email: "ahmed@mail.com", type: "Student", status: "Active", orders: 18, spent: "420 EGP" },
  { name: "Mona Adel", email: "mona@mail.com", type: "Customer", status: "Active", orders: 9, spent: "210 EGP" },
  { name: "Karim Mostafa", email: "karim@mail.com", type: "Restaurant Owner", status: "Review", orders: 3, spent: "64 EGP" },
  { name: "Youssef Ali", email: "youssef@mail.com", type: "Student", status: "Active", orders: 21, spent: "560 EGP" }
];

export const orders = [
  { id: "#ORD-9012", restaurant: "Pizza Flame", customer: "Ahmed", total: "245 EGP", status: "Preparing" },
  { id: "#ORD-9013", restaurant: "Sushi Bar", customer: "Mona", total: "410 EGP", status: "Delivery" },
  { id: "#ORD-9014", restaurant: "Burger House", customer: "Karim", total: "182 EGP", status: "Delivered" },
  { id: "#ORD-9015", restaurant: "Pasta Point", customer: "Youssef", total: "315 EGP", status: "Cancelled" }
];

export const transactions = [
  { id: "#TRX-3001", date: "Today", user: "Ahmed", restaurant: "Pizza Flame", amount: "245 EGP", status: "Success" },
  { id: "#TRX-3002", date: "Today", user: "Mona", restaurant: "Sushi Bar", amount: "410 EGP", status: "Pending" },
  { id: "#TRX-3003", date: "Yesterday", user: "Karim", restaurant: "Burger House", amount: "182 EGP", status: "Failed" },
  { id: "#TRX-3004", date: "Yesterday", user: "Youssef", restaurant: "Pasta Point", amount: "315 EGP", status: "Success" }
];

export const tickets = [
  { id: "#TCK-501", title: "Late order complaint", email: "ahmed@mail.com", text: "Customer says order is 30 minutes late.", status: "Urgent" },
  { id: "#TCK-502", title: "Refund request", email: "mona@mail.com", text: "Payment completed but restaurant rejected order.", status: "Pending" },
  { id: "#TCK-503", title: "Restaurant login issue", email: "owner@mail.com", text: "Owner cannot access dashboard.", status: "Open" }
];
