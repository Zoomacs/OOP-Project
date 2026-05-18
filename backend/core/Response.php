<?php
class Response
{
    public static function ok($data = [], $message = 'OK', $code = 200)
    {
        (new JsonView())->success($data, $message, $code);
    }

    public static function fail($message = 'Error', $code = 400, $errors = [])
    {
        (new JsonView())->error($message, $code, $errors);
    }
}
