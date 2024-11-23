import { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import API_URL from '../config/config';
import { useAuthUser } from 'react-auth-kit';
import '../assets/styles/PaymentInfo.css';

interface PaymentHistory {
  idPedido: number;
  metodoPago: string;
  totalMonto: number;
  estado: string;
}

const PaymentHistory: React.FC = () => {
  const [payments, setPayments] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const auth = useAuthUser();
  const customerId = auth()?.customerId;
  const token = localStorage.getItem('_auth'); // Obtener el token del almacenamiento local

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      if (!customerId || !token) return; // Asegurar que el usuario esté autenticado

      try {
        const response = await fetch(`${API_URL}/v1/pedidos/usuario/${customerId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Añadir token a los headers
          },
        });

        if (response.ok) {
          const data: PaymentHistory[] = await response.json();
          setPayments(data);
        } else {
          console.error('Error al obtener el historial de pagos:', response.statusText);
        }
      } catch (error) {
        console.error('Error al obtener el historial de pagos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, [customerId, token]);

  let paymentContent;
  if (loading) {
    paymentContent = <Typography>Cargando historial de pagos...</Typography>;
  } else if (payments.length > 0) {
    paymentContent = (
      <Grid container spacing={3}>
        {payments.map((payment) => (
          <Grid item xs={12} sm={6} md={4} key={payment.idPedido}>
            <Card className="payment-card">
              <CardContent className="payment-card-content">
                <Typography variant="h6">ID del Pedido: {payment.idPedido}</Typography>
                <Typography>Método de Pago: {payment.metodoPago}</Typography>
                <Typography>Total: ${payment.totalMonto.toFixed(2)}</Typography>
                <Typography>Estado: {payment.estado}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  } else {
    paymentContent = <Typography>No se encontró historial de pagos.</Typography>;
  }

  return (
    <Box className="payment-info-container">
      <Typography variant="h4" gutterBottom>
        Historial de Pagos
      </Typography>
      {paymentContent}
    </Box>
  );
};

export default PaymentHistory;
