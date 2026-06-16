import Link from "next/link";
import { useRouter } from "next/router";
import { Col } from "reactstrap";
import AtStoreActions from "./atStore-actions.component";

const ProductListItem = ({ product }) => {
  const { push } = useRouter();
  return (
    <Col xl='4' sm='6'>
      <div className='product-box'>
        <div style={{ display: "flex" }}>
          <div className='product-img' onClick={() => push(`/at-store/${product.ProductID}`)}>
            <div className='product-like'></div>
            <img src={product.ImageURL} style={{ height: "300px" }} alt='' className='img-fluid mx-auto d-block' />
          </div>
          <AtStoreActions product={product} />
        </div>
        <div className='text-center' onClick={() => push(`/at-store/${product.ProductID}`)}>
          <p className='text-muted font-size-13'>{product.Category}</p>
          <h5 className='font-size-15'>
            <Link href={`/at-store/${product.ProductID}`} className='text-dark'>
              <a>{product.ProductName}</a>
            </Link>
          </h5>
          <h5 className='mt-3 mb-0'>
            <span className='text-muted me-2'>
              <del>&#8377;{product.Price}</del>
            </span>
            <b>&#8377;{product.DiscountedPrice}</b>
          </h5>
        </div>
        {product.BuyURL && (
          <div className='text-center mt-2 mb-2'>
            <a
              href={product.BuyURL}
              target='_blank'
              rel='noopener noreferrer'
              className='btn btn-primary btn-sm waves-effect waves-light'>
              Buy Now
            </a>
          </div>
        )}
      </div>
    </Col>
  );
};

export default ProductListItem;
