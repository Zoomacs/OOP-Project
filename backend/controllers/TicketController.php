<?php
class TicketController extends Controller
{
    private function NormalizeTicketId($value)
    {
        if (is_array($value)) {
            $value = $value['id'] ?? $value['raw_id'] ?? 0;
        }
        $value = str_replace('#TCK-', '', strtoupper(trim((string)$value)));
        return intval($value);
    }

    private function FindTicket($id)
    {
        return $this->q("SELECT * FROM tickets WHERE id=? LIMIT 1", [$id])->fetch(PDO::FETCH_ASSOC);
    }

    public function ReadTicket()
    {
        $userId = intval($_GET['user_id'] ?? 0);
        $email = trim($_GET['email'] ?? '');

        $sql = "SELECT CONCAT('#TCK-',id) AS id,
                       id AS raw_id,
                       user_id,
                       title,
                       email,
                       message,
                       status,
                       COALESCE(reply, '') AS reply,
                       created_at
                FROM tickets";
        $params = [];

        if ($userId > 0 && $email !== '') {
            $sql .= " WHERE user_id=? OR email=?";
            $params = [$userId, $email];
        } elseif ($userId > 0) {
            $sql .= " WHERE user_id=?";
            $params = [$userId];
        } elseif ($email !== '') {
            $sql .= " WHERE email=?";
            $params = [$email];
        }

        $sql .= " ORDER BY raw_id DESC";
        $tickets = $this->q($sql, $params)->fetchAll(PDO::FETCH_ASSOC);

        $this->ok([
            'success' => true,
            'tickets' => $tickets
        ]);
    }

    public function CreateTicket($data)
    {
        $title = trim($data['title'] ?? '');
        $message = trim($data['message'] ?? $data['text'] ?? '');
        $email = trim($data['email'] ?? '');
        $userId = intval($data['user_id'] ?? 0) ?: null;
        $status = trim($data['status'] ?? 'Open') ?: 'Open';
        $reply = trim($data['reply'] ?? '');

        if ($title === '') $this->fail('Ticket title is required');
        if ($message === '') $this->fail('Ticket message is required');

        $this->q(
            "INSERT INTO tickets (user_id,title,email,message,status,reply) VALUES (?,?,?,?,?,?)",
            [$userId, $title, $email, $message, $status, $reply]
        );

        $this->ok([
            'success' => true,
            'id' => $this->lastInsertId(),
            'message' => 'Ticket created successfully'
        ]);
    }

    public function UpdateTicket($data)
    {
        $id = $this->NormalizeTicketId($data['id'] ?? $data['raw_id'] ?? 0);
        if ($id <= 0) $this->fail('Ticket ID is required');

        $ticket = $this->FindTicket($id);
        if (!$ticket) $this->fail('Ticket not found', 404);

        $title = array_key_exists('title', $data) ? trim($data['title']) : $ticket['title'];
        $email = array_key_exists('email', $data) ? trim($data['email']) : $ticket['email'];
        $message = array_key_exists('message', $data) ? trim($data['message']) : $ticket['message'];
        if (array_key_exists('text', $data) && !array_key_exists('message', $data)) {
            $message = trim($data['text']);
        }
        $reply = array_key_exists('reply', $data) ? trim($data['reply']) : ($ticket['reply'] ?? '');
        $status = array_key_exists('status', $data) ? trim($data['status']) : $ticket['status'];

        if ($title === '') $this->fail('Ticket title is required');
        if ($message === '') $this->fail('Ticket message is required');
        if ($status === '') $status = $reply !== '' ? 'Answered' : 'Open';
        if ($reply !== '' && ($status === 'Open' || $status === 'Pending')) $status = 'Answered';

        $this->q(
            "UPDATE tickets SET title=?, email=?, message=?, reply=?, status=? WHERE id=?",
            [$title, $email, $message, $reply, $status, $id]
        );

        $updated = $this->q(
            "SELECT CONCAT('#TCK-',id) AS id, id AS raw_id, user_id, title, email, message, status, COALESCE(reply, '') AS reply, created_at FROM tickets WHERE id=?",
            [$id]
        )->fetch(PDO::FETCH_ASSOC);

        $this->ok([
            'success' => true,
            'ticket' => $updated,
            'message' => 'Ticket updated successfully'
        ]);
    }

    public function DeleteTicket($data)
    {
        $id = $this->NormalizeTicketId($data);
        if ($id <= 0) $id = $this->NormalizeTicketId($_GET['id'] ?? 0);
        if ($id <= 0) $this->fail('Ticket ID is required');

        $this->q("DELETE FROM tickets WHERE id=?", [$id]);

        $this->ok([
            'success' => true,
            'message' => 'Ticket deleted successfully'
        ]);
    }

    // Backward-compatible route method names
    public function read()
    {
        return $this->ReadTicket();
    }

    public function create($data)
    {
        return $this->CreateTicket($data);
    }

    public function update($data)
    {
        return $this->UpdateTicket($data);
    }

    public function delete($data)
    {
        return $this->DeleteTicket($data);
    }


}
