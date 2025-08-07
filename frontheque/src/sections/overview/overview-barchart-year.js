import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
  CircularProgress
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Chart } from 'src/components/chart';
import { useEffect, useState } from 'react';
import config from 'src/utils/config';



export const OverviewBarChart = (props) => {
  const { sx } = props;
  const theme = useTheme();
  const [chartData, setChartData] = useState({
    series: [],
    years: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMaterialData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${config.apiUrl}/materials/bar-chart`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setChartData({
        series: data.series || [],
        years: data.years || []
      });
    } catch (err) {
      console.error('Failed to fetch material data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterialData();
  }, []);

  const chartOptions = {
    chart: {
      type: 'bar',
      background: 'transparent',
      stacked: false,
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
        columnWidth: '45%',
        distributed: false,
        dataLabels: {
          position: 'top'
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 1,
      colors: ['transparent']
    },
    xaxis: {
      categories: chartData.years,
      title: {
        text: 'Année',
        style: {
          color: theme.palette.text.secondary
        }
      },
      axisBorder: {
        show: true,
        color: theme.palette.divider
      },
      axisTicks: {
        show: true,
        color: theme.palette.divider
      },
      labels: {
        style: {
          colors: theme.palette.text.secondary,
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Nombre de bouteilles',
        style: {
          color: theme.palette.text.secondary
        }
      },
      min: 0,
      labels: {
        style: {
          colors: theme.palette.text.secondary
        },
        formatter: (value) => Math.floor(value) === value ? value : ''
      }
    },
    fill: {
      opacity: 1,
      type: 'solid'
    },
    colors: [
      theme.palette.error.dark,
      theme.palette.success.dark
    ],
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '14px',
      labels: {
        colors: theme.palette.text.secondary,
        useSeriesColors: false
      },
      markers: {
        width: 12,
        height: 12,
        radius: 12
      }
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (val) => `${val} Bouteille${val !== 1 ? 's' : ''}`
      },
      style: {
        fontSize: '14px'
      }
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 2,
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    responsive: [{
      breakpoint: 600,
      options: {
        plotOptions: {
          bar: {
            columnWidth: '60%'
          }
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  if (isLoading) {
    return (
      <Card sx={sx}>
        <CardContent 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: 450 
          }}
        >
          <Stack 
            alignItems="center" 
            spacing={2}
          >
            <CircularProgress />
            <Typography 
              color="text.secondary"
            >
              Chargement des données de la bouteille...
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={sx}>
        <CardContent 
          sx={{ 
            minHeight: 450, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center' 
          }}
        >
          <Typography 
            color="error" 
            variant="h6" 
            gutterBottom
          >
            Erreur lors du chargement des données
          </Typography>
          <Typography 
            color="text.secondary" 
            paragraph
          >
            {error}
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={fetchMaterialData}
            sx={{ mt: 2, alignSelf: 'flex-start' }}
          >
            Réessayer
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack spacing={3}>
          <Stack 
            direction="row" 
            justifyContent="space-between" 
            alignItems="center"
          >
            <Typography 
              color="text.primary"
              variant="overline"
            >
              Distribution annuelle de bouteilles par le laboratoire
            </Typography>
            <Button
              size="small"
              onClick={fetchMaterialData}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={16} /> : null}
            >
              {isLoading ? 'Chargement...' : 'Rafraîchir'}
            </Button>
          </Stack>

          {chartData.series.length > 0 ? (
            <Box sx={{ height: 450 }}>
              <Chart
                options={chartOptions}
                series={chartData.series}
                type="bar"
                height="100%"
              />
            </Box>
          ) : (
            <Box 
              sx={{ 
                height: 450, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}
            >
              <Typography 
                color="text.secondary"
              >
                Aucune donnée disponible sur la bouteille
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

OverviewBarChart.propTypes = {
  sx: PropTypes.object
};