<?php

interface AppObserver
{
    public function update($event, $payload, $context);
}

class AppEventSubject
{
    private $observers = [];

    public function attach(AppObserver $observer)
    {
        $this->observers[] = $observer;
    }

    public function notify($event, $payload, $context = [])
    {
        foreach ($this->observers as $observer) {
            $observer->update($event, $payload, $context);
        }
    }
}

class DatabaseNotificationObserver implements AppObserver
{
    public function update($event, $payload, $context)
    {
        if (!isset($context['query']) || !is_callable($context['query'])) return;

        $userId = intval($payload['user_id'] ?? 0);
        if ($userId <= 0) return;

        $title = $this->titleFor($event, $payload);
        $description = $this->descriptionFor($event, $payload);

        call_user_func(
            $context['query'],
            "INSERT INTO notifications (user_id,title,description,image_url) VALUES (?,?,?, '')",
            [$userId, $title, $description]
        );
    }

    private function titleFor($event, $payload)
    {
        if ($event === 'order.created') return 'Order placed';
        if ($event === 'order.received') return 'New order';
        if ($event === 'order.status_updated') return 'Order update';
        if ($event === 'payment.created') return 'Payment created';
        if ($event === 'menu.created') return 'Menu item added';
        if ($event === 'menu.updated') return 'Menu item updated';
        if ($event === 'menu.deleted') return 'Menu item deleted';
        return 'Notification';
    }

    private function descriptionFor($event, $payload)
    {
        if ($event === 'order.created') {
            return 'Your order #' . ($payload['order_id'] ?? '') . ' was sent to the restaurant.';
        }
        if ($event === 'order.received') {
            return 'New order #' . ($payload['order_id'] ?? '') . ' has been received.';
        }
        if ($event === 'order.status_updated') {
            return 'Order #' . ($payload['order_id'] ?? '') . ' is now ' . ($payload['status'] ?? 'updated') . '.';
        }
        if ($event === 'payment.created') {
            return 'Payment for order #' . ($payload['order_id'] ?? '') . ' was recorded.';
        }
        if (isset($payload['message'])) return $payload['message'];
        return 'A system update was made.';
    }
}

class ErrorLogObserver implements AppObserver
{
    public function update($event, $payload, $context)
    {
        error_log('[Q-Less Event] ' . $event . ' ' . json_encode($payload));
    }
}

interface PaymentStrategy
{
    public function methodName();
    public function StorePaymentRecord($context, $orderId, $userId, $amount, $status = 'Success');
}

abstract class BasePaymentStrategy implements PaymentStrategy
{
    public function StorePaymentRecord($context, $orderId, $userId, $amount, $status = 'Success')
    {
        if (!isset($context['query']) || !is_callable($context['query'])) return 0;

        call_user_func(
            $context['query'],
            "INSERT INTO payments (order_id,user_id,method,amount,status) VALUES (?,?,?,?,?)",
            [intval($orderId), intval($userId) ?: null, $this->methodName(), floatval($amount), $status ?: 'Success']
        );

        if (isset($context['last_id']) && is_callable($context['last_id'])) {
            return call_user_func($context['last_id']);
        }

        return 0;
    }
}

class CashPaymentStrategy extends BasePaymentStrategy
{
    public function methodName()
    {
        return 'cash';
    }
}

class CardPaymentStrategy extends BasePaymentStrategy
{
    public function methodName()
    {
        return 'card';
    }
}

class WalletPaymentStrategy extends BasePaymentStrategy
{
    public function methodName()
    {
        return 'wallet';
    }
}

class PaymentStrategyFactory
{
    public static function make($method)
    {
        $method = strtolower(trim((string)$method));

        if ($method === 'card' || $method === 'visa' || $method === 'credit') {
            return new CardPaymentStrategy();
        }

        if ($method === 'wallet' || $method === 'mobile_wallet' || $method === 'vodafone cash') {
            return new WalletPaymentStrategy();
        }

        return new CashPaymentStrategy();
    }
}

trait UsesDesignPatterns
{
    protected function EventContext()
    {
        return [
            'query' => function ($sql, $params = []) {
                return $this->q($sql, $params);
            },
            'last_id' => function () {
                return $this->pdo->lastInsertId();
            }
        ];
    }

    protected function NotifyObservers($event, $payload)
    {
        $subject = new AppEventSubject();
        $subject->attach(new DatabaseNotificationObserver());
        $subject->attach(new ErrorLogObserver());
        $subject->notify($event, $payload, $this->EventContext());
    }

    protected function StorePaymentByStrategy($method, $orderId, $userId, $amount, $status = 'Success')
    {
        $strategy = PaymentStrategyFactory::make($method);
        return $strategy->StorePaymentRecord($this->EventContext(), $orderId, $userId, $amount, $status);
    }
}
