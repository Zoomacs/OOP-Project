<?php
abstract class Controller
{
    protected $view;
    protected $pdo;

    public function __construct()
    {
        $this->view = new JsonView();
        $this->pdo = Database::connection();
    }

    protected function model($modelName)
    {
        if (!class_exists($modelName)) {
            $this->fail($modelName . ' model was not found', 500);
        }
        return new $modelName();
    }


    protected function q($sql, $params = [])
    {
        return $this->model('BaseModel')->query($sql, $params);
    }

    protected function lastInsertId()
    {
        return $this->model('BaseModel')->lastInsertId();
    }

    protected function ok($data = [], $message = 'OK', $code = 200)
    {
        $this->view->success($data, $message, $code);
    }

    protected function fail($message, $code = 400, $errors = [])
    {
        $this->view->error($message, $code, $errors);
    }

    protected function boolInt($value, $default = 1)
    {
        if ($value === null || $value === '') return $default;
        if ($value === true || $value === 'true' || $value === 1 || $value === '1') return 1;
        return 0;
    }

    protected function baseUrl()
    {
        $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
        $dir = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/oop-project/backend/api.php')), '/');
        return $scheme . '://' . $host . $dir . '/';
    }

    protected function saveBase64Image($value, $folder = 'menu')
    {
        if (!$value || !is_string($value)) return '';
        if (strpos($value, 'data:image/') !== 0) return $value;
        if (!preg_match('/^data:image\/(png|jpeg|jpg|webp|gif);base64,/', $value, $m)) {
            $this->fail('Invalid image type');
        }
        $ext = $m[1] === 'jpeg' ? 'jpg' : $m[1];
        $data = substr($value, strpos($value, ',') + 1);
        $binary = base64_decode($data, true);
        if ($binary === false) $this->fail('Invalid image data');
        if (strlen($binary) > 3 * 1024 * 1024) $this->fail('Image is too large. Maximum size is 3MB.');
        $dir = __DIR__ . '/../uploads/' . $folder;
        if (!is_dir($dir)) mkdir($dir, 0777, true);
        $file = uniqid($folder . '_', true) . '.' . $ext;
        file_put_contents($dir . '/' . $file, $binary);
        return $this->baseUrl() . 'uploads/' . $folder . '/' . $file;
    }
}
