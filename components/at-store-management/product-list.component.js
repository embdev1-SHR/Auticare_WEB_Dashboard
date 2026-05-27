import { isEmpty } from "lodash";
import Link from "next/link";
import { useSelector } from "react-redux";
import { Col, Container, Input, Row } from "reactstrap";
import productPic from "../../public/images/Autism-Steam-Roller.jpg";
import { selectRole } from "../../store/slice/auth.slice";
import CreateProduct from "./create-product.component";
import ProductListFilters from "./product-list-filters.component";
import ProductListItem from "./product-list-item.component";
import { fetchAllAtStoreList } from "../../store/slice/store.slice";
import { useState } from "react";

const StoreProductsList = () => {
  const role = useSelector(selectRole);
  const data = useSelector(fetchAllAtStoreList);

  let values = data.filter((e) => e.Status == 1);
  let valuesData = values;
  const [searchKey, setSearchKey] = useState(valuesData);
  console.log("valuesData", valuesData);
  const [Key, setKey] = useState(false);
  console.log("Key", Key);
  const searchHandle = async (event) => {
    let key = event.target.value;
    key.length === 0 ? setKey(true) : setKey(false);

    function searchProducts(products, key) {
      if (key) {
        console.log("key", key.length);
        const searchKey = key.toLowerCase();
        const filteredProducts = products.filter((product) => {
          const productProductName = product.ProductName.toLowerCase();
          const productCategory = product.Category.toLowerCase();
          return (
            productProductName.includes(searchKey) ||
            productCategory.includes(searchKey)
          );
        });
        return filteredProducts;
      }
      else {
        return products
      }
    }
    const searchResults = searchProducts(values, key);
    setSearchKey(searchResults);
  };

  values = searchKey?.length > 0 ? searchKey : values


  return (
    <Container fluid>
      <Row>
        {/* {role !== "SuperAdmin" ? (
          <Col lg='4' xl='3'>
            <ProductListFilters />
          </Col>
        ) : null} */}
        <Col >
          <div>
            <Row>
              <Col md='5'>
                {role !== "SuperAdmin" ? (
                  <div>
                    <h5>Clothes & Accessories</h5>
                    {/* <ol className='breadcrumb p-0 bg-transparent mb-2'>
                      <li className='breadcrumb-item'>
                        <Link href='#'>Fashion</Link>
                      </li>
                      <li className='breadcrumb-item'>
                        <Link href='#'>Clothing</Link>
                      </li>
                      <li className='breadcrumb-item active'>T-shirts</li>
                    </ol> */}
                  </div>
                ) : null}
              </Col>
              <Col md='7'>
                <div className='form-inline float-md-end mb-3'>
                  <div className='search-box mx-2'>
                    <div className='position-relative'>
                      <Input type='text' className='form-control rounded' onChange={searchHandle} placeholder='Search...' />
                      <i className='mdi mdi-magnify search-icon'></i>
                    </div>
                  </div>
                  {role === "SuperAdmin" && <CreateProduct />}
                </div>
              </Col>
            </Row>
            {!Key ? <Row className='g-0'>{!isEmpty(searchKey) && searchKey.map((product, key) => <ProductListItem key={"_col_" + key} product={product} />)}</Row> : <Row className='g-0'>{!isEmpty(valuesData) && valuesData.map((product, key) => <ProductListItem key={"_col_" + key} product={product} />)}</Row>}
            <Row className='mt-4'>
            </Row>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default StoreProductsList;
