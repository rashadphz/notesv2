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
  ViewType,
  handleClose,
  handleOpen,
} from "@/redux/slices/commandModalSlice";
import { useReduxDispatch, useReduxSelector } from "@/redux/hooks";
import { useTheme } from "@/theme/useTheme";
import { cn } from "@/utils";
import { API, selectNote } from "@/redux/slices/noteSlice";
import { Note } from "electronny/preload/api/typeorm/entity/Note";
import SearchView from "./searchView";
import SearchResultsView from "./searchResultsView";

const CommandModal = () => {
  const { theme } = useTheme();

  const open = useReduxSelector((state) => state.commandModal.open);
  const viewType = useReduxSelector(
    (state) => state.commandModal.viewType
  );
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

  return (
    <Transition.Root
      show={open}
      as={Fragment}
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
          <div className="fixed inset-0 bg-base-200/80 transition-opacity" />
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
            <Dialog.Panel className="mx-auto max-w-3xl transform overflow-hidden rounded-xl bg-base-100 shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
              {viewType === ViewType.SEARCH ? (
                <SearchView />
              ) : viewType === ViewType.SEARCH_RESULTS ? (
                <SearchResultsView />
              ) : (
                <></>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default CommandModal;
