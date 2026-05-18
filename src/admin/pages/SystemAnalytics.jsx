import { PageHeader, Card, StatCard } from "../components/UI";

import "./SystemAnalytics.css";
export default function SystemAnalytics() {
  const bars = ["45%", "70%", "55%", "90%", "65%", "80%", "95%"];

  return (
    <>
      <PageHeader title="System Analytics" subtitle="Restaurant website performance and growth." />

      <div className="grid">
        <StatCard title="Visits" value="88K" badge="+21%" badgeClass="green" />
        <StatCard title="Conversion" value="12.4%" badge="Strong" badgeClass="gold" />
        <StatCard title="Avg Order" value="276 EGP" badge="Food sales" badgeClass="blue" />
        <StatCard title="Rating" value="4.8" badge="Excellent" badgeClass="green" />
      </div>

      <div style={{ marginTop: 20 }}>
        <Card>
          <h3>Weekly Orders</h3>
          <div className="chart">
            {bars.map((height, index) => <div key={index} className="bar" style={{ height }} />)}
          </div>
        </Card>
      </div>
    </>
  );
}
