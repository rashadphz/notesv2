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
  handleSearch,
} from "@/redux/slices/commandModalSlice";
import { useReduxDispatch, useReduxSelector } from "@/redux/hooks";
import { useTheme } from "@/theme/useTheme";
import { cn } from "@/utils";
import { API, selectNote } from "@/redux/slices/noteSlice";
import { Note } from "electronny/preload/api/typeorm/entity/Note";

const SearchView = () => {
  const [rawQuery, setRawQuery] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const query = rawQuery.toLowerCase().replace(/^[#>]/, "");
  const dispatch = useReduxDispatch();

  const onSelectNote = (note: Note) => {
    dispatch(selectNote({ id: note.id }));
    dispatch(handleClose());
  };

  const onEnter = (item: Note | string) => {
    if (typeof item === "string") {
      dispatch(handleSearch(rawQuery));
    } else {
      onSelectNote(item);
    }
  };

  useEffect(() => {
    API.searchNotes(rawQuery).then((notes) => {
      setNotes(notes);
    });
  }, [rawQuery]);

  return (
    <div className="divide-y divide-base-300">
      <Combobox onChange={onEnter}>
        <div className="relative">
          <MagnifyingGlassIcon
            className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 opacity-50"
            aria-hidden="true"
          />
          <Combobox.Input
            className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-base-content placeholder:opacity-50 focus:ring-0 sm:text-sm"
            placeholder="Search..."
            onChange={(event) => setRawQuery(event.target.value)}
          />
        </div>

        <Combobox.Options
          static
          className="max-h-80 scroll-py-10 scroll-pb-2 space-y-4 overflow-y-auto p-4 pb-2"
        >
          <li>
            <h2 className="text-xs font-semibold text-base-content">
              Results
            </h2>
            <ul className="-mx-4 mt-2 text-md text-base-content text-opacity-90">
              {rawQuery && (
                <Combobox.Option
                  value={query}
                  className={({ active }) =>
                    cn(
                      "flex cursor-default select-none items-center px-4 py-1",
                      active && "bg-base-300"
                    )
                  }
                >
                  <>
                    <MagnifyingGlassIcon
                      className={cn("h-5 w-5 flex-none")}
                      aria-hidden="true"
                    />
                    <div>
                      <span className="ml-2 flex-auto truncate">
                        <span className="font-bold">{rawQuery}</span>
                        <span className="opacity-60">
                          {" "}
                          - Search Notes{" "}
                        </span>
                      </span>
                    </div>
                  </>
                </Combobox.Option>
              )}
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
            <h2 className="pt-3 text-xs font-semibold text-base-content">
              Tools
            </h2>
            <ul className="-mx-4 mt-2 text-md text-base-content text-opacity-90">
              {rawQuery && (
                <Combobox.Option
                  value={query}
                  className={({ active }) =>
                    cn(
                      "flex cursor-default select-none items-center px-4 py-1",
                      active && "bg-base-300"
                    )
                  }
                >
                  <>
                    <SparklesIcon
                      className={cn("h-5 w-5 flex-none")}
                      aria-hidden="true"
                    />
                    <div>
                      <span className="ml-2 flex-auto truncate">
                        <span>Ask AI: </span>
                        <span className="font-bold">{rawQuery}</span>
                      </span>
                    </div>
                  </>
                </Combobox.Option>
              )}
            </ul>
          </li>
        </Combobox.Options>

        {/* {rawQuery === "?" && (
              <div className="px-6 py-14 text-center text-sm sm:px-14">
                <LifebuoyIcon
                  className="mx-auto h-6 w-6 opacity-50"
                  aria-hidden="true"
                />
                <p className="mt-4 font-semibold text-base-content">
                  Help with searching
                </p>
                <p className="mt-2 text-gray-500">
                  Use this tool to quickly search for users and
                  projects across our entire platform. You can also
                  use the search modifiers found in the footer below
                  to limit the results to just users or projects.
                </p>
              </div>
            )}

            {query !== "" &&
              rawQuery !== "?" &&
              notes.length === 0 && (
                <div className="px-6 py-14 text-center text-sm sm:px-14">
                  <ExclamationTriangleIcon
                    className="mx-auto h-6 w-6 opacity-50"
                    aria-hidden="true"
                  />
                  <p className="mt-4 font-semibold text-base-content">
                    No results found
                  </p>
                  <p className="mt-2 text-gray-500">
                    We couldn’t find anything with that term. Please
                    try again.
                  </p>
                </div>
              )} */}

        <div className="flex flex-wrap justify-between items-center bg-base-100 px-4 py-2.5 text-xs">
          <div className="flex items-center">
            <span className="opacity-60">Suggestions </span>
            <kbd
              className={cn(
                "mx-1 flex h-5 w-5 items-center justify-center rounded border border-base-100 bg-base-300 font-semibold sm:mx-2 text-base-content opacity-70 px-4"
              )}
            >
              TAB
            </kbd>
          </div>
          <div className="flex items-center">
            <span>Open</span>
            <kbd
              className={cn(
                "mx-1 flex h-5 w-5 items-center justify-center rounded border border-base-100 bg-base-300 font-semibold sm:mx-2 text-base-content opacity-70"
              )}
            >
              ↵
            </kbd>
          </div>
        </div>
      </Combobox>
    </div>
  );
};

export default SearchView;
