import { isEmpty } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Badge, Button, Card, CardBody, Col, Container, Nav, NavItem, NavLink, Row, TabContent, TabPane, Table } from "reactstrap";
import PlaceEnquiry from "../../../components/at-store-management/place-enquiry.component";
import Layout from "../../../components/shared/layout";
import PageTitle from "../../../components/shared/pagetitle";
import { changeBreadcrumb, changeTitle } from "../../../store/slice/layout.slice";
import withAuth from "./../../../util/helpers/withAuth";
import { selectRole, selectUserData } from "../../../store/slice/auth.slice";
import { useSelector } from "react-redux";
import { AtStoreDetail, AtStoreDetails, StoreIsLoading } from "../../../store/slice/store.slice";
import TextConfig from "../../../components/at-store-management/textConfig.component";
import Loader from "../../../components/shared/loader";

const ProductDetails = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [activeDescriptionTab, setActiveDescriptionTab] = useState("description");
  const toggleTab = (tab) => {
    setActiveTab(tab);
  };
  const toggledescription = (data) => {
    setActiveDescriptionTab(data);
  };
  const router = useRouter();
  const { ProductId } = router.query;
  const role = useSelector(selectRole);
  const product = useSelector(AtStoreDetail);
  console.log("product",product);
  const loading = useSelector(StoreIsLoading);
  product = product[0]
  const [url, setUrl] = useState(product?.ImageURL)
  const UserData = useSelector(selectUserData);

  const FunctionUrl = (URL) => {
    setUrl(URL)
  }

  useEffect(() => {
    dispatch(AtStoreDetails(ProductId));
  }, [dispatch, ProductId]);




  const dispatch = useDispatch();
  useEffect(() => {
    const breadcrumb_Items = [
      { title: "Dashboard", link: "/dashboard" },
      { title: "AT Store", link: "/at-store" },
      { title: "Product Details", link: "at-store" },
    ];
    dispatch(changeTitle("Product Details"));
    dispatch(changeBreadcrumb(breadcrumb_Items));
  });
  return (
    <Layout>
      <div className='page-content'>
        <PageTitle />
        {loading ? (
          <Loader />
        ) : (
          <div className='main_listing'>
            <Container fluid>
              <div className='mb-3'>
                <Button color='light' onClick={() => router.back()}>
                  <i className='mdi mdi-arrow-left me-1'></i> Back
                </Button>
              </div>
              {!isEmpty(product) && (

                <>
                  <Row>
                    <Col lg={12}>
                      <Card className='bg-soft-light'>
                        <CardBody>
                          <Row>
                            <Col xl='5'>
                              <div className='product-detail'>
                                <Row>
                                  <Col xs='3'>
                                    <Nav className='flex-column' pills>
                                      <NavItem>
                                        <NavLink
                                          className={activeTab === "1" ? "active" : ""}
                                          onClick={() => {
                                            toggleTab("1");
                                          }}>
                                          <img src={product.ImageURL} alt='image' className='img-fluid mx-auto d-block tab-img rounded' />
                                        </NavLink>
                                      </NavItem>
                                      {product.ImageURL1 && <NavItem>
                                        <NavLink
                                          className={activeTab === "2" ? "active" : ""}
                                          onClick={() => {
                                            toggleTab("2");
                                          }}>
                                          {console.log("product.ImageURL", product)}
                                          <img src={product.ImageURL1} alt='' className='img-fluid mx-auto d-block tab-img rounded' />
                                        </NavLink>
                                      </NavItem>}
                                      {product.ImageURL2 && <NavItem>
                                        <NavLink
                                          className={activeTab === "3" ? "active" : ""}
                                          onClick={() => {
                                            toggleTab("3");
                                          }}>
                                          <img src={product.ImageURL2} alt='' className='img-fluid mx-auto d-block tab-img rounded' />
                                        </NavLink>
                                      </NavItem>}
                                      {product.ImageURL3 && <NavItem>
                                        <NavLink
                                          className={activeTab === "4" ? "active" : ""}
                                          onClick={() => {
                                            toggleTab("4");
                                          }}>
                                          <img src={product.ImageURL3} alt='' className='img-fluid mx-auto d-block tab-img rounded' />
                                        </NavLink>
                                      </NavItem>}
                                    </Nav>
                                  </Col>
                                  <Col xs='9'>
                                    <TabContent activeTab={activeTab} className='position-relative'>
                                      <TabPane tabId='1'>
                                        <div className='product-img'>
                                          <img src={product.ImageURL} alt='image' id='expandedImg1' className='img-fluid mx-auto d-block' />
                                        </div>
                                      </TabPane>
                                      <TabPane tabId='2'>
                                        <div className='product-img'>
                                          <img src={product.ImageURL1} id='expandedImg2' alt='' className='img-fluid mx-auto d-block' />
                                        </div>
                                      </TabPane>
                                      <TabPane tabId='3'>
                                        <div className='product-img'>
                                          <img src={product.ImageURL2} id='expandedImg3' alt='' className='img-fluid mx-auto d-block' />
                                        </div>
                                      </TabPane>
                                      <TabPane tabId='4'>
                                        <div className='product-img'>
                                          <img src={product.ImageURL3} id='expandedImg4' alt='' className='img-fluid mx-auto d-block' />
                                        </div>
                                      </TabPane>
                                    </TabContent>
                                  </Col>
                                </Row>
                              </div>
                            </Col>
                            <Col xl='7'>
                              <div className='mt-4 mt-xl-3'>
                                {role === "Therapist" ? (
                                  <PlaceEnquiry ProductId={ProductId} />
                                ) : null}
                                <a href='#' className='text-primary'>
                                  {product.Category}
                                </a>
                                <h5 className='mt-1 mb-3'>{product.ProductName}</h5>
                                {/* <Badge className='badge-soft-success rounded-pill mr-2'>Fashion</Badge>
                                <Badge className='badge-soft-info rounded-pill '>Clothing</Badge> */}
                                <h5 className='mt-2'>
                                  <del className='text-muted me-2'>&#8377;{product.Price}</del>
                                  &#8377;{product.DiscountedPrice}
                                  {!!product.isOffer && <span className='text-danger font-size-12 ms-2'>{product.offer} % Off</span>}
                                </h5>
                                <p className='mt-3'>{product.description}</p>
                                <hr className='my-4' />
                                <Row>
                                  <Col md='6'>
                                    <div>
                                      <h5 className='font-size-14'>Highlights :</h5>
                                      <ul className='list-unstyled product-desc-list'>
                                        {product.Highlights &&
                                          product.Highlights.split(", ").map((item, i) => (
                                            <li
                                              key={i}
                                            >
                                              <i className='mdi mdi-circle-medium me-1 align-middle'></i> {item}
                                            </li>
                                          ))}
                                      </ul>
                                    </div>
                                  </Col>
                                </Row>
                              </div>
                            </Col>
                          </Row>
                          <div 
                            className="mb-4">
                            <TextConfig
                              label="Description"
                              name="ActivityInstructionTitle"
                              value={product.ProductDescription}
                              // setValue={(value) =>
                              //   setFieldValue("ActivityInstructionTitle", value)
                              // }
                              placeholder="The Description ..."
                              readOnly = {UserData.RoleName != "SuperAdmin" ? true :false}
                            />
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </>
              )}
            </Container>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default withAuth(ProductDetails);
