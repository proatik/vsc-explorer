import {
  useState,
  useEffect,
  ReactNode,
  useContext,
  MouseEvent,
  createContext,
} from "react";

export type Node = {
  id: number;
  name: string;
  isFolder: boolean;
  children?: Node[];
};

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

const root: Node = {
  id: Date.now(),
  isFolder: true,
  name: "Root",
  children: [],
};

type ProviderProps = {
  readonly children: ReactNode;
};

export const MainContextProvider = ({ children }: ProviderProps) => {
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

  const addNode = (nodes: Node[], parentId: number, newNode: Node): Node[] => {
    return nodes.map((node) => {
      if (node.id === parentId && node.isFolder) {
        return {
          ...node,
          children: [...(node.children || []), newNode].sort((a, b) =>
            a.name.localeCompare(b.name)
          ),
        };
      }

      if (node.isFolder && node.children) {
        return {
          ...node,
          children: addNode(node.children, parentId, newNode),
        };
      }

      return node;
    });
  };

  const renameNode = (newName: string) => {
    if (!renameTarget) return;

    const update = (nodes: Node[]): Node[] =>
      nodes.map((node) => {
        if (node.id === renameTarget.id) {
          return { ...node, name: newName };
        }

        if (node.isFolder && node.children) {
          return { ...node, children: update(node.children) };
        }

        return node;
      });

    const updated = update(data);
    setData(updated);
  };

  const deleteNode = (nodes: Node[], id: number): Node[] => {
    return nodes
      .map((node) => {
        if (node.isFolder && node.children) {
          return {
            ...node,
            children: deleteNode(node.children, id),
          };
        }

        return node;
      })
      .filter((node) => node.id !== id);
  };

  const findParentNode = (nodes: Node[], targetId: number): Node | null => {
    for (let node of nodes) {
      if (node.children?.some((child) => child.id === targetId)) {
        return node;
      }

      if (node.isFolder && node.children) {
        const parent = findParentNode(node.children, targetId);
        if (parent) return parent;
      }
    }

    return null;
  };

  const findNodeById = (nodes: Node[], targetId: number): Node | null => {
    for (const node of nodes) {
      if (node.id === targetId) return node;
      if (node.isFolder && node.children) {
        const found = findNodeById(node.children, targetId);
        if (found) return found;
      }
    }
    return null;
  };

  const createFile = (name: string) => {
    const newFile: Node = {
      id: Date.now(),
      name,
      isFolder: false,
    };

    let updatedData: Node[];

    if (!selected) {
      updatedData = [...data, newFile].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    } else if (selected.isFolder) {
      updatedData = addNode(data, selected.id, newFile);
    } else {
      const parentNode = findParentNode(data, selected.id);
      updatedData = parentNode
        ? addNode(data, parentNode.id, newFile)
        : [...data, newFile].sort((a, b) => a.name.localeCompare(b.name));
    }

    setData(updatedData);
    setSelected(findNodeById(updatedData, newFile.id));
  };

  const createFolder = (name: string) => {
    const newFolder: Node = {
      id: Date.now(),
      name,
      isFolder: true,
      children: [],
    };

    let updatedData: Node[];

    if (!selected) {
      updatedData = [...data, newFolder].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    } else if (selected.isFolder) {
      updatedData = addNode(data, selected.id, newFolder);
    } else {
      const parentNode = findParentNode(data, selected.id);
      updatedData = parentNode
        ? addNode(data, parentNode.id, newFolder)
        : [...data, newFolder].sort((a, b) => a.name.localeCompare(b.name));
    }

    setData(updatedData);
    setSelected(findNodeById(updatedData, newFolder.id));
  };

  const handleIsOpen = (id: number) => {
    setIsOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRename = () => {
    if (!selected) return;

    setRenameTarget(selected);
    setInputBox(true);
    setInputValue(selected.name);
    setOpenFor(null);
    setContextMenu(null);
  };

  const handleDelete = () => {
    if (!selected) return;

    const updatedData = deleteNode(data, selected.id);
    setData(updatedData);
    setSelected(null);
    setContextMenu(null);
  };

  const handleRightClick = (e: MouseEvent, item: Node) => {
    e.preventDefault();

    setSelected(item);
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const closeContextMenu = () => {
    setSelected(null);
    setContextMenu(null);
  };

  useEffect(() => {
    const savedData = localStorage.getItem("data");
    const savedIsOpen = localStorage.getItem("is-open");

    const parsedData = savedData ? JSON.parse(savedData) : [];
    const parsedIsOpen = savedIsOpen ? JSON.parse(savedIsOpen) : null;

    if (parsedData && parsedData.length) {
      setData(parsedData);
    } else {
      setData([root]);
    }

    if (parsedIsOpen) {
      setIsOpen(parsedIsOpen);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem("is-open", JSON.stringify(isOpen));
  }, [isOpen]);

  const contextMenuOptions = [
    { label: "Rename", onClick: handleRename },
    { label: "Delete", onClick: handleDelete },
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
