<?php
class ErrorView extends JsonView
{
    public function notFound($message = 'Route not found')
    {
        $this->error($message, 404);
    }

    public function serverError($message = 'Internal server error')
    {
        $this->error($message, 500);
    }
}
