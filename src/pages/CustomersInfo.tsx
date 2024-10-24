import { Box, Typography, Card, CardContent } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config/config';
import { useAuthUser } from 'react-auth-kit';
import { Order } from '../models/Order';
import '../assets/styles/CustomerInfo.css';

const CustomerInfo = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const auth = useAuthUser();
  const customerId = auth()?.customer_id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_URL}/orders/byUserId/${customerId}`);
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          console.error('Error al obtener las órdenes:', response.statusText);
        }
      } catch (error) {
        console.error('Error al obtener las órdenes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [customerId]);

  const goToPaymentInfo = (orderId: number) => {
    navigate(`/payments/${orderId}`);
  };

  return (
    <Box className="customer-info-container">
      <Typography variant="h4">Historial de Compras</Typography>
      {loading ? (
        <Typography>Cargando órdenes...</Typography>
      ) : (
        orders.map((order) => (
          <Card key={order.id} className="order-card" onClick={() => goToPaymentInfo(order.id)}>
            <CardContent className="order-card-content">
              <Typography variant="h6">Codigo de Compra: {order.reference}</Typography>
              <Typography>Total: ${order.amount.toFixed(2)}</Typography>
              <Typography>Método de Pago: {order.paymentMethod}</Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default CustomerInfo;
