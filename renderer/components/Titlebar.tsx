import { ReactNode } from "react";
import { ipcRenderer } from "electron";
import { MenuBar } from "./Menubar";

const iconStyles = {
  width: "12px",
  height: "12px",
  viewBox: "0 0 12 12",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
};

const hoverStyles = {
  position: "absolute",
  opacity: 0,
  transition: "ease-in-out",
  transitionDuration: "100ms",
  _groupHover: { opacity: 1 },
};

const Icon = ({ children, ...props }) => (
  <svg {...props}>{children}</svg>
);

const CloseIcon = () => (
  <Icon {...iconStyles}>
    <circle cx="6" cy="6" r="6" fill="#FF4A4A" />
  </Icon>
);

const MinimizeIcon = () => (
  <Icon {...iconStyles}>
    <circle cx="6" cy="6" r="6" fill="#FFB83D" />
  </Icon>
);

const MaximizeIcon = () => (
  <Icon {...iconStyles}>
    <circle cx="6" cy="6" r="6" fill="#00C543" />
  </Icon>
);

type TitlebarButtonProps = {
  message: "minimizeApp" | "maximizeApp" | "closeApp";
  children: ReactNode;
};

const TitlebarButton = ({
  message,
  children,
}: TitlebarButtonProps) => (
  <button
    onClick={() => {
      ipcRenderer.send(message);
    }}
  >
    {children}
  </button>
);

export const Titlebar = () => {
  return (
    <div className="flex flex-row items-center w-full h-[55px]">
      <div className="px-3 flex flex-row items-center space-x-2">
        <TitlebarButton message="closeApp">
          <CloseIcon />
        </TitlebarButton>
        <TitlebarButton message="minimizeApp">
          <MinimizeIcon />
        </TitlebarButton>
        <TitlebarButton message="maximizeApp">
          <MaximizeIcon />
        </TitlebarButton>
      </div>
      <div className="flex flex-row items-center space-x-2">
        <MenuBar editor={[]} />
      </div>
    </div>
  );
};
