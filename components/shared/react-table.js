import { useEffect } from "react";
import { useTable, useGlobalFilter, useSortBy, usePagination } from "react-table";
import { Row, Col } from "reactstrap";
import { GlobalFilter } from "./search-react-table";

import { setExportData } from "../../store/slice/common.slice";
import { useDispatch } from "react-redux";
import SimpleBarComponent from "./simplebar";

function ReactTable(props) {
  const dispatch = useDispatch();
  const { columns, data, getRowProps = () => ({}) } = props;

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
        // sortBy: [
        //   {
        //     id: "SL.No",
        //     desc: false,
        //   },
        // ],
      },
    },
    useGlobalFilter,

    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    setPageSize,
    rows,
    state: { pageIndex, pageSize, globalFilter },
    setGlobalFilter,
  } = tableInstance;

  const tableData = rows?.map((items) => {
    return items.values;
  });

  const heads = [];
  headerGroups.map((headerGroup) => {
    headerGroup.headers.map((header) => {
      if (header.Header === "") return;
      heads.push(header.Header);
    });
  });

  const filteredData = tableData.map((item) => {
    const { Actions, ...filteredItem } = item;
    return filteredItem;
  });

  const headerMergeData = filteredData.map((item) => {
    const arrObj = heads.map((new_key, i) => {
      if (typeof Object.values(item)[i] === "object") {
        const childArray = Object.values(item)[i]?.props?.children;
        if (Array.isArray(childArray)) {
          const mapArray = [];
          childArray.map((element) => {
            if (typeof element === "object") return mapArray.push(element.props?.children);
          });

          return { ["Mapping"]: mapArray.toString() };
        }
        return { [new_key]: childArray };
      }
      return { [new_key]: Object.values(item)[i] };
    });
    const new_arr = Object.assign({}, ...arrObj);
    return new_arr;
  });

  useEffect(() => {
    dispatch(setExportData({ headerMergeData, filteredData, data }));
    //dispatch(setExportData(headerMergeData));
  }, [headerMergeData]);

  return (
    <div className='tab_data_table table-responsive hide_search'>
      <div id='DataTables_Table_0_wrapper' className='dataTables_wrapper dt-bootstrap4 no-footer'>
        <Row>
          <Col sm={12} md={6}>
            <div className='dataTables_length' id='DataTables_Table_0_length'>
              <label>
                Show{" "}
                <select
                  name='DataTables_Table_0_length'
                  aria-controls='DataTables_Table_0'
                  className='custom-select custom-select-sm form-control form-control-sm'
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                  }}>
                  {[10, 25, 50, 100].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>{" "}
                entries
              </label>
            </div>
          </Col>
          {/* <Col sm={12} md={6} id="search_component">
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
          </Col> */}
        </Row>

        <Row>
          <Col sm={12}>
            <SimpleBarComponent style={{ maxHeight: "60vh" }}>
              <table
                className='datatable table table-bordered dt-responsive dataTable no-footer'
                // className='datatable table table-bordered dt-responsive nowrap hide_length dataTable no-footer'
                {...getTableProps()}
                style={{
                  borderCollapse: "collapse",
                  borderSpacing: 0,
                  maxwidth: "100%",
                }}>
                <thead>
                  {headerGroups.map((headerGroup, i) => (
                    <tr style={{ maxWidth: "60vh" }} key={i} {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column, k) => (
                        <th
                          style={{ maxWidth: "60vh" }}
                          key={k}
                          className={column.isSorted ? (column.isSortedDesc ? "sorting_desc" : "sorting_asc") : "sorting"}
                          {...column.getHeaderProps(column.getSortByToggleProps())}>
                          {column.render("Header")}
                          {/* Add a sort direction indicator */}
                          {/* <span>
                          {column.isSorted
                            ? column.isSortedDesc
                              ? " 🔽"
                              : " 🔼"
                            : ""}
                        </span> */}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {page.map((row, index) => {
                    prepareRow(row);
                    return (
                      <tr key={index} {...row.getRowProps(getRowProps(row))}>
                        {row.cells.map((cell, key) => {
                          return (
                            <td
                              //style="word-break:break-word"
                              style={{ wordBreak: "break-word", wordBreak: "break-all" }}
                              key={key}
                              {...cell.getCellProps()}>
                              {cell.render("Cell")}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </SimpleBarComponent>
          </Col>
        </Row>

        <Row>
          <Col sm={12} md={5}>
            <div className='dataTables_info' id='DataTables_Table_5_info' role='status' aria-live='polite'>
              Showing {data.length > 0 ? pageIndex * 10 + 1 : pageIndex} to {page.length + pageIndex * 10} of {data.length} entries
            </div>
          </Col>
          <Col sm={12} md={7}>
            {!data.length == 0 && (
              <div className='dataTables_paginate paging_simple_numbers' id='DataTables_Table_5_paginate'>
                <ul className='pagination pagination-rounded'>
                  <li className='paginate_button page-item previous disabled' id='DataTables_Table_5_previous' onClick={() => previousPage()} disabled={!canPreviousPage}>
                    <a href='#' aria-controls='DataTables_Table_5' data-dt-idx='0' tabIndex='0' className='page-link'>
                      <i className={canPreviousPage ? "mdi mdi-chevron-left text-dark" : "mdi mdi-chevron-left"}></i>
                    </a>
                  </li>
                  <li className='paginate_button page-item active'>
                    <a href='#' aria-controls='DataTables_Table_5' data-dt-idx='1' tabIndex='0' className='page-link'>
                      {pageIndex + 1}
                    </a>
                  </li>
                  <li className='paginate_button page-item next disabled' id='DataTables_Table_5_next' onClick={() => nextPage()} disabled={!canNextPage}>
                    <a href='#' aria-controls='DataTables_Table_5' data-dt-idx='2' tabIndex='0' className='page-link'>
                      <i className={canNextPage ? "mdi mdi-chevron-right text-dark" : "mdi mdi-chevron-right"}></i>
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default ReactTable;
