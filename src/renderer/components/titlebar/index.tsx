import { MenuBar } from "./MenuBar";

export const Titlebar = () => {
  return (
    <header className="titlebar white border-b-[2px] border-b-base-300">
      <div className="pl-20 flex flex-row items-center w-full h-[55px]">
        <div className="px-3 flex flex-row items-center space-x-2"></div>
        <MenuBar />
      </div>
    </header>
  );
};
