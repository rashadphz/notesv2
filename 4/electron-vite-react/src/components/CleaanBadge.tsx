type CleaanBadge = React.SVGProps<SVGSVGElement>;

interface CleaanBadgeProps extends CleaanBadge {
  children?: React.ReactNode;
}

const CleaanBadge: React.FC<CleaanBadgeProps> = ({
  className,
  children,
}) => {
  return (
    <span className={className + " badge font-bold"}>{children}</span>
  );
};

export default CleaanBadge;

// <svg
//   xmlns="http://www.w3.org/2000/svg"
//   className={className}
//   {...rest}
// >
//   <rect
//     className="fill-primary"
//     x="0"
//     y="0"
//     width={width}
//     height={height}
//     rx="5"
//     ry="5"
//     transform="skewX(-20)"
//   />
//   {children}
// </svg>
