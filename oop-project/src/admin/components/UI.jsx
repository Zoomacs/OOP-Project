import "./UI.css";

export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="topbar">
      <div>
        <h1>{title}</h1>
        <p className="subtitle">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

export function Card({ children, className = "" }) {
  return <div className={`card ${className}`}>{children}</div>;
}

export function StatCard({ title, value, badge, badgeClass = "" }) {
  return (
    <Card>
      <h3>{title}</h3>
      <div className="big">{value}</div>
      {badge && <span className={`badge ${badgeClass}`}>{badge}</span>}
    </Card>
  );
}

export function Badge({ children, type = "" }) {
  return <span className={`badge ${type}`}>{children}</span>;
}

export function notify(message) {
  alert(message);
}
