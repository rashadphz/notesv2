import { MenuBar } from "./Menubar";

export const Titlebar = () => {
  return (
    <header className="titlebar white border-b-[1px] border-b-gray-50 dark:border-b-gray-700">
      <div className="pl-20 flex flex-row items-center w-full h-[55px]">
        <div className="px-3 flex flex-row items-center space-x-2"></div>
        <MenuBar />
      </div>
    </header>
  );
};
