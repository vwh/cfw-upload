import { useParams, Link } from "react-router-dom";

export default function FilePage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="mt-8 flex h-full flex-col items-center gap-6">
      <h1>Dynamic Page</h1>
      <p>Page ID: {id}</p>
      <Link to="/">Go back to Home</Link>
    </div>
  );
}
