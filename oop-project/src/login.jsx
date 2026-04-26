function Login({ page }) {
  page("login");

  return (
    <div>
      <h1>Login</h1>
      <form>
        <label htmlFor="ID">ID</label>
        <input type="text" id="ID" name="ID" />
        <br />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
