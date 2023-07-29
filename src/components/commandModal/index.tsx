import { Fragment, useEffect, useState } from "react";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import {
  ExclamationTriangleIcon,
  FolderIcon,
  LifebuoyIcon,
} from "@heroicons/react/24/outline";
import {
  handleClose,
  handleOpen,
} from "@/redux/slices/commandModalSlice";
import { useReduxDispatch, useReduxSelector } from "@/redux/hooks";
import { useTheme } from "@/theme/useTheme";
import { cn } from "@/utils";
import { API, selectNote } from "@/redux/slices/noteSlice";
import { Note } from "electron/preload/api/typeorm/entity/Note";

const projects = [
  {
    id: 1,
    name: "Workflow Inc. / Website Redesign",
    category: "Projects",
    url: "#",
  },
  // More projects...
];

const users = [
  {
    id: 1,
    name: "Leslie Alexander",
    url: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  // More users...
];

const CommandModal = () => {
  const { theme } = useTheme();
  const [rawQuery, setRawQuery] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const query = rawQuery.toLowerCase().replace(/^[#>]/, "");

  const open = useReduxSelector((state) => state.commandModal.open);
  const dispatch = useReduxDispatch();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!(e.metaKey && e.key === "k")) return;

      if (open) dispatch(handleClose());
      else dispatch(handleOpen());
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const onSelectNote = (note: Note) => {
    dispatch(selectNote({ id: note.id }));
    dispatch(handleClose());
  };

  useEffect(() => {
    API.searchNotes(rawQuery).then((notes) => {
      setNotes(notes);
    });
  }, [rawQuery]);

  const filteredUsers =
    rawQuery === ">"
      ? users
      : query === "" || rawQuery.startsWith("#")
      ? []
      : users.filter((user) =>
          user.name.toLowerCase().includes(query)
        );

  return (
    <Transition.Root
      show={open}
      as={Fragment}
      afterLeave={() => setRawQuery("")}
      appear
      data-theme={theme}
    >
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => dispatch(handleClose())}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-50"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-xl transform divide-y divide-base-300 overflow-hidden rounded-xl bg-base-100 shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
              <Combobox onChange={onSelectNote}>
                <div className="relative">
                  <MagnifyingGlassIcon
                    className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 opacity-50"
                    aria-hidden="true"
                  />
                  <Combobox.Input
                    className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-base-content placeholder:opacity-50 focus:ring-0 sm:text-sm"
                    placeholder="Search..."
                    onChange={(event) =>
                      setRawQuery(event.target.value)
                    }
                  />
                </div>

                {(notes.length > 0 || filteredUsers.length > 0) && (
                  <Combobox.Options
                    static
                    className="max-h-80 scroll-py-10 scroll-pb-2 space-y-4 overflow-y-auto p-4 pb-2"
                  >
                    {notes.length > 0 && (
                      <li>
                        <h2 className="text-xs font-semibold text-base-content">
                          Projects
                        </h2>
                        <ul className="-mx-4 mt-2 text-sm text-base-content text-opacity-90">
                          {notes.map((note) => (
                            <Combobox.Option
                              key={note.id}
                              value={note}
                              className={({ active }) =>
                                cn(
                                  "flex cursor-default select-none items-center px-4 py-2",
                                  active && "bg-base-300"
                                )
                              }
                            >
                              {({ active }) => (
                                <>
                                  <FolderIcon
                                    className={cn(
                                      "h-6 w-6 flex-none"
                                    )}
                                    aria-hidden="true"
                                  />
                                  <span className="ml-3 flex-auto truncate">
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

                {rawQuery === "?" && (
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
                      projects across our entire platform. You can
                      also use the search modifiers found in the
                      footer below to limit the results to just users
                      or projects.
                    </p>
                  </div>
                )}

                {query !== "" &&
                  rawQuery !== "?" &&
                  notes.length === 0 &&
                  filteredUsers.length === 0 && (
                    <div className="px-6 py-14 text-center text-sm sm:px-14">
                      <ExclamationTriangleIcon
                        className="mx-auto h-6 w-6 opacity-50"
                        aria-hidden="true"
                      />
                      <p className="mt-4 font-semibold text-base-content">
                        No results found
                      </p>
                      <p className="mt-2 text-gray-500">
                        We couldn’t find anything with that term.
                        Please try again.
                      </p>
                    </div>
                  )}

                <div className="flex flex-wrap items-center bg-base-200 px-4 py-2.5 text-xs">
                  <span className="opacity-60">Type </span>
                  <kbd
                    className={cn(
                      "mx-1 flex h-5 w-5 items-center justify-center rounded border bg-base-200 font-semibold sm:mx-2",
                      rawQuery.startsWith("#")
                        ? "border-base-200 text-base-200"
                        : "border-gray-400 text-base-content"
                    )}
                  >
                    #
                  </kbd>{" "}
                  <span className="sm:hidden opacity-60">
                    for projects,
                  </span>
                  <span className="hidden sm:inline opacity-60">
                    to access projects,
                  </span>
                  <kbd
                    className={cn(
                      "mx-1 flex h-5 w-5 items-center justify-center rounded border bg-base-200 font-semibold sm:mx-2",
                      rawQuery.startsWith(">")
                        ? "border-base-200 text-base-200"
                        : "border-gray-400 text-base-content"
                    )}
                  >
                    &gt;
                  </kbd>{" "}
                  <span className="opacity-60">for users,</span>{" "}
                  <kbd
                    className={cn(
                      "mx-1 flex h-5 w-5 items-center justify-center rounded border bg-base-200 font-semibold sm:mx-2",
                      rawQuery === "?"
                        ? "border-base-200 text-base-200"
                        : "border-gray-400 text-base-content"
                    )}
                  >
                    ?
                  </kbd>{" "}
                  <span className="opacity-60">for help.</span>
                </div>
              </Combobox>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default CommandModal;
