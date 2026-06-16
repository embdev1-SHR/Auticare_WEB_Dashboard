import { isEmpty } from "lodash";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Container, Input, Row, Table } from "reactstrap";
import * as XLSX from "xlsx";
import { selectRole } from "../../store/slice/auth.slice";
import { atStoreBulkCreate, fetchAllAtStoreList } from "../../store/slice/store.slice";
import AtStoreActions from "./atStore-actions.component";
import CreateProduct from "./create-product.component";
import ProductListItem from "./product-list-item.component";

const TEMPLATE_HEADERS = [
  "ProductName",
  "Category",
  "Price",
  "DiscountedPrice",
  "Highlights",
  "ProductDescription",
  "ImageURL",
  "ImageURL1",
  "ImageURL2",
  "ImageURL3",
];

const StoreProductsList = () => {
  const role = useSelector(selectRole);
  const dispatch = useDispatch();
  const data = useSelector(fetchAllAtStoreList);
  const fileInputRef = useRef(null);

  const [viewMode, setViewMode] = useState("tile");
  const [searchKey, setSearchKey] = useState(null);

  const allProducts = data.filter((e) => e.Status == 1);
  const displayed = searchKey !== null ? searchKey : allProducts;

  const searchHandle = (event) => {
    const key = event.target.value.toLowerCase();
    if (!key) {
      setSearchKey(null);
      return;
    }
    setSearchKey(
      allProducts.filter(
        (p) =>
          p.ProductName.toLowerCase().includes(key) ||
          p.Category.toLowerCase().includes(key)
      )
    );
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([TEMPLATE_HEADERS]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    XLSX.writeFile(wb, "at-store-template.xlsx");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target.result, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, { defval: "" });
      const products = rows
        .filter((r) => r.ProductName && r.Category && r.Price && r.DiscountedPrice && r.ImageURL)
        .map((r) => ({
          ProductName: String(r.ProductName),
          Category: String(r.Category),
          Price: Number(r.Price),
          DiscountedPrice: Number(r.DiscountedPrice),
          Highlights: r.Highlights || "",
          ProductDescription: r.ProductDescription || "",
          ImageURL: String(r.ImageURL),
          ImageURL1: r.ImageURL1 || null,
          ImageURL2: r.ImageURL2 || null,
          ImageURL3: r.ImageURL3 || null,
        }));
      if (products.length > 0) {
        dispatch(atStoreBulkCreate(products));
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = "";
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          <div>
            <Row className='align-items-center mb-3'>
              <Col md='5'>
                {role !== "SuperAdmin" && <h5>Clothes &amp; Accessories</h5>}
              </Col>
              <Col md='7'>
                <div className='d-flex flex-wrap align-items-center justify-content-end gap-2'>
                  <div className='search-box'>
                    <div className='position-relative'>
                      <Input type='text' className='form-control rounded' onChange={searchHandle} placeholder='Search...' />
                      <i className='mdi mdi-magnify search-icon'></i>
                    </div>
                  </div>
                  <Button
                    color={viewMode === "tile" ? "primary" : "light"}
                    size='sm'
                    title='Tile view'
                    onClick={() => setViewMode("tile")}>
                    <i className='mdi mdi-view-grid'></i>
                  </Button>
                  <Button
                    color={viewMode === "list" ? "primary" : "light"}
                    size='sm'
                    title='List view'
                    onClick={() => setViewMode("list")}>
                    <i className='mdi mdi-view-list'></i>
                  </Button>
                  {role === "SuperAdmin" && (
                    <>
                      <Button color='light' size='sm' onClick={downloadTemplate} title='Download Excel template'>
                        <i className='mdi mdi-download me-1'></i>Template
                      </Button>
                      <Button color='light' size='sm' onClick={() => fileInputRef.current?.click()} title='Bulk upload via Excel'>
                        <i className='mdi mdi-upload me-1'></i>Bulk Upload
                      </Button>
                      <input
                        ref={fileInputRef}
                        type='file'
                        accept='.xlsx,.xls'
                        style={{ display: "none" }}
                        onChange={handleFileUpload}
                      />
                      <CreateProduct />
                    </>
                  )}
                </div>
              </Col>
            </Row>

            {viewMode === "tile" ? (
              <Row className='g-0'>
                {!isEmpty(displayed) &&
                  displayed.map((product, key) => (
                    <ProductListItem key={"_col_" + key} product={product} />
                  ))}
              </Row>
            ) : (
              <div className='table-responsive'>
                <Table className='table align-middle table-nowrap table-hover'>
                  <thead className='table-light'>
                    <tr>
                      <th>Image</th>
                      <th>Product Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Discounted Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!isEmpty(displayed) &&
                      displayed.map((product) => (
                        <tr key={product.ProductID}>
                          <td>
                            <img
                              src={product.ImageURL}
                              alt={product.ProductName}
                              style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "4px" }}
                            />
                          </td>
                          <td>{product.ProductName}</td>
                          <td>{product.Category}</td>
                          <td>
                            <del className='text-muted'>&#8377;{product.Price}</del>
                          </td>
                          <td>
                            <b>&#8377;{product.DiscountedPrice}</b>
                          </td>
                          <td>
                            <AtStoreActions product={product} />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default StoreProductsList;
