import { FC, ReactNode } from "react";

const GridItem: FC<{ label: string; value: ReactNode }> = ({
  label,
  value,
}) => (
  <>
    <div className="col-span-2 font-semibold">{label}</div>
    <div className="col-span-6">{value}</div>
  </>
);

export default GridItem;
