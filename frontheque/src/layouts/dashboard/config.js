import ChartPieIcon from '@heroicons/react/24/solid/ChartPieIcon';
import CircleStackIcon from '@heroicons/react/24/solid/CircleStackIcon';
import UserIcon from '@heroicons/react/24/solid/UserIcon';
import SquaresPlusIcon from '@heroicons/react/24/solid/SquaresPlusIcon';

import { SvgIcon } from '@mui/material';

export const items = [
  {
    title: 'Tableau au bord',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <ChartPieIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Ajouter une bouteille',
    // path: '/create/create-material',
    path: '/materials',
    icon: (
      <SvgIcon fontSize="small">
        <CircleStackIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Listes d\'nventaire',
    path: '/liste-material',
    icon: (
      <SvgIcon fontSize="small">
        <SquaresPlusIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Compte',
    path: '/account',
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon />
      </SvgIcon>
    )
  },
];
