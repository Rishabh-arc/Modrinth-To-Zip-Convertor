# Modrinth to ZIP Converter

A site that takes `.mrpack` files from Modrinth and converts them into a regular ZIP file. Useful if your launcher doesn't support `.mrpack` files and you just want the mods in a normal folder structure.

## How to use

There are two ways to convert a modpack:

**Upload your own file (recommended)**

Go to Modrinth, find the modpack you want, and download the `.mrpack` file yourself. Then come to the site, click "Choose File", select the file and hit Convert. This is the more reliable way to do it.

**Search directly on the site**

You can also search for modpacks right on the site without leaving. Just type the name, find the version you want and hit Download. It'll grab the file and convert it automatically.

> If the search download isn't working properly, just download the `.mrpack` from Modrinth manually and use the upload option instead — it works better.

## Running locally

Clone the repo and run:

```bash
npm install
npm run dev
```

The site will be running on `localhost:5173`.

## Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Modrinth API
