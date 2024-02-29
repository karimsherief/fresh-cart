import { Button, Col, Container, Row, Stack } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  clearUserCart,
  removeCartItem,
  updateItemCount,
} from "rtk/slices/CartSlice";
import { formatCurrency } from "utils/FormatCurrency";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";

export default function Cart() {
  const { cart, totalPrice, isUpdating, isRemoving } = useSelector(
    (state) => state.cart
  );
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate( );
  function handleUpdate(itemId, count) {
    dispatch(
      updateItemCount({
        itemId,
        count,
        token: user?.token,
      })
    );
  }
  async function handleRemove(itemId) {
    try {
      await dispatch(
        removeCartItem({
          itemId,
          token: user?.token,
        })
      ).unwrap();
      toast.success("Item removed successfully");
    } catch (error) {
      toast.error(error);
    }
  }

  if (!cart.length)
    return (
      <section className="py-5 d-flex align-items-center justify-content-center flex-column">
        <h2>Your cart is empty</h2>

        <Link to="/" className="btn btn-outline-main ms-3 d-block">
          Shop Now
        </Link>
      </section>
    );
  async function handleClearCart() {
    try {
      await dispatch(clearUserCart(user?.token)).unwrap();
      toast.success("Cart cleared successfully");
    } catch (error) {
      toast.error(error);
    }
  }
  return (
    <section className="py-5">
      <Container>
        <Button
          variant="outline-danger"
          className="d-block ms-auto"
          onClick={handleClearCart}
          disabled={isUpdating || isRemoving}
        >
          Clear Cart
        </Button>
        <Row>
          {cart.map((item) => (
            <Col xs={6} key={item._id} className="border-bottom border-2 py-3">
              <Row className="align-items-center">
                <Col xs={3}>
                  <img
                    src={item.product.imageCover}
                    alt={item.product.title}
                    className="w-100"
                    loading="lazy"
                  />
                </Col>
                <Col xs={6}>
                  <p>{item.product.title}</p>
                  <p>{formatCurrency(item.price * item.count)}</p>
                </Col>
                <Col xs={3}>
                  <Stack
                    direction="horizontal"
                    className="justify-content-between mb-1"
                  >
                    <Button
                      variant="danger"
                      disabled={item.count === 1 || isUpdating || isRemoving}
                      onClick={() =>
                        handleUpdate(item.product.id, item.count - 1)
                      }
                    >
                      -
                    </Button>
                    <span>{item.count}</span>
                    <Button
                      variant="primary"
                      onClick={() =>
                        handleUpdate(item.product.id, item.count + 1)
                      }
                      disabled={isRemoving || isUpdating}
                    >
                      +
                    </Button>
                  </Stack>
                  <Button
                    variant="danger"
                    className="d-block w-100"
                    onClick={() => handleRemove(item.product.id)}
                    disabled={isRemoving || isUpdating}
                  >
                    <MdDelete /> remove
                  </Button>
                </Col>
              </Row>
            </Col>
          ))}
        </Row>
        <h4 className="mt-3">Total Price: {formatCurrency(totalPrice)}</h4>
        <Button
          className="btn-outline-main text-decoration-none d-block text-center px-5 mt-3"
          style={{ width: "fit-content" }}
          disabled={isRemoving || isUpdating}
          onClick={() => navigate("/checkout")}
        >
          Checkout
        </Button>
      </Container>
    </section>
  );
}
