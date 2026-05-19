<?php
class StatsController extends Controller
{
    public function AdminStats()
    {
        $users = $this->q("SELECT COUNT(*) c FROM users")->fetch()['c'];
        $orders = $this->q("SELECT COUNT(*) c FROM orders")->fetch()['c'];
        $restaurants = $this->q("SELECT COUNT(*) c FROM restaurants")->fetch()['c'];
        $revenue = $this->q("SELECT COALESCE(SUM(total_amount),0) c FROM orders")->fetch()['c'];
        $this->ok(['stats' => ['users'=>$users, 'orders'=>$orders, 'restaurants'=>$restaurants, 'revenue'=>$revenue]]);
    }

    public function OwnerStats()
    {
        $restaurant_id = intval($_GET['restaurant_id'] ?? 1);
        $orders = $this->q("SELECT COUNT(*) c FROM orders WHERE restaurant_id=?", [$restaurant_id])->fetch()['c'];
        $revenue = $this->q("SELECT COALESCE(SUM(total_amount),0) c FROM orders WHERE restaurant_id=?", [$restaurant_id])->fetch()['c'];
        $items = $this->q("SELECT COUNT(*) c FROM menu_items WHERE restaurant_id=? AND is_available=1", [$restaurant_id])->fetch()['c'];
        $this->ok(['stats' => ['orders'=>$orders, 'revenue'=>$revenue, 'items'=>$items]]);
    }


}
