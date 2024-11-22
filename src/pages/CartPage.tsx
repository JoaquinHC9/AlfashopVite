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
  const [productos, setProductos] = useState<Product[]>([]);
  const [metodoPago, setMetodoPago] = useState<string>('PAYPAL');
  const auth = useAuthUser();
  const customerId = auth()?.customerId; // Obtener el ID del cliente desde react-auth-kit
  const token = localStorage.getItem("_auth");

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(storedCart);
    fetchProducts(storedCart);
  }, []);

  const fetchProducts = async (cartItems: CartItem[]) => {
    const productPromises = cartItems.map((item: CartItem) =>
      fetch(`${API_URL}/v1/productos/producto/${item.idProducto}`)
        .then(response => response.json())
    );
    const productsData = await Promise.all(productPromises);
    setProductos(productsData);
  };

  const handlemetodoPagoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMetodoPago(event.target.value);
  };

  const createOrder = async () => {
    if (!customerId || !token) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe estar logueado para realizar una compra.',
      });
      return;
    }

    const pedidoRequest = {
      idUsuario: customerId,
      metodoPago: metodoPago,
      productos: cart,
    };

    try {
      const response = await fetch(`${API_URL}/v1/pedidos/crear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Usar el token del estado global
        },
        body: JSON.stringify(pedidoRequest),
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Orden Registrada Exitosamente',
          text: 'La orden de compra se ha registrado correctamente.',
        });
        localStorage.removeItem('cart');
        setCart([]); // Vaciar el carrito
        setProductos([]); // Vaciar los productos actuales
        fetchProducts([]); // Refrescar los productos
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al ejecutar la orden.',
        });
        console.log(response);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al realizar la compra.',
      });
      console.error(error);
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
            const product = productos.find(p => p.idProducto === item.idProducto);
            return (
              <div key={item.idProducto}>
                <Typography variant="body1">{product?.nombre || `Producto ID: ${item.idProducto}`}</Typography>
                <Typography variant="body2">Cantidad: {item.cantidad}</Typography>
              </div>
            );
          })}
          <TextField
            select
            label="Método de Pago"
            value={metodoPago}
            onChange={handlemetodoPagoChange}
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
