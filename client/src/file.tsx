import { useParams, Link } from "react-router-dom";

export default function FilePage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="mt-8 flex h-full flex-col items-center gap-6">
      <p>Page ID: {id}</p>
    </div>
  );
}
