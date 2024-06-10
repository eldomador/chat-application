'use client';

import * as React from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

import type { User } from '@/types/user';
import { config } from '@/config';
import { AuthStrategy } from '@/lib/auth/strategy';
import { toast } from '@/components/core/toaster';

import { CustomSignOut } from './custom-sign-out';

export type Language = 'en' | 'de' | 'cz' | 'sk';

const user = {
  id: 'USR-000',
  name: 'Sofia Rivers',
  avatar: '/assets/avatar.png',
  email: 'sofia@devias.io',
} satisfies User;

export interface UserPopoverProps {
  anchorEl: null | Element;
  onClose?: () => void;
  open: boolean;
}

const languageOptions = {
  en: { icon: '/assets/flag-uk.svg', label: 'English' },
  de: { icon: '/assets/flag-de.svg', label: 'German' },
  cz: { icon: '/assets/flag-cz.svg', label: 'Czech' },
  sk: { icon: '/assets/flag-sk.svg', label: 'Slovak' },
} as const;

function LanguageSelect(): React.JSX.Element {
  const { i18n, t } = useTranslation();
  const [language, setLanguage] = React.useState<Language>((i18n.language || 'en') as Language);

  const handleChange = async (event: SelectChangeEvent<Language>) => {
    const newLanguage = event.target.value as Language;
    setLanguage(newLanguage);
    try {
      await i18n.changeLanguage(newLanguage);
      toast.success(t('languageChanged'));
    } catch (error) {
      toast.error(t('languageChangeError'));
    }
  };

  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel id="language-select-label">{t('Language')}</InputLabel>
      <Select labelId="language-select-label" value={language} onChange={handleChange} label="Language">
        {(Object.keys(languageOptions) as Language[]).map((lang) => (
          <MenuItem key={lang} value={lang}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                component="img"
                src={languageOptions[lang].icon}
                sx={{ height: '12px', width: '20px', marginRight: '8px', objectFit: 'cover' }}
              />
              {languageOptions[lang].label}
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export function UserPopover({ anchorEl, onClose, open }: UserPopoverProps): React.JSX.Element {
  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      onClose={onClose}
      open={Boolean(open)}
      slotProps={{ paper: { sx: { width: '280px' } } }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
    >
      <Box sx={{ p: 2 }}>
        <Typography>{user.name}</Typography>
        <Typography color="text.secondary" variant="body2">
          {user.email}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <LanguageSelect />
      </Box>
      <Divider />
      <Box sx={{ p: 1 }}>{config.auth.strategy === AuthStrategy.CUSTOM ? <CustomSignOut /> : null}</Box>
    </Popover>
  );
}
