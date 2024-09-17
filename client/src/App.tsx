import UploadDropzone from "./components/dropzone";

export default function App() {
  return (
    <div className="mt-8 flex h-full flex-col items-center gap-6">
      <a href="/">
        <img
          draggable={false}
          src="/logo.webp"
          className="h-28 w-28"
          alt="Vite logo"
          title="Logo"
        />
      </a>
      <UploadDropzone />
      <section className="flex flex-col text-center text-primary">
        <span>Serverless files upload service, anonymously and free.</span>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/vwh/vwh-upload"
          className="hover:underline"
        >
          <strong>
            Made with <span className="animate-pulse">💙</span> by @vwh
          </strong>
        </a>
      </section>
    </div>
  );
}
