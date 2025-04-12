import { Fragment } from "react";

import { Node, useMainContext } from "../contexts/MainContext";

type FolderProps = {
  item: Node;
  depth: number;
};

const Folder = ({ item, depth }: FolderProps) => {
  const { name, isFolder, children } = item;

  const {
    isOpen,
    openFor,
    selected,
    inputBox,
    inputValue,
    renameTarget,

    createFile,
    renameNode,
    createFolder,

    setOpenFor,
    setSelected,
    setInputBox,
    setInputValue,
    setRenameTarget,

    handleIsOpen,
    handleRightClick,
  } = useMainContext();

  const styles = {
    item: { marginLeft: `${depth * 10}px` },
    input: { marginLeft: `${depth * 10 + 18}px` },
  };

  const selectedHandler = () => {
    setSelected(item);

    if (item.isFolder) {
      handleIsOpen(item.id);
    }
  };

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const submitHandler = (
    event: React.FormEvent<HTMLFormElement> | React.FocusEvent<HTMLInputElement>
  ) => {
    event.preventDefault();

    const name = inputValue.trim();

    if (!name) {
      reset();
      return;
    }

    if (renameTarget) {
      renameNode(name);
    } else if (openFor === "folder") {
      createFolder(name);
    } else if (openFor === "file") {
      createFile(name);
    }

    reset();
  };

  const reset = () => {
    setOpenFor(null);
    setInputValue("");
    setInputBox(false);
    setRenameTarget(null);
  };

  const isExpanded = isOpen[item.id];
  const isSelected = selected?.id === item.id;
  const isRenaming = renameTarget?.id === item.id;

  return (
    <Fragment>
      <div className={isSelected ? "bg-gray-600/50" : ""}>
        <div
          style={styles.item}
          onClick={selectedHandler}
          onContextMenu={(e) => handleRightClick(e, item)}
          className="flex items-center px-2 cursor-pointer select-none"
        >
          <span className="inline-block">
            {isFolder && isExpanded && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            )}

            {isFolder && !isExpanded && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            )}
          </span>

          {!isRenaming && (
            <Fragment>
              {isFolder ? (
                <span className="font-light">📁 {name}</span>
              ) : (
                <span className="ml-4 font-light">📄 {name}</span>
              )}
            </Fragment>
          )}

          {/* Show input box for renaming */}
          {isRenaming && (
            <form className="flex items-center w-full" onSubmit={submitHandler}>
              {item.isFolder && <span className="font-light">📁 </span>}
              {!item.isFolder && <span className="ml-4 font-light">📄 </span>}

              <input
                autoFocus
                type="text"
                value={inputValue}
                onBlur={submitHandler}
                onChange={changeHandler}
                className="px-1 text-sm font-light bg-transparent border outline-none grow border-slate-500"
              />
            </form>
          )}
        </div>
      </div>

      {/* file or folder add input element */}
      {isSelected && openFor && inputBox && (
        <form
          style={styles.input}
          onSubmit={submitHandler}
          className="flex items-center max-w-fit"
        >
          <svg
            fill="none"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
            stroke="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            className={`w-4 h-4 ${openFor === "file" && "opacity-0"}`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>

          {openFor === "folder" && <span className="font-light">📁 </span>}
          {openFor === "file" && <span className="font-light"> 📄 </span>}

          <input
            autoFocus
            type="text"
            value={inputValue}
            onBlur={submitHandler}
            onChange={changeHandler}
            className="px-1 text-sm font-light bg-transparent border outline-none grow border-slate-500"
          />
        </form>
      )}

      {/* nested files and folders */}
      {isFolder &&
        isExpanded &&
        children?.map((item, index) => (
          <Folder item={item} key={index} depth={depth + 1} />
        ))}
    </Fragment>
  );
};

export default Folder;
