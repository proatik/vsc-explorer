import Folder from "./Folder";
import ContextMenu from "./ContextMenu";

import { useMainContext } from "../contexts/MainContext";

const FileExplorer = () => {
  const {
    data,
    selected,
    contextMenu,
    contextMenuOptions,

    setOpenFor,
    setInputBox,
    closeContextMenu,
  } = useMainContext();

  const handleCreateFile = () => {
    setInputBox(true);
    setOpenFor("file");
  };

  const handleCreateFolder = () => {
    setInputBox(true);
    setOpenFor("folder");
  };

  return (
    <div className="flex flex-col text-white h-full bg-[#202020] overflow-y-auto min-w-[250px] ">
      {/* top part */}
      <div className="flex flex-row items-center justify-between px-2 py-1 bg-[#0b0c25]">
        <span className="font-mono select-none">EXPLORER</span>

        {/* add file or folder icons */}
        <span className="flex flex-row items-center gap-3">
          <button
            onClick={handleCreateFile}
            disabled={!selected || !selected.isFolder}
            className="w-5 h-5 transition-colors ease-in-out cursor-pointer text-slate-600 hover:text-slate-400 disabled:hover:text-slate-600 disabled:cursor-default"
          >
            <svg
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="12" x2="12" y1="18" y2="12"></line>
              <line x1="9" x2="15" y1="15" y2="15"></line>
            </svg>
          </button>

          <button
            onClick={handleCreateFolder}
            disabled={!selected || !selected.isFolder}
            className="w-5 h-5 transition-colors ease-in-out cursor-pointer text-slate-600 hover:text-slate-400 disabled:hover:text-slate-600 disabled:cursor-default"
          >
            <svg
              fill="none"
              strokeWidth={2}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path>
              <line x1="12" x2="12" y1="10" y2="16"></line>
              <line x1="9" x2="15" y1="13" y2="13"></line>
            </svg>
          </button>
        </span>
      </div>

      {/* main explorer part */}
      <div className="flex-grow overflow-auto explorer">
        {data.map((item, index) => {
          return <Folder depth={0} key={index} item={item} />;
        })}
      </div>

      {/* bottom part */}
      <div className="flex flex-row items-center justify-between px-2 py-1 bg-[#0b0c25]">
        <span className="font-mono select-none text-slate-300">
          Atik Ullah Khan
        </span>
        <span className="flex flex-row items-baseline gap-3">
          <svg
            fill="none"
            strokeWidth={2}
            viewBox="0 0 24 24"
            stroke="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 transition-colors ease-in-out cursor-pointer text-slate-600 hover:text-slate-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        </span>
      </div>

      {/* context menu part */}
      {contextMenu && (
        <div
          onClick={closeContextMenu}
          className="absolute top-0 bottom-0 left-0 right-0 bg-transparent"
        >
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            options={contextMenuOptions}
          />
        </div>
      )}
    </div>
  );
};

export default FileExplorer;
