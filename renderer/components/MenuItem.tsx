export const MenuItem = ({
  icon,
  title,
  action,
  isActive = null,
}) => {
  return (
    <button
      className="p-2 rounded-md hover:bg-gray-200 w-10 h-10 text-gray-800"
      onClick={action}
      title={title}
    >
      <i className={`text-xl ri-${icon}`}></i>
    </button>
  );
};
