import { useCartStore } from '@zustand/cart/cartStore';

const useCart = () => {
  const { setCart } = useCartStore();

  const cart = (data) => {
    setCart(data);
  };

  return { cart };
};

export default useCart;
