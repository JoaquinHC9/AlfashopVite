import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import API_URL from '../config/config';
import { Payment } from '../models/Payment';
import '../assets/styles/PaymentInfo.css';

const PaymentInfo = () => {
  const { id } = useParams<{ id: string }>();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const response = await fetch(`${API_URL}/payments/byOrderId/${id}`);
        if (response.ok) {
          const data = await response.json();
          setPayment(data);
        } else {
          console.error('Error al obtener el pago:', response.statusText);
        }
      } catch (error) {
        console.error('Error al obtener el pago:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [id]);

  return (
    <Box className="payment-info-container">
      {loading ? (
        <Typography>Cargando pago...</Typography>
      ) : payment ? (
        <Card className="payment-card">
          <CardContent className="payment-card-content">
            <Typography variant="h6">ID del Pago: {payment.id}</Typography>
            <Typography>Total: ${payment.amount.toFixed(2)}</Typography>
            <Typography>Método de Pago: {payment.paymentMethod}</Typography>
            <Typography>Fecha de Compra: {new Date(payment.createdDate).toLocaleString()}</Typography>
            {payment.lastModifiedDate && (
              <Typography>Última Modificación: {new Date(payment.lastModifiedDate).toLocaleString()}</Typography>
            )}
          </CardContent>
        </Card>
      ) : (
        <Typography>No se encontró información del pago.</Typography>
      )}
    </Box>
  );
};

export default PaymentInfo;
