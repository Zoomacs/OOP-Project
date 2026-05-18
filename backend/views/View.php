<?php
abstract class View
{
    abstract public function render($payload = [], $statusCode = 200);

    protected function setStatusCode($statusCode)
    {
        http_response_code($statusCode);
    }
}
