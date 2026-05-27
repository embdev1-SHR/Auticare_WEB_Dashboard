import Link from "next/link";

function SidebarListitem(props) {
  return (
    <li>
      <Link href={`/${props.location}`} className="waves-effect">
        <a>
          <span
            className="nav_tooltip"
            data-toggle="tooltip"
            data-placement="right"
            title={props.title}
          ></span>
          <i className={props.iconClass}></i>
          <span>{props.title}</span>
        </a>
      </Link>
    </li>
  );
}
export default SidebarListitem;
