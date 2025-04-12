export class Node {
  id: number;
  name: string;
  size: number;
  isFolder: boolean;
  children: Node[] | null;

  constructor({
    id,
    name,
    isFolder,
    children,
  }: {
    id: number;
    name: string;
    isFolder: boolean;
    children: Node[] | null;
  }) {
    this.id = id;
    this.name = name;
    this.isFolder = isFolder;
    this.children = children;
    this.size = this.measureSize(isFolder);
  }

  rename(newName: string): void {
    if (newName && newName.trim()) {
      this.name = newName.trim();
    }
  }

  addChild(node: Node): void {
    if (this.isFolder && this.children) {
      this.children.push(node);
      this.children.sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  removeChildById(targetId: number): void {
    if (!this.isFolder || !this.children) return;

    const index = this.children.findIndex((child) => child.id === targetId);

    if (index !== -1) {
      this.children.splice(index, 1);
    } else {
      for (let child of this.children) {
        if (child.isFolder) {
          child.removeChildById(targetId);
        }
      }
    }
  }

  findById(targetId: number): Node | null {
    if (this.id === targetId) return this;

    if (this.isFolder && this.children) {
      for (let child of this.children) {
        const found = child.findById(targetId);

        if (found) return found;
      }
    }

    return null;
  }

  findParentOf(targetId: number): Node | null {
    if (!this.isFolder || !this.children) return null;

    for (let child of this.children) {
      if (child.id === targetId) return this;

      if (child.isFolder) {
        const parent = child.findParentOf(targetId);

        if (parent) return parent;
      }
    }

    return null;
  }

  toJSON(): Record<string, any> {
    return {
      id: this.id,
      name: this.name,
      isFolder: this.isFolder,
      children: this.children?.map((c) => c.toJSON()) || null,
    };
  }

  private measureSize(isFolder: boolean): number {
    return isFolder ? 0 : Math.floor(Math.random() * 10) + 1;
  }

  public getSize(): number {
    if (!this.isFolder) {
      return this.size;
    }

    if (!this.children) {
      return 0;
    }

    return this.children.reduce((total, child) => total + child.getSize(), 0);
  }
}
