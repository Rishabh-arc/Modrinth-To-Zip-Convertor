const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 w-full bg-[#1a1a2e] text-gray-400 text-center text-xs py-4 z-50">
      <p>
        💡 <span className="text-white font-medium">Tip:</span> For best
        results, download the <span className="text-green-400">.mrpack</span>{" "}
        file manually from Modrinth and use the{" "}
        <span className="text-white">Upload & Convert</span> section — rather
        than downloading directly from the search bar.
      </p>
    </footer>
  );
};

export default Footer;
