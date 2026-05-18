<?php
class JsonView extends View
{
    public function render($payload = [], $statusCode = 200)
    {
        $this->setStatusCode($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    public function success($data = [], $message = 'OK', $statusCode = 200)
    {
        $payload = [
            'success' => true,
            'message' => $message,
            'data' => $data
        ];

        // Keep MVC response structure while also exposing data keys at the top level.
        // Example: { success:true, data:{ user:{...} }, user:{...} }
        // This prevents frontend errors such as reading user.role from an undefined value.
        if (is_array($data)) {
            foreach ($data as $key => $value) {
                if (!array_key_exists($key, $payload)) {
                    $payload[$key] = $value;
                }
            }
        }

        $this->render($payload, $statusCode);
    }

    public function error($message = 'Error', $statusCode = 400, $errors = [])
    {
        $this->render([
            'success' => false,
            'message' => $message,
            'errors' => $errors
        ], $statusCode);
    }
}
