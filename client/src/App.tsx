import ModeToggle from "@/components/theme/theme-toggle";
import { Button } from "./components/ui/button";

import { CodeXmlIcon } from "lucide-react";
import UploadDropzone from "./components/dropzone";

export default function App() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-4">
      <section className="flex w-full flex-col items-center gap-1 text-center">
        <UploadDropzone />
      </section>
      <section className="flex gap-2">
        <ModeToggle />
        <a
          title="GitHub Repo"
          href="https://github.com/vwh/revite"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="gooeyRight" size="icon" aria-label="GitHub">
            <CodeXmlIcon className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </a>
      </section>
    </div>
  );
}
