import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { toast } from 'react-toastify';
import API_URL from '../config/config';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Product } from '../models/Product';
import { CartItem } from '../models/CartItem';
import { useAuthUser } from 'react-auth-kit';
import Swal from 'sweetalert2';
interface Review {
  idUsuario: number;
  idProducto: number;
  comentario: string;
  puntuacion: number; 
}


const ProductDetails: React.FC = () => {
  const { idProducto } = useParams();
  const auth = useAuthUser();
  const [product, setProduct] = useState<Product | null>(null);
  const [cantidad, setCantidad] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({
    comentario: '',
    puntuacion: 0,
  });
  const customerId = auth()?.customerId; // Obtener el ID del cliente desde react-auth-kit
  const token = localStorage.getItem("_auth");

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/v1/productos/producto/${idProducto}`);
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

    const fetchReviews = async () => {
      try {
        const response = await fetch(`${API_URL}/v1/resenas/producto/${idProducto}`);
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        } else {
          console.error("Error al obtener reseñas:", response.statusText);
        }
      } catch (error) {
        console.error("Error al obtener reseñas:", error);
      }
    };

    fetchProductDetails();
    fetchReviews();
  }, [idProducto]);

  const handleCantidadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(event.target.value);
    if (isNaN(value)) {
      value = 1;
    }
    setCantidad(value);
  };

  const handleReviewChange = (field: string, value: string | number) => {
    setNewReview(prev => ({ ...prev, [field]: value }));
  };

  const addReview = async () => {
    if (!customerId || !token) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe de estar logueado para registrar una Reseña.',
      });
      return;
    }

    const resenaRequest = {
      idUsuario: Number(customerId),
      idProducto: Number(idProducto),
      comentario: newReview.comentario,
      puntuacion: newReview.puntuacion,
    };

    try {
      const response = await fetch(`${API_URL}/v1/resenas/crear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(resenaRequest),
      });

      if (response.ok) {
        toast.success('Reseña agregada exitosamente');
        setNewReview({ comentario: '', puntuacion: 0 });
        const data: Review = await response.json();
        setReviews((prev) => [...prev, data]);
      } else {
        toast.error('Error al agregar la reseña');
      }
    } catch (error) {
      toast.error('Error al agregar la reseña');
    }
  };

  const addToCart = () => {
    if (cantidad > product!.stock) {
      toast.error(`Número de unidades seleccionadas supera el stock`);
      return;
    }

    const cartItem: CartItem = {
      idProducto: product!.idProducto,
      nombreProducto: product!.nombre,
      cantidad,
    };

    let cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = cart.findIndex(item => item.idProducto === cartItem.idProducto);
    if (existingItemIndex !== -1) {
      cart[existingItemIndex].cantidad += cartItem.cantidad;
    } else {
      cart.push(cartItem);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success(`Se han agregado ${cantidad} unidad(es) al carrito`);
  };

  if (loading) {
    return <Typography variant="body1">Cargando detalles del producto...</Typography>;
  }

  if (!product) {
    return <Typography variant="body1">Producto no encontrado.</Typography>;
  }

  return (
    <Container sx={{m:5,ml:5}}>
      <Typography variant="h2" color="primary">Detalles del Producto</Typography>
      <Typography variant="h6" color="primary">{product.nombre}</Typography>
      <Typography variant="body1">{product.descripcion}</Typography>
      <Typography variant="h6" color="primary">Tipo: {product.nombreCategoria}</Typography>
      <Typography variant="body1" color="secondary">Precio: ${product.precio.toFixed(2)}</Typography>
      <Typography variant="body2">Disponibles: {product.stock}</Typography>

      <TextField
        type="number"
        label="Cantidad"
        value={cantidad}
        onChange={handleCantidadChange}
        InputProps={{
          inputProps: { min: 1 },
          startAdornment: <InputAdornment position="start">Unidades</InputAdornment>,
        }}
        variant="outlined"
        margin="normal"
      />

      <Button variant="contained" color="primary" onClick={addToCart}>
        Agregar al Carrito
      </Button>

      <Typography variant="h5" color="primary" style={{ marginTop: '20px' }}>Reseñas</Typography>
      <TableContainer component={Paper} style={{ marginTop: '10px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Comentario</TableCell>
              <TableCell>Puntuación</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviews.map((review: any) => (
              <TableRow key={review.idResena}>
                <TableCell>{review.comentario}</TableCell>
                <TableCell>{review.puntuacion}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h5" style={{ marginTop: '20px' }}>Añadir Reseña</Typography>
      <TextField
        label="Comentario"
        value={newReview.comentario}
        onChange={(e) => handleReviewChange('comentario', e.target.value)}
        fullWidth
        multiline
        margin="normal"
      />
      <TextField
        label="Puntuación"
        type="number"
        value={newReview.puntuacion}
        onChange={(e) => handleReviewChange('puntuacion', parseFloat(e.target.value))}
        InputProps={{ inputProps: { min: 0, max: 5, step: 0.5 } }}
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={addReview}>
        Enviar Reseña
      </Button>
    </Container>
  );
};

export default ProductDetails;
