# Backend MVC Structure

The backend is organized using MVC:

## Model
`backend/models/`

Models are PHP classes responsible for database access and reusable data operations.
They extend `BaseModel`, which owns the database query helpers.

## Controller
`backend/controllers/`

Controllers receive API requests from the router, validate the input, call model/database logic, and decide what response should be returned.

## View
`backend/views/`

Because this backend is an API for a React frontend, the backend views are JSON views instead of HTML templates.
`JsonView` formats success/error responses, while `ErrorView` handles route and server errors.

## Router and Entry Point
`backend/api.php` is only the entry point.
`backend/core/Router.php` maps every route to the correct controller.

This keeps the backend separated into Model, Controller, and View while still working with XAMPP and the React frontend.
