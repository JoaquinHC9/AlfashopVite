import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { Product } from "../models/Product";
import { CartItem } from "../models/CartItem";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { toast } from 'react-toastify';
import API_URL from '../config/config';
const ProductDetails: React.FC = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/v1/productos/producto/${productId}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else {
          console.error("Error al obtener detalles del producto:", response.statusText);
        }
      } catch (error) {
        console.error("Error al obtener detalles del producto:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(event.target.value);
    if (isNaN(value)) {
      value = 1;
    }
    setQuantity(value);
  };

  const addToCart = () => {
    if (quantity > product!.stock) {
      toast.error(`Numero de unidad seleccionadas superan el stock`);
      toast.error(`Stock: ${product!.stock} unidades`);
      return;
    }

    const cartItem: CartItem = {
      productId: product!.idProducto,
      productName: product!.nombre,
      quantity: quantity
    };

    let cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = cart.findIndex(item => item.productId === cartItem.productId);
    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity += cartItem.quantity;
    } else {
      cart.push(cartItem);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success(`Se han agregado ${quantity} unidad(es) al carrito`);    
  };

  if (loading) {
    return <Typography variant="body1">Cargando detalles del producto...</Typography>;
  }

  if (!product) {
    return <Typography variant="body1">Producto no encontrado.</Typography>;
  }

  return (
    <Container>
      <Typography variant="h2" color="primary">
        Detalles del Producto
      </Typography>
      <Typography variant="h6" color="primary">
        {product.nombre}
      </Typography>
      <Typography variant="body1">
        {product.descripcion}
      </Typography>
      <Typography variant="h6" color="primary">
        Tipo: {product.nombreCategoria}
      </Typography>
      <Typography variant="body1" color="secondary">
        Precio: ${product.precio.toFixed(2)}
      </Typography>
      <Typography variant="body2">
        Disponibles: {product.stock}
      </Typography>
      <div>
        <TextField
          type="number"
          label="Cantidad"
          value={quantity}
          onChange={handleQuantityChange}
          InputProps={{
            inputProps: { min: 1 },
            startAdornment: <InputAdornment position="start">Unidades</InputAdornment>,
          }}
          variant="outlined"
          margin="normal"
        />
      </div>      
      <div>
        <Button variant="contained" color="primary" onClick={addToCart}>
          Agregar al Carrito
        </Button>
      </div>
    </Container>
  );
};

export default ProductDetails;
