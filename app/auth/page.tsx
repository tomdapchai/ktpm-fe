"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardContent, CardHeader, Container, Grid, Typography } from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import PersonIcon from "@mui/icons-material/Person";

const AuthSelectionPage = () => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Hospital Management System
      </Typography>
      <Typography variant="h5" component="h2" align="center" sx={{ mb: 4 }}>
        Select your login type
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.05)', cursor: 'pointer' },
            }}
            onClick={() => handleNavigation('/auth/admin')}
          >
            <CardHeader title="Administrator" sx={{ textAlign: 'center' }} />
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <AdminPanelSettingsIcon sx={{ fontSize: 80, mb: 2 }} color="primary" />
              <Button variant="contained" color="primary" fullWidth>
                Login as Admin
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.05)', cursor: 'pointer' },
            }}
            onClick={() => handleNavigation('/auth/staff')}
          >
            <CardHeader title="Medical Staff" sx={{ textAlign: 'center' }} />
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <MedicalServicesIcon sx={{ fontSize: 80, mb: 2 }} color="secondary" />
              <Button variant="contained" color="secondary" fullWidth>
                Login as Staff
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.05)', cursor: 'pointer' },
            }}
            onClick={() => handleNavigation('/auth/patient')}
          >
            <CardHeader title="Patient" sx={{ textAlign: 'center' }} />
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <PersonIcon sx={{ fontSize: 80, mb: 2 }} color="info" />
              <Button variant="contained" color="info" fullWidth>
                Login as Patient
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AuthSelectionPage;
