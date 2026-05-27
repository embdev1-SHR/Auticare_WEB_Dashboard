
import Link from "next/link";
import { useSelector } from "react-redux";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";
import { selectChangeBreadcrumbState } from "../../store/slice/layout.slice";

function BreadcrumbComponent({other, name}) {
  const breadcrumb_items = useSelector(selectChangeBreadcrumbState);
  var extractedArray = breadcrumb_items.slice(0, 2);
  var newObject = {
    "title": name,
    "link": ""
  };
  var newArray = [...extractedArray, newObject];
  console.log("breadcrumb_items",newArray, name);
  return (
    <Breadcrumb listClassName={`m-0 ${other ? other : ""}`}>
      {newArray.map((item, key) =>
        key + 1 === newArray.length ? (
          <BreadcrumbItem key={key} active>
            {item.title}
          </BreadcrumbItem>
        ) : (
          <BreadcrumbItem key={key}>
            <Link href={item.link}>{item.title}</Link>
          </BreadcrumbItem>
        )
      )}
    </Breadcrumb>
  );
}

export default BreadcrumbComponent;
