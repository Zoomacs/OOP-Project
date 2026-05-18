<?php
class NotificationController extends Controller
{
    public function IndexNotification()
    {
        $user_id = intval($_GET['user_id'] ?? 1);
        $rows = $this->q("SELECT id,title,description,image_url AS image, DATE_FORMAT(created_at, '%H:%i') AS time FROM notifications WHERE user_id=? ORDER BY id DESC", [$user_id])->fetchAll();
        $this->ok(['notifications' => $rows]);
    }

    public function DestroyNotification($data)
    {
        $this->q("DELETE FROM notifications WHERE user_id=?", [intval($_GET['user_id'] ?? $data['user_id'] ?? 1)]);
        $this->ok([], 'Notifications cleared');
    }

    // Backward-compatible route method names
    public function index()
    {
        return $this->IndexNotification();
    }

    public function destroy($data)
    {
        return $this->DestroyNotification($data);
    }


}
