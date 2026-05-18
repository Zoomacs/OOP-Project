<?php
class Router
{
    private $route;
    private $method;
    private $data;
    private $view;

    public function __construct($route, $method, $data)
    {
        $this->route = $route;
        $this->method = $method;
        $this->data = $data;
        $this->view = new ErrorView();
    }

    public function dispatch()
    {
        if ($this->route === 'login' && $this->method === 'POST') return (new AuthController())->login($this->data);
        if ($this->route === 'register' && $this->method === 'POST') return (new AuthController())->register($this->data);

        if ($this->route === 'users') {
            $c = new UserController();
            if ($this->method === 'GET') return $c->index();
            if ($this->method === 'POST') return $c->store($this->data);
            if ($this->method === 'PUT') return $c->update($this->data);
            if ($this->method === 'DELETE') return $c->destroy($this->data);
        }
        if ($this->route === 'ban-user' && $this->method === 'POST') return (new UserController())->ban($this->data);

        if ($this->route === 'restaurants') {
            $c = new RestaurantController();
            if ($this->method === 'GET') return $c->index();
            if ($this->method === 'POST') return $c->store($this->data);
            if ($this->method === 'PUT') return $c->update($this->data);
            if ($this->method === 'DELETE') return $c->destroy($this->data);
        }

        if ($this->route === 'menu') {
            $c = new MenuController();
            if ($this->method === 'GET') return $c->index();
            if ($this->method === 'POST') return $c->store($this->data);
            if ($this->method === 'PUT') return $c->update($this->data);
            if ($this->method === 'DELETE') return $c->destroy($this->data);
        }

        if ($this->route === 'orders') {
            $c = new OrderController();
            if ($this->method === 'GET') return $c->index();
            if ($this->method === 'POST') return $c->store($this->data);
            if ($this->method === 'PUT') return $c->update($this->data);
            if ($this->method === 'DELETE') return $c->destroy($this->data);
        }
        if ($this->route === 'restaurant-orders' && $this->method === 'GET') return (new OrderController())->restaurantOrders();
        if ($this->route === 'update-status' && $this->method === 'POST') return (new OrderController())->updateStatus($this->data);
        if ($this->route === 'order-track' && $this->method === 'GET') return (new OrderController())->track();

        if ($this->route === 'payments' || $this->route === 'transactions') {
            $c = new PaymentController();
            if ($this->method === 'GET') return $c->index();
            if ($this->method === 'POST') return $c->store($this->data);
            if ($this->method === 'PUT') return $c->update($this->data);
            if ($this->method === 'DELETE') return $c->destroy($this->data);
        }

        if ($this->route === 'tickets') {
            $c = new TicketController();
            if ($this->method === 'GET') return $c->index();
            if ($this->method === 'POST') return $c->store($this->data);
            if ($this->method === 'PUT') return $c->update($this->data);
            if ($this->method === 'DELETE') return $c->destroy($this->data);
        }

        if ($this->route === 'notifications') {
            $c = new NotificationController();
            if ($this->method === 'GET') return $c->index();
            if ($this->method === 'DELETE') return $c->destroy($this->data);
        }

        if ($this->route === 'dashboard' || $this->route === 'admin-stats') return (new StatsController())->adminStats();
        if ($this->route === 'owner-stats' && $this->method === 'GET') return (new StatsController())->ownerStats();

        $this->view->notFound('Route not found');
    }
}
