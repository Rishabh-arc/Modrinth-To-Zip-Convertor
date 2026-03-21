import { mrpackHandle } from "../utils/mrpackhandle.ts";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

type Mod = {
  project_id: string;
  title: string;
  description: string;
  icon_url: string;
};

function HomePage() {
  const [uploadedFileName, setuplodedFileName] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Mod[]>([]);
  const [selectedMod, setSelectedMod] = useState<any | null>(null);
  const [versions, setVersions] = useState<any[]>([]);

  const handleUpload = async () => {
    const input = document.getElementById("fileInput") as HTMLInputElement;
    const uploadedFile = input.files?.[0];
    if (!uploadedFile) return;
    await mrpackHandle(uploadedFile);
  };

  const displayFileName = async (e: any) => {
    const file = e.target.files[0];
    if (file) setuplodedFileName(file.name);
  };

  const handleSearch = async () => {
    try {
      const res = await axios.get(
        `https://api.modrinth.com/v2/search?query=${query}&facets=[["project_type:modpack"]]`,
      );
      setResults(res.data.hits);
    } catch (error: any) {
      console.error("Error while searching", error);
    }
  };

  const handleModSelect = async (mod: any) => {
    setSelectedMod(mod);
    try {
      const res = await axios.get(
        `https://api.modrinth.com/v2/project/${mod.project_id}/version`,
      );
      setVersions(res.data);
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-100">
      {/* Navbar */}
      <nav className="w-full bg-[#1a1a2e] text-white px-6 py-3 flex items-center justify-between text-sm shrink-0">
        <span className="font-semibold tracking-wide">Modrinth to ZIP</span>
      </nav>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center pt-10 px-4">
        {/* 🔍 Search */}
        <div className="w-full max-w-md">
          <div className="flex w-full">
            <input
              type="text"
              placeholder="Search modpacks..."
              className="flex-1 px-3 py-2 rounded-l-lg border border-r-0 border-slate-300"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            <button
              className="px-4 py-2 bg-slate-800 text-white rounded-r-lg hover:bg-slate-600"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>

        {/* 📦 Results */}
        <div className="w-full max-w-md mt-4">
          {results.length === 0 ? (
            <p className="text-sm text-gray-500 text-center">No results yet</p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {results.map((mod) => (
                <div
                  key={mod.project_id}
                  onClick={() => handleModSelect(mod)}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg shadow hover:shadow-md transition cursor-pointer"
                >
                  <img
                    src={mod.icon_url || "https://via.placeholder.com/48"}
                    alt={mod.title}
                    className="w-12 h-12 rounded"
                  />
                  <div className="flex-1 text-left">
                    <h3 className="text-sm font-semibold text-gray-800">
                      {mod.title}
                    </h3>
                    <p className="text-xs text-gray-500 overflow-hidden text-ellipsis">
                      {mod.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 🗂 Versions */}
        {selectedMod && (
          <div className="w-full max-w-md mt-6 bg-white p-4 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-3">{selectedMod.title}</h2>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {versions.map((version) => (
                <div
                  key={version.id}
                  className="p-2 border rounded-md flex justify-between items-center"
                >
                  <div>
                    <p className="text-sm font-medium">{version.name}</p>
                    <p className="text-xs text-gray-500">
                      {version.game_versions.join(", ")} •{" "}
                      {version.loaders.join(", ")}
                    </p>
                  </div>
                  <button
                    className="text-xs bg-green-500 text-white px-2 py-1 rounded"
                    onClick={async () => {
                      const toastId = toast.loading("Downloading...");
                      try {
                        const res = await axios.get(version.files[0].url, {
                          responseType: "blob",
                        });
                        await mrpackHandle(
                          new File([res.data], version.files[0].filename, {
                            type: "application/zip",
                          }),
                        );
                        toast.success("Download complete!", { id: toastId });
                      } catch (err) {
                        toast.error("Download failed", { id: toastId });
                        console.error(err);
                      }
                    }}
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 📂 Upload */}
        <div className="w-full max-w-md mt-6 mb-6">
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Upload & Convert File
            </h2>
            <input
              type="file"
              className="hidden"
              id="fileInput"
              onChange={displayFileName}
            />
            <label
              htmlFor="fileInput"
              className="block w-full mb-4 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg cursor-pointer transition"
            >
              Choose File
            </label>
            <p className="text-sm text-gray-500 mb-4">
              {uploadedFileName ? uploadedFileName : "No File Selected"}
            </p>
            <button
              className="w-full py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition"
              onClick={handleUpload}
            >
              Convert
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-[#1a1a2e] text-gray-400 text-center text-xs py-4 shrink-0">
        <p>
          💡 <span className="text-white font-medium">Tip:</span> For best
          results, download the <span className="text-green-400">.mrpack</span>{" "}
          file manually from Modrinth and use the{" "}
          <span className="text-white">Upload & Convert</span> section — rather
          than downloading directly from the search bar.
        </p>
      </footer>
    </div>
  );
}

export default HomePage;
