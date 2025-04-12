import { Node } from "./Node";

export class FileSystem {
  private root: Node;

  constructor(root?: Node) {
    this.root =
      root ||
      new Node({
        id: Date.now(),
        name: "Root",
        isFolder: true,
        children: [],
      });
  }

  createFile(name: string, parentId?: number): Node {
    const file = new Node({
      id: Date.now(),
      name,
      isFolder: false,
      children: null,
    });

    const parent = parentId ? this.root.findById(parentId) : this.root;
    parent?.addChild(file);
    return file;
  }

  createFolder(name: string, parentId?: number): Node {
    const folder = new Node({
      id: Date.now(),
      name,
      isFolder: true,
      children: [],
    });

    const parent = parentId ? this.root.findById(parentId) : this.root;
    parent?.addChild(folder);
    return folder;
  }

  renameNode(id: number, newName: string): Node | null {
    const node = this.root.findById(id);
    node?.rename(newName);
    return node;
  }

  deleteNode(id: number): boolean {
    const parent = this.root.findParentOf(id);
    parent?.removeChildById(id);
    return !!parent;
  }

  findNodeById(id: number): Node | null {
    return this.root.findById(id);
  }

  findParentNode(id: number): Node | null {
    return this.root.findParentOf(id);
  }

  toJSON(): Node[] {
    return [this.root.toJSON() as Node];
  }

  static fromJSON(data: Record<string, any>[]): FileSystem {
    const parseNode = (raw: Record<string, any>): Node =>
      new Node({
        id: raw.id,
        name: raw.name,
        isFolder: raw.isFolder,
        children: raw.children?.map(parseNode) || [],
      });

    return new FileSystem(parseNode(data[0]));
  }
}
