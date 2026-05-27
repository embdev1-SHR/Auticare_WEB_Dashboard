import { useState } from "react";
import { Card, CardBody, CardHeader, Collapse } from "reactstrap";

const ProductListFilters = () => {
  const [isCategoryOpen1, setCategoryOpen1] = useState(false);
  const [isCategoryOpen2, setCategoryOpen2] = useState(true);
  const [isCategoryOpen3, setCategoryOpen3] = useState(false);
  const [isCategoryOpen4, setCategoryOpen4] = useState(false);
  const filtercategorytoggle1 = () => {
    setCategoryOpen1(!isCategoryOpen1);
  };
  const filtercategorytoggle2 = () => {
    setCategoryOpen2(!isCategoryOpen2);
  };
  const filtercategorytoggle3 = () => {
    setCategoryOpen3(!isCategoryOpen3);
  };
  const filtercategorytoggle4 = () => {
    setCategoryOpen4(!isCategoryOpen4);
  };
  return (
    <Card>
      <CardHeader className='bg-transparent border-bottom'>
        <h5 className='mb-0'>Filters</h5>
      </CardHeader>

      <CardBody>
        <h5 className='font-size-14 mb-3'>Categories</h5>
        <div className='accordion ecommerce' id='accordionExample'>
          <div className='accordion-item'>
            <h2 className='accordion-header' id='headingOne'>
              <button className={isCategoryOpen1 ? "accordion-button" : "accordion-button collapsed"} onClick={filtercategorytoggle1} data-bs-toggle='collapse'>
                <i className='mdi mdi-desktop-classic font-size-16 align-middle me-2'></i> Hi-Tech
              </button>
            </h2>
            <Collapse isOpen={isCategoryOpen1} className='accordion-collapse'>
              <div className='accordion-body'>
                <ul className='list-unstyled categories-list mb-0'>
                  <li>
                    <a href='#'>
                      <i className='mdi mdi-circle-medium me-1'></i> Mobile
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <i className='mdi mdi-circle-medium me-1'></i> Mobile accessories
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <i className='mdi mdi-circle-medium me-1'></i> Computers
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <i className='mdi mdi-circle-medium me-1'></i> Laptops
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <i className='mdi mdi-circle-medium me-1'></i> Speakers
                    </a>
                  </li>
                </ul>
              </div>
            </Collapse>
          </div>

          <div className='accordion-item'>
            <h2 className='accordion-header' id='headingtwo'>
              <button className={isCategoryOpen2 ? "accordion-button" : "accordion-button collapsed"} onClick={filtercategorytoggle2} data-bs-toggle='collapse'>
                <i className='mdi mdi-dumbbell font-size-16 align-middle me-2'></i> Mid-Tech
              </button>
            </h2>
            <Collapse isOpen={isCategoryOpen2} className='accordion-collapse'>
              <div className='accordion-body'>
                <ul className='list-unstyled categories-list mb-0'>
                  <li className='active'>
                    <a href='#'>
                      <i className='mdi mdi-circle-medium me-1'></i> Clothing
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <i className='mdi mdi-circle-medium me-1'></i> Footwear
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <i className='mdi mdi-circle-medium me-1'></i> Watches
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <i className='mdi mdi-circle-medium me-1'></i> Sportswear
                    </a>
                  </li>
                </ul>
              </div>
            </Collapse>
          </div>

          <div className='accordion-item'>
            <h2 className='accordion-header' id='headingThree'>
              <button className={isCategoryOpen3 ? "accordion-button" : "accordion-button collapsed"} onClick={filtercategorytoggle3} data-bs-toggle='collapse'>
                <i className='mdi mdi-pinwheel-outline font-size-16 align-middle me-2'></i> Low-Tech
              </button>
            </h2>
            <Collapse isOpen={isCategoryOpen3} className='accordion-collapse'>
              <div className='accordion-body'>
                <ul className='list-unstyled categories-list mb-0'>
                  <li>
                    <a href='#'>
                      <i className='mdi mdi-circle-medium me-1'></i> Clothing
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <i className='mdi mdi-circle-medium me-1'></i> Footwear
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <i className='mdi mdi-circle-medium me-1'></i> Toys
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <i className='mdi mdi-circle-medium me-1'></i> Baby care
                    </a>
                  </li>
                </ul>
              </div>
            </Collapse>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default ProductListFilters;
