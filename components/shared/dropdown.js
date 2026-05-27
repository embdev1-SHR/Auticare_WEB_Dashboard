import { useEffect, useState } from "react";
import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useSelector } from "react-redux";
import { selectExportData } from "../../store/slice/common.slice";
import moment from "moment/moment";

function DropdownComponent(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [NormalData, setNormalData] = useState();
  const exportData = useSelector(selectExportData);
  // const Data = exportData.data ? exportData.data : exportData;
  const filename = props?.names;

  useEffect(() => {
    // const timeoutId = setTimeout(() => {

    const modifiedArray = exportData.data?.map(obj => {
      const newObj = {};
      for (const [key, value] of Object.entries(obj)) {
        if (!key.includes('ID')) {
          newObj[key] = value;
        }
      }
      return newObj;
    });

    function camelToSnake(obj) {
      const snakeObj = {};
      for (const [key, value] of Object.entries(obj)) {
        const snakeKey = key.replace(/[A-Z]/g, letter => ` ${letter}`);
        snakeObj[snakeKey] = value;
      }
      return snakeObj;
    }
    const NormalData = modifiedArray?.map(camelToSnake);

    setNormalData(NormalData)
    // }, 1000);

    // return () => {
    //   clearTimeout(timeoutId);
    // };
  }, [exportData]);

  const oldFieldName = " Create_ T S";
  const newFieldName = 'Created_At';

  const StatusNewArray = NormalData?.map(obj => {
    const { [' Create_ By']: _, [oldFieldName]: oldField, ...rest } = obj;
    return {
      ...rest,
      [newFieldName]: createFormatDate(oldField),
      [" Status"]: (obj[" Status"] !== 1 ? 'Deleted' : 'Active')
    };
  });
  function createFormatDate(date) {
    return moment(new Date(date)).locale("en-in").format("MM/DD/YYYY");
  }

  const handleClick = (item) => {
    switch (item) {
      case "Excel":
        const ws = XLSX.utils.json_to_sheet(StatusNewArray);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        /* Table Head */
        const Tbl_head = Object?.keys(StatusNewArray[0]);
        const Array_Width = [];
        Tbl_head.map((head) => {
          /* calculate column width */
          const max_width = StatusNewArray.reduce(
            (total, currentValue) =>
              Math.max(total, currentValue[head]?.toString().length),
            head.length
          );
          Array_Width.push(max_width);
        });
        /* set multiple column width */
        const wscols = Array_Width.map((wch) => ({ wch }));
        ws["!cols"] = wscols;
        const file = new Blob([XLSX.write(wb, { type: "array" })]);
        return saveAs(file, `${filename}.xlsx`);

      case "CSV":
        const cs = XLSX.utils.json_to_sheet(NormalData);
        const csv = XLSX.utils.sheet_to_csv(cs);
        const csvfile = new Blob([csv], { type: "text/csv" });
        return saveAs(csvfile, filename);

      case "JSON":
        const json = JSON.stringify(NormalData);
        const jsonFile = new Blob([json], { type: "application/json" });
        return saveAs(jsonFile, filename);

      case "XML":
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += `<${props.names}s>\n`;
        for (let i = 0; i < NormalData.length; i++) {
          xml += `<${props.names}>\n`;
          for (const key in NormalData[i]) {
            xml += `\t\t<${key}>${NormalData[i][key]}</${key}>\n`;
          }
          xml += `\t</${props.names}>\n`;
        }
        xml += `</${props.names}s>`;
        const xmlFile = new Blob([xml], { type: "application/xml" });
        saveAs(xmlFile, `${filename}`);
        break;
      default:
        break;
    }
  };

  return (
    <Dropdown isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}>
      <DropdownToggle color={props.color} caret>
        {props.name} <i className="mdi mdi-chevron-down"></i>
      </DropdownToggle>
      <DropdownMenu>
        {props.items.map((item, key) => {
          return (
            <DropdownItem key={key} onClick={() => handleClick(item)}>
              {item}
            </DropdownItem>
          );
        })}
      </DropdownMenu>
    </Dropdown>
  );
}
export default DropdownComponent;
