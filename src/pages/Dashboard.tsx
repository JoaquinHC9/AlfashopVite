import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import { Product } from "../models/Product"; 
import '../assets/styles/Dashboard.css';
import API_URL from '../config/config';
import { Helmet } from "react-helmet";
const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data); 
        } else {
          console.error("Error al obtener productos:", response.statusText);
        }
      } catch (error) {
        console.error("Error al obtener productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  
  const goToProductDetails = (productId: number) => {
    navigate(`/products/${productId}`); 
  };

  return (    
    <Box className="dashboard-root">
      <Helmet>
        <title>Compuya Dashboard</title>
      </Helmet>
      <CssBaseline />
      <Header open={open} handleDrawerOpen={handleDrawerOpen}/>
      <Sidebar open={open} handleDrawerClose={handleDrawerClose} />
      <Box className="dashboard-content">
        <Container>
          <Typography variant="h2" color="secondary">
            Bienvenido
          </Typography>
          <Typography variant="h4" color="primary" style={{ marginTop: 20 }}>
            Productos Disponibles
          </Typography>

          {loading ? (
            <Typography variant="body1">Cargando productos...</Typography>
          ) : (        
            <div className="product-grid">
              {products.map((product) => (
                <div key={product.id} className="product-card" onClick={() => goToProductDetails(product.id)}>
                  <Typography variant="h6" color="primary">
                    {product.name}
                  </Typography>
                  <Typography variant="body1">
                    {product.description}
                  </Typography>
                  <Typography variant="body1" color="secondary">
                    Precio: ${product.price.toFixed(2)}
                  </Typography>
                  <Typography variant="body2">
                    Disponibles: {product.availableQuantity}
                  </Typography>
                </div>
              ))}
            </div>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
