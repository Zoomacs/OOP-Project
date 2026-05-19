<?php
class NotificationController extends Controller
{
    public function IndexNotification()
    {
        $user_id = intval($_GET['user_id'] ?? 1);
        try {
            $rows = $this->q("SELECT id,title,description,image_url AS image, is_read, order_id, DATE_FORMAT(created_at, '%H:%i') AS time FROM notifications WHERE user_id=? ORDER BY id DESC", [$user_id])->fetchAll();
        } catch (Exception $e) {
            $rows = $this->q("SELECT id,title,description,image_url AS image, 0 AS is_read, NULL AS order_id, DATE_FORMAT(created_at, '%H:%i') AS time FROM notifications WHERE user_id=? ORDER BY id DESC", [$user_id])->fetchAll();
        }
        $this->ok(['notifications' => $rows]);
    }

    public function MarkReadNotification($data)
    {
        $id = intval($data['id'] ?? $_GET['id'] ?? 0);
        if (!$id) $this->fail('Notification ID required');
        try {
            $this->q("UPDATE notifications SET is_read=1 WHERE id=?", [$id]);
        } catch (Exception $e) {
            $this->fail('Mark-as-read requires running migration.sql first');
        }
        $this->ok([], 'Marked as read');
    }

    public function DestroyNotification($data)
    {
        $user_id = intval($_GET['user_id'] ?? $data['user_id'] ?? 1);
        $clear_read = !empty($_GET['clear_read']) || !empty($data['clear_read']);
        if ($clear_read) {
            try {
                $this->q("DELETE FROM notifications WHERE user_id=? AND is_read=1", [$user_id]);
            } catch (Exception $e) {
                $this->q("DELETE FROM notifications WHERE user_id=?", [$user_id]);
            }
        } else {
            $this->q("DELETE FROM notifications WHERE user_id=?", [$user_id]);
        }
        $this->ok([], 'Notifications cleared');
    }

    // Backward-compatible route method names
    public function index()
    {
        return $this->IndexNotification();
    }

    public function markRead($data)
    {
        return $this->MarkReadNotification($data);
    }

    public function destroy($data)
    {
        return $this->DestroyNotification($data);
    }


}
