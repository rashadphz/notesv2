import { useTheme } from "@/theme/useTheme";
import { Tag } from "electron/preload/api/typeorm/entity/Tag";
import { uniqBy } from "lodash";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

export interface TagListProps {
  query: string;
  items: Tag[];
  command: (item: Partial<Tag>) => void;
}

const TagItem = ({
  item,
  command,
  isSelected,
}: {
  item: Partial<Tag>;
  command: any;
  isSelected: boolean;
}) => {
  return (
    <button
      className={`flex w-full items-center space-x-2 px-2 py-1 rounded-md text-left transition-all ${
        isSelected ? "bg-base-300" : ""
      } `}
      onClick={() => command(item)}
    >
      <div>
        <p className="font-medium">{item.name}</p>
      </div>
    </button>
  );
};

const TagList = forwardRef<void, TagListProps>((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { query, items: initalItems } = props;

  const queryTag = {
    name: query,
  };

  const items = uniqBy([...initalItems, queryTag], "name").filter(
    (item) => item.name
  );

  const selectItem = (index: number) => {
    const item = items[index];

    if (item) {
      props.command(item);
    }
  };

  const upHandler = () => {
    setSelectedIndex(
      (selectedIndex + items.length - 1) % items.length
    );
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [initalItems]);

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

  return items.length ? (
    <div
      className="z-50 h-auto max-h-[330px] w-72 overflow-y-auto scroll-smooth rounded-md border bg-base-200  border-base-300 px-1 py-2 shadow-lg transition-all text-base-content"
      data-theme={theme}
    >
      {items.map((item, index) => {
        const isSelected = index === selectedIndex;
        console.log(selectedIndex);
        return (
          <TagItem
            key={index}
            item={item}
            command={props.command}
            isSelected={isSelected}
          />
        );
      })}
    </div>
  ) : null;
});

export default TagList;
