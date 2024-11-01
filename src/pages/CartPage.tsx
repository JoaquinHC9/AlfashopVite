import React, { useState, useEffect } from 'react';
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { CartItem } from "../models/CartItem";
import { Product } from "../models/Product";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { useAuthUser } from 'react-auth-kit';
import API_URL from '../config/config';
import Swal from 'sweetalert2';
const Cart: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>('PAYPAL');  
  const auth = useAuthUser();
  const customerId = auth()?.customer_id; 

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(storedCart);

    const fetchProducts = async () => {
      const productPromises = storedCart.map((item: CartItem) =>
        fetch(`${API_URL}/v1/productos/producto/${item.productId}`)
          .then(response => response.json())
      );
      const productsData = await Promise.all(productPromises);
      setProducts(productsData);
    };

    fetchProducts();
  }, []);

  const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(event.target.value);
  };

  const createOrder = async () => {
    if (!customerId) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe estar logueado para realizar una compra.',
      });
      return;
    }

    const orderRequest = {
      customerId: customerId,
      paymentMethod: paymentMethod,
      products: cart
    };

    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderRequest)
    });

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Orden Registrada Exitosamente',
        text: 'La orden de compra se ha registrado correctamente.',
      });      
      localStorage.removeItem('cart');      
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al ejecutar la orden.',
      }); 
      console.log(response)      
    }
  };

  return (
    <Container>
      <Typography variant="h2" color="primary">Carrito de Compras</Typography>
      {cart.length === 0 ? (
        <Typography variant="body1">El carrito está vacío.</Typography>
      ) : (
        <div>
          {cart.map((item, index) => {
            const product = products.find(p => p.idProducto === item.productId);
            return (
              <div key={item.productId}>
                <Typography variant="body1">{product?.nombre || `Producto ID: ${item.productId}`}</Typography>
                <Typography variant="body2">Cantidad: {item.quantity}</Typography>
              </div>
            );
          })}
          <TextField
            select
            label="Método de Pago"
            value={paymentMethod}
            onChange={handlePaymentMethodChange}
            variant="outlined"
            margin="normal"
          >
            <MenuItem value="PAYPAL">PayPal</MenuItem>
            <MenuItem value="CREDIT_CARD">Credit Card</MenuItem>
            <MenuItem value="VISA">Visa</MenuItem>
            <MenuItem value="MASTER_CARD">MasterCard</MenuItem>
            <MenuItem value="BITCOIN">Bitcoin</MenuItem>
          </TextField>
          <div>
          <Button variant="contained" color="primary" onClick={createOrder}>
            Comprar
          </Button>
          </div>
        </div>
      )}
    </Container>
  );
};

export default Cart;
