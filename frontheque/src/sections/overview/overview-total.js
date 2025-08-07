import PropTypes from 'prop-types';
import ArrowDownIcon from '@heroicons/react/24/solid/ArrowDownIcon';
import ArrowUpIcon from '@heroicons/react/24/solid/ArrowUpIcon';
import BeakerIcon from '@heroicons/react/24/solid/BeakerIcon';
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import config from 'src/utils/config';

export const OverviewTotalMaterialsByLab = (props) => {
  const { difference, positive = false, sx, value } = props;
  const [labCounts, setLabCounts] = useState({ LIPhy: 0, IGE: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMaterialsByLab = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/materials/count-by-lab`);
        if (response.ok) {
          const data = await response.json();
          setLabCounts(data);
        }
      } catch (error) {
        console.error('Error fetching materials by lab:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaterialsByLab();
  }, []);

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          <Stack spacing={1}>
            <Typography
              color="text.secondary"
              variant="overline"
            >
              Bouteilles par laboratoire
            </Typography>
            <Stack direction="row" 
              spacing={4}
            >
              <div>
                <Typography variant="subtitle1">LIPhy</Typography>
                <Typography variant="h4">{labCounts.LIPhy || 0}</Typography>
              </div>
              <div>
                <Typography variant="subtitle1">IGE</Typography>
                <Typography variant="h4">{labCounts.IGE || 0}</Typography>
              </div>
            </Stack>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: 'warning.main',
              height: 56,
              width: 56
            }}
          >
            <SvgIcon>
              <BeakerIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
        {difference && (
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
            sx={{ mt: 2 }}
          >
            <Stack
              alignItems="center"
              direction="row"
              spacing={0.5}
            >
              <SvgIcon
                color={positive ? 'success' : 'error'}
                fontSize="small"
              >
                {positive ? <ArrowUpIcon /> : <ArrowDownIcon />}
              </SvgIcon>
              <Typography
                color={positive ? 'success.main' : 'error.main'}
                variant="body2"
              >
                {difference}%
              </Typography>
            </Stack>
            {/* <Typography
              color="text.secondary"
              variant="caption"
            >
              Since last month
            </Typography> */}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

OverviewTotalMaterialsByLab.propTypes = {
  difference: PropTypes.number,
  positive: PropTypes.bool,
  value: PropTypes.string,
  sx: PropTypes.object
};