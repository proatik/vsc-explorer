import {
  ContextMenuOptions,
  ContextMenuPosition,
} from "../contexts/MainContext";

type ContextMenuProps = {
  options: ContextMenuOptions;
} & ContextMenuPosition;

const ContextMenu = ({ options, x, y }: ContextMenuProps) => {
  return (
    <div
      style={{ top: `${y}px`, left: `${x}px` }}
      className="absolute border rounded-sm border-slate-600 w-36 bg-slate-800 text-slate-300"
    >
      {options.map((option, index) => {
        const { label, onClick } = option;

        return (
          <div
            key={index}
            onClick={onClick}
            className="px-2 py-0.5 cursor-pointer rounded-sm hover:bg-gray-700"
          >
            {label}
          </div>
        );
      })}
    </div>
  );
};

export default ContextMenu;
