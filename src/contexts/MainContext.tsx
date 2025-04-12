import {
  useRef,
  useState,
  useEffect,
  ReactNode,
  useContext,
  MouseEvent,
  createContext,
} from "react";

import { Node } from "../composite/Node";
import { FileSystem } from "../composite/FileSystem";

export type ContextMenuPosition = {
  x: number;
  y: number;
};

export type ContextMenuOptions = { label: string; onClick: () => void }[];

type MainContextType = {
  data: Node[];
  inputBox: boolean;
  inputValue: string;
  selected: Node | null;
  renameTarget: Node | null;
  isOpen: Record<number, boolean>;
  openFor: "file" | "folder" | null;
  contextMenuOptions: ContextMenuOptions;
  contextMenu: ContextMenuPosition | null;

  createFile: (name: string) => void;
  renameNode: (name: string) => void;
  createFolder: (name: string) => void;

  setInputBox: (value: boolean) => void;
  setInputValue: (value: string) => void;
  setSelected: (value: Node | null) => void;
  setRenameTarget: (value: Node | null) => void;
  setOpenFor: (value: "file" | "folder" | null) => void;

  closeContextMenu: () => void;
  handleIsOpen: (id: number) => void;
  handleRightClick: (e: MouseEvent, item: Node) => void;
};

const MainContext = createContext<MainContextType | null>(null);

type ProviderProps = {
  readonly children: ReactNode;
};

export const MainContextProvider = ({ children }: ProviderProps) => {
  const fsRef = useRef<FileSystem>(null);

  const [data, setData] = useState<Node[]>([]);
  const [inputBox, setInputBox] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selected, setSelected] = useState<Node | null>(null);
  const [isOpen, setIsOpen] = useState<Record<number, boolean>>({});
  const [renameTarget, setRenameTarget] = useState<Node | null>(null);
  const [openFor, setOpenFor] = useState<"file" | "folder" | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuPosition | null>(
    null
  );

  const createFile = (name: string) => {
    if (!selected || !fsRef.current) return;

    const file = fsRef.current.createFile(name, selected.id);

    setData(fsRef.current.toJSON());
    setSelected(file);
  };

  const createFolder = (name: string) => {
    if (!selected || !fsRef.current) return;

    const folder = fsRef.current.createFolder(name, selected.id);

    setData(fsRef.current.toJSON());
    setSelected(folder);
  };

  const renameNode = (name: string) => {
    if (!renameTarget || !fsRef.current) return;

    fsRef.current.renameNode(renameTarget.id, name);
    setData(fsRef.current.toJSON());
  };

  const deleteNode = () => {
    if (!selected || !fsRef.current) return;

    fsRef.current.deleteNode(selected.id);

    setData(fsRef.current.toJSON());
    setSelected(null);
    setContextMenu(null);
  };

  const handleIsOpen = (id: number) => {
    setIsOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRightClick = (e: MouseEvent, item: Node) => {
    e.preventDefault();

    setSelected(item);
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleRename = () => {
    if (!selected) return;

    setInputBox(true);
    setRenameTarget(selected);
    setInputValue(selected.name);
    closeContextMenu();
  };

  const closeContextMenu = () => {
    setSelected(null);
    setContextMenu(null);
  };

  useEffect(() => {
    const savedData = localStorage.getItem("data");
    const savedIsOpen = localStorage.getItem("is-open");

    const parsedData = savedData ? JSON.parse(savedData) : null;
    const parsedIsOpen = savedIsOpen ? JSON.parse(savedIsOpen) : {};

    fsRef.current = parsedData
      ? FileSystem.fromJSON(parsedData)
      : new FileSystem();

    setData(fsRef.current.toJSON());
    setIsOpen(parsedIsOpen);
  }, []);

  useEffect(() => {
    if (fsRef.current) {
      localStorage.setItem("data", JSON.stringify(fsRef.current.toJSON()));
    }
  }, [data]);

  useEffect(() => {
    if (fsRef.current) {
      localStorage.setItem("is-open", JSON.stringify(isOpen));
    }
  }, [isOpen]);

  const contextMenuOptions = [
    { label: "Rename", onClick: handleRename },
    { label: "Delete", onClick: deleteNode },
    { label: "Close", onClick: closeContextMenu },
  ];

  const props: MainContextType = {
    data,
    isOpen,
    openFor,
    selected,
    inputBox,
    inputValue,
    contextMenu,
    renameTarget,
    contextMenuOptions,

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
    closeContextMenu,
  };

  return <MainContext.Provider value={props}>{children}</MainContext.Provider>;
};

export const useMainContext = (): MainContextType => {
  const context = useContext(MainContext);

  if (!context) {
    throw new Error("useMainContext must be used within a MainContextProvider");
  }

  return context;
};
