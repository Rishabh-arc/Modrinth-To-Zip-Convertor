import jszip from "jszip";
import axios from "axios";
import { saveAs } from "file-saver";
import { toast } from "sonner";

type ModEntry = {
  path: string;
  downloadLink: string[];
};

export const mrpackHandle = async (file?: File) => {
  if (!file) {
    console.error("No file passed to mrpackHandle");
    toast("Please select a file first");
    return;
  }

  const baseName = file.name.replace(/\.mrpack$/i, "");
  const zipName = `${baseName}.zip`;

  const mrpack = await jszip.loadAsync(file);
  const indexFile = mrpack.file("modrinth.index.json");

  if (indexFile) {
    const content = await indexFile.async("string");
    const json = JSON.parse(content);

    const mods: ModEntry[] = json.files.map((f: any) => ({
      path: f.path,
      downloadLink: f.downloads,
    }));

    const zip = new jszip();

    await Promise.all(
      mods.map(async (mod) => {
        const response = await axios.get(mod.downloadLink[0], {
          responseType: "arraybuffer",
        });

        zip.file(mod.path, response.data);
      }),
    );

    const overrideTasks: Promise<void>[] = [];
    mrpack.forEach((relativePath, file) => {
      if (relativePath.startsWith("overrides/") && !file.dir) {
        const task = file.async("arraybuffer").then((data) => {
          const newPath = relativePath.replace("overrides/", "");
          zip.file(newPath, data);
        });

        overrideTasks.push(task);
      }
    });
    await Promise.all(overrideTasks);

    const blob = await zip.generateAsync({ type: "blob" });

    saveAs(blob, zipName);
    toast("File Converted");
  }
};
