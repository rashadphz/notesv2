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
