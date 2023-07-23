import { useTheme } from "@/theme/useTheme";
import { Tag } from "knex/types/tables";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

export interface TagListProps {
  items: Tag[];
  command: (item: Tag) => void;
}

const TagList = forwardRef<void, TagListProps>((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];

    if (item) {
      props.command(item);
    }
  };

  const upHandler = () => {
    setSelectedIndex(
      (selectedIndex + props.items.length - 1) % props.items.length
    );
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: React.KeyboardEvent }) => {
      if (event.key === "ArrowUp") {
        upHandler();
        return true;
      }

      if (event.key === "ArrowDown") {
        downHandler();
        return true;
      }

      if (event.key === "Enter") {
        enterHandler();
        return true;
      }

      return false;
    },
  }));
  const { theme } = useTheme();
  const { items } = props;

  return items.length ? (
    <div
      className="z-50 h-auto max-h-[330px] w-72 overflow-y-auto scroll-smooth rounded-md border bg-base-200  border-base-300 px-1 py-2 shadow-lg transition-all text-base-content"
      data-theme={theme}
    >
      {items.map((item, index) => {
        return (
          <button
            className={`flex w-full items-center space-x-2 px-2 py-1 rounded-md text-left transition-all ${
              index == selectedIndex ? "bg-base-300" : ""
            }`}
            key={index}
            onClick={() => selectItem(index)}
          >
            <div>
              <p className="font-medium">{item.name}</p>
            </div>
          </button>
        );
      })}
    </div>
  ) : null;
});

export default TagList;
