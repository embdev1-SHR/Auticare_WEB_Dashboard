import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function SidebarSkeleton() {
  return <Skeleton height={40} count={14} className='my-1' />;
}

export default SidebarSkeleton;
