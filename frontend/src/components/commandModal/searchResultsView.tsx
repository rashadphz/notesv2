import { Fragment, useEffect, useState } from "react";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import {
  DocumentIcon,
  ExclamationTriangleIcon,
  LifebuoyIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import {
  handleClose,
  handleOpen,
} from "@/redux/slices/commandModalSlice";
import { useReduxDispatch, useReduxSelector } from "@/redux/hooks";
import { useTheme } from "@/theme/useTheme";
import { cn } from "@/utils";
import { API, selectNote } from "@/redux/slices/noteSlice";
import { Note } from "electronny/preload/api/typeorm/entity/Note";

const SearchResultsView = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const open = useReduxSelector((state) => state.commandModal.open);
  const dispatch = useReduxDispatch();

  const onSelectNote = (note: Note) => {
    dispatch(selectNote({ id: note.id }));
    dispatch(handleClose());
  };

  const query = useReduxSelector(
    (state) => state.commandModal.searchQuery
  );

  useEffect(() => {
    if (!query) return;
    API.smartSearch(query).then((notes) => {
      setNotes(notes);
    });
  }, [query]);

  return (
    <>
      <Combobox onChange={onSelectNote}>
        <h1 className="text-lg font-semibold text-base-content p-4">
          Search Results for "{query}"
        </h1>
        {notes.length > 0 && (
          <Combobox.Options
            static
            className="max-h-80 scroll-py-10 scroll-pb-2 space-y-4 overflow-y-auto px-4 pb-2"
          >
            {notes.length > 0 && (
              <li>
                <h2 className="text-xs font-semibold text-base-content">
                  Smart Results
                </h2>
                <ul className="-mx-4 mt-2 text-md text-base-content text-opacity-90">
                  {notes.map((note) => (
                    <Combobox.Option
                      key={note.id}
                      value={note}
                      className={({ active }) =>
                        cn(
                          "flex cursor-default select-none items-center px-4 py-1",
                          active && "bg-base-300"
                        )
                      }
                    >
                      {({ active }) => (
                        <>
                          <DocumentIcon
                            className={cn("h-5 w-5 flex-none")}
                            aria-hidden="true"
                          />
                          <span className="ml-2 flex-auto truncate">
                            {note.title}
                          </span>
                        </>
                      )}
                    </Combobox.Option>
                  ))}
                </ul>
              </li>
            )}
          </Combobox.Options>
        )}
      </Combobox>
    </>
  );
};

export default SearchResultsView;
