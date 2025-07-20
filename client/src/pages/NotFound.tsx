import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="not-found-container">
      <h1>404 - Page Not Found</h1>
      <p>Oops! Looks like this page doesnt exist</p>
      <Link to="/">Go back home</Link>
    </div>
  );
}
