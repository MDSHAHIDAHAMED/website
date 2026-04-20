'use client';

import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import AtomAlert from '@/components/atoms/alert';
import AtomButton from '@/components/atoms/button';
import CornerContainer from '@/components/atoms/corner-container';
import AtomInput from '@/components/atoms/input';
import AtomProgressBar from '@/components/atoms/progress';
import RadioCard from '@/components/atoms/radio-card';
import SelectBox from '@/components/atoms/select-box';
import AtomTypography from '@/components/atoms/typography';
import YieldsBadge from '@/components/atoms/yields-badge';
import InputWithLabel from '@/components/molecules/input-with-label';
import OrganismCarousel, { ICarouselItem } from '@/components/organisms/carousel';
import CategoryCard from '@/components/organisms/carousel/CategoryCard';
import Listing, { ITableContextMenuLinksProps } from '@/components/organisms/table';
import { ITableHeader } from '@/components/organisms/table/tableHead';
import DashboardHeader from '@/components/sections/dashboard-header';
import FeaturedTokens from '@/components/sections/featured-tokens';
import Footer from '@/components/sections/footer';
import { WalletStatus } from '@/components/wallet/status';
import { FEATURED_TOKENS } from '@/constants/token-explorer';
import { yieldzNeutral } from '@/styles/theme/colors';
import { formatNumberWithTwoDecimals } from '@/utils/number-format';
import Image from 'next/image';

export default function PasskeyAuth() {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<{ label: string; value: number }>({ label: '10', value: 10 });
  const [loading, setLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<Record<string, any>[]>([]);
  const [allRows, setAllRows] = useState<Record<string, any>[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [selectedRadioCard, setSelectedRadioCard] = useState<string>('default');
  const [checkboxStates, setCheckboxStates] = useState({
    default: false,
    checked: true,
    disabled: false,
    disabledChecked: true,
    indeterminate: true,
  });
  const [radioValue, setRadioValue] = useState<string>('option1');
  const [switchStates, setSwitchStates] = useState({
    unchecked: false,
    checked: true,
    disabledUnchecked: false,
    disabledChecked: true,
  });

  // Initialize form for components
  const methods = useForm({
    defaultValues: {
      walletOptions: [],
      notifications: false,
      email: '',
      password: '',
      walletAddress: '',
      amount: '',
      username: '',
      disabled: '',
      readonly: 'Read-only value',
    },
  });

  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);

  const headers: ITableHeader[] = useMemo(
    () => [
      { id: 'name', label: 'Name', width: '25%', isSortable: true },
      { id: 'price', label: 'Price', width: '25%', isSortable: true },
      { id: 'currentApy', label: 'Current APY in BTC', width: '25%', isSortable: true },
      { id: 'marketCap', label: 'Market Cap', width: '25%', isSortable: true },
    ],
    []
  );

  React.useEffect(() => {
    // Simulate fetch; replace with real API integration
    setLoading(true);
    const timeout = setTimeout(() => {
      const tokenNames = ['YLZD1', 'YLZD2', 'YLZD3', 'YLZD4', 'YLZD5', 'YLZD6', 'YLZD7'];
      const prices = [42.85, 40.2, 38.75, 37.5, 36.8, 35.4, 34];
      const apys = [42.85, 46.3, 45, 43.75, 42.2, 40, 38.5];
      const btcValues = [0, 0.1, 0.15, 0.03, 0.25, 0, 0.15];
      const marketCaps = [183914.99, 190300, 200350, 210400, 220450, 230500, 240550];
      
      const data = Array.from({ length: 15 }).map((_, i) => {
        const tokenIndex = i % tokenNames.length;
        const priceValue = prices[tokenIndex];
        const apyValue = apys[tokenIndex];
        const btcValue = btcValues[tokenIndex];
        const marketCap = marketCaps[tokenIndex] + (i * 10000);
        
        // Randomly assign change type for demonstration (positive, negative, or neutral)
        const changeTypes = ['positive', 'negative', 'neutral'];
        const changeType = changeTypes[i % 3];
        
        let changeValue = '< 5%';
        if (changeType === 'positive') {
          changeValue = '+4%';
        } else if (changeType === 'negative') {
          changeValue = '-3%';
        }
        
        return {
          id: `token_${i + 1}`,
          name: {
            icon: <Image
            src="/assets/logo-emblem--dark.png"
            alt="Y Watermark"
            width={20}
            height={20}
            style={{ objectFit: 'contain' }}
          />,
            primary: tokenNames[tokenIndex],
            secondary: `YLDZ${tokenIndex + 1}`,
          },
          price: {
            value: `${priceValue.toFixed(2)}%`,
            change: changeValue,
            changeType: changeType,
          },
          currentApy: {
            percentage: `${apyValue.toFixed(2)}%`,
            btc: btcValue > 0 ? `฿${btcValue.toFixed(2)}` : '฿0.00',
          },
          marketCap: `$${formatNumberWithTwoDecimals(marketCap)}`,
          onCheckboxChange: (id: string) => {
            setSelectedTokens(prev => 
              prev.includes(id) 
                ? prev.filter(item => item !== id)
                : [...prev, id]
            );
          },
          onRowClick: (id: string) => {
            console.log('Row clicked:', id);
          },
          contextMenuLinks: [
            {
              to: '#',
              title: 'View Details',
              icon: <span>🔍</span>,
              permission: false,
              handleClick: () => console.log('View token', i),
            } as ITableContextMenuLinksProps,
            {
              to: '#',
              title: 'Trade',
              icon: <span>💱</span>,
              permission: false,
              handleClick: () => console.log('Trade token', i),
            } as ITableContextMenuLinksProps,
            {
              to: '#',
              title: 'Add to Watchlist',
              icon: <span>⭐</span>,
              permission: false,
              handleClick: () => console.log('Add to watchlist', i),
            } as ITableContextMenuLinksProps,
          ],
        };
      });
      setAllRows(data);
      setTotalCount(data.length);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, []);

  React.useEffect(() => {
    const start = (page - 1) * pageSize.value;
    const end = start + pageSize.value;
    setRows(allRows.slice(start, end));
  }, [page, pageSize, allRows]);

  const handlePageChange = useCallback((_: ChangeEvent<unknown> | null, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((event: any) => {
    const value = Number(event?.target?.value?.value ?? 10);
    setPageSize({ label: String(value), value });
    setPage(1);
  }, []);

  const handleSelectAllClick = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedTokens(rows.map(row => row.id));
    } else {
      setSelectedTokens([]);
    }
  }, [rows]);

  // Token Categories Carousel Data
  const tokenCategories = useMemo(
    () => [
      {
        id: 'stable-tokens',
        title: 'STABLE TOKENS',
        description: 'RWA Asset Stable Tokens',
      },
      {
        id: 'commodities-1',
        title: 'COMMODITIES',
        description: 'Commodity Backed Token Investments',
      },
      {
        id: 'whiskey',
        title: 'WHISKEY',
        description: 'Invest in Whiskey Casks',
      },
      {
        id: 'funds',
        title: 'FUNDS',
        description: 'Funds Backed with Bitcoin Yield',
      },
      {
        id: 'commodities-2',
        title: 'COMMODITIES',
        description: 'Commodity Backed Token Investments',
      },
      {
        id: 'real-estate',
        title: 'REAL ESTATE',
        description: 'Property-backed Digital Assets',
      },
      {
        id: 'art',
        title: 'ART & COLLECTIBLES',
        description: 'Fine Art Investment Tokens',
      },
      {
        id: 'bonds',
        title: 'BONDS',
        description: 'Government & Corporate Bonds',
      },
    ],
    []
  );

  // Token Icon Component
  const TokenIcon = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="12" stroke="currentColor" strokeWidth="2" />
      <circle cx="24" cy="24" r="8" stroke="currentColor" strokeWidth="2" />
      <circle cx="24" cy="24" r="4" fill="currentColor" />
    </svg>
  );

  // Transform categories to carousel items
  const carouselItems: ICarouselItem[] = useMemo(
    () =>
      tokenCategories.map((category) => ({
        id: category.id,
        content: (
          <CategoryCard
            id={category.id}
            icon={<TokenIcon />}
            title={category.title}
            description={category.description}
            onClick={() => console.log(`Clicked: ${category.title}`)}
          />
        ),
      })),
    [tokenCategories]
  );

  return (
    <FormProvider {...methods}>
      <WalletStatus />
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        mx="auto"
        mt={6}
        padding={5}
      >
        {/* Carousel Component Demo */}
        <Box sx={{ mb: 8, p: 4, border: '2px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Typography variant="h3" sx={{ mb: 4, color: 'text.primary', fontWeight: 700 }}>
            Carousel Component Showcase
          </Typography>
          
          {/* Main Carousel */}
          <Box sx={{ mb: 6 }}>
            <OrganismCarousel
              title="Token Categories"
              items={carouselItems}
              itemsPerView={5}
              gap={20}
            />
          </Box>

          {/* Auto-scrolling Carousel Example */}
          <Box sx={{ mb: 6 }}>
            <OrganismCarousel
              title="Featured Opportunities (Auto-scroll)"
              items={carouselItems.slice(0, 6)}
              itemsPerView={4}
              gap={24}
              autoScroll
              autoScrollInterval={3000}
            />
          </Box>

          {/* Compact Carousel */}
          <Box>
            <OrganismCarousel
              title="Trending Assets"
              items={carouselItems.slice(0, 4)}
              itemsPerView={3}
              gap={16}
            />
          </Box>
        </Box>

        {/* Font Family Examples */}
        <Box sx={{ mb: 8, p: 4, border: '2px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Typography variant="h3" sx={{ mb: 4, color: 'text.primary', fontWeight: 700 }}>
            Font Family Showcase
          </Typography>

          {/* PP Mori Font Examples */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" sx={{ mb: 3, color: 'text.primary', fontWeight: 600 }}>
              PP Mori Font (Primary UI Font)
            </Typography>

            {/* Large Size */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                Large Size (32px)
              </Typography>
              <AtomTypography
                fontType="ppMori"
                variant="h3"
                sx={{
                  mb: 2,
                  color: 'text.primary',
                  textTransform: 'none',
                }}
              >
                Ethereum Wallet Balance - Bold 700
              </AtomTypography>
            </Box>

            {/* Medium Size */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                Medium Size (20px)
              </Typography>
              <AtomTypography
                fontType="ppMori"
                variant="body2"
                sx={{
                  mb: 2,
                  color: 'text.primary',
                  textTransform: 'none',
                }}
              >
                Your crypto portfolio overview - Regular 400
              </AtomTypography>
              <AtomTypography
                fontType="ppMori"
                variant="body2Bold"
                sx={{
                  color: 'text.primary',
                  textTransform: 'none',
                }}
              >
                Your crypto portfolio overview - Bold 700
              </AtomTypography>
            </Box>

            {/* Small Size */}
            <Box>
              <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                Small Size (14px)
              </Typography>
              <AtomTypography
                fontType="ppMori"
                variant="label1"
                sx={{
                  mb: 2,
                  color: 'text.primary',
                  textTransform: 'none',
                }}
              >
                Transaction fee estimated at 0.002 ETH - Regular 400
              </AtomTypography>
              <AtomTypography
                fontType="ppMori"
                variant="label2"
                sx={{
                  color: 'text.primary',
                  textTransform: 'none',
                }}
              >
                Transaction fee estimated at 0.002 ETH - Bold 700
              </AtomTypography>
            </Box>
          </Box>

          {/* Tickerbit Font Examples */}
          <Box>
            <Typography variant="h4" sx={{ mb: 3, color: 'text.primary', fontWeight: 600 }}>
              Tickerbit Font (Numeric & Data Font)
            </Typography>

            {/* Large Size */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                Large Size (32px)
              </Typography>
              <AtomTypography
                fontType="tickerbit"
                variant="h3"
                sx={{
                  mb: 2,
                  color: 'text.primary',
                  textTransform: 'none',
                }}
              >
                $2,345.67 ETH - Bold 700
              </AtomTypography>
            </Box>

            {/* Medium Size */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                Medium Size (20px)
              </Typography>
              <AtomTypography
                fontType="tickerbit"
                variant="body2"
                sx={{
                  mb: 2,
                  color: 'text.primary',
                  textTransform: 'none',
                }}
              >
                0xAbCd1234...5678EfGh - Regular 400
              </AtomTypography>
              <AtomTypography
                fontType="tickerbit"
                variant="body2Bold"
                sx={{
                  color: 'text.primary',
                  textTransform: 'none',
                }}
              >
                0xAbCd1234...5678EfGh - Bold 700
              </AtomTypography>
            </Box>

            {/* Small Size */}
            <Box>
              <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                Small Size (14px)
              </Typography>
              <AtomTypography
                fontType="tickerbit"
                variant="label1"
                sx={{
                  mb: 2,
                  color: 'text.primary',
                  textTransform: 'none',
                }}
              >
                +12.34% (24h) | 0.123456 BTC - Regular 400
              </AtomTypography>
              <AtomTypography
                fontType="tickerbit"
                variant="label2"
                sx={{
                  color: 'text.primary',
                  textTransform: 'none',
                }}
              >
                +12.34% (24h) | 0.123456 BTC - Bold 700
              </AtomTypography>
            </Box>
          </Box>

          {/* Real-World Example - NEW APPROACH ✨ */}
          <Box sx={{ mt: 6, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
            <AtomTypography
              fontType="ppMori"
              variant="body4"
              sx={{
                mb: 1,
                color: 'text.primary',
                textTransform: 'none',
              }}
            >
              Total Balance (Using fontType="ppMori" + variant="body4")
            </AtomTypography>
            <AtomTypography
              fontType="tickerbit"
              variant="display3"
              sx={{
                mb: 2,
                color: 'text.primary',
                textTransform: 'none',
              }}
            >
              $123,456.78 (fontType="tickerbit" + variant="display3")
            </AtomTypography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <AtomTypography
                fontType="ppMori"
                variant="label1"
                sx={{
                  color: 'text.secondary',
                  textTransform: 'none',
                }}
              >
                Wallet Address:
              </AtomTypography>
              <AtomTypography
                fontType="tickerbit"
                variant="label1"
                sx={{
                  color: 'text.primary',
                  textTransform: 'none',
                }}
              >
                0x1234...5678
              </AtomTypography>
            </Box>
          </Box>
        </Box>

        {/* Input Component Examples - Standard Variant */}
        <Box sx={{ mb: 8, p: 4, border: '2px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Typography variant="h3" sx={{ mb: 4, color: 'text.primary', fontWeight: 700 }}>
            Input Component Showcase (Standard Variant)
          </Typography>

          <Stack spacing={4}>
            {/* Basic Text Input */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                Basic Text Input
              </Typography>
              <Box sx={{ maxWidth: 400 }}>
                <AtomInput
                  id="email-input"
                  name="email"
                  type="email"
                  label="Email Address"
                  placeholder="Enter your email"
                />
              </Box>
            </Box>

            {/* Password Input with Toggle */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                Password Input (with visibility toggle)
              </Typography>
              <Box sx={{ maxWidth: 400 }}>
                <AtomInput
                  id="password-input"
                  name="password"
                  type="password"
                  label="Password"
                  placeholder="Enter your password"
                />
              </Box>
            </Box>

            {/* Wallet Address Input */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                Wallet Address Input
              </Typography>
              <Box sx={{ maxWidth: 600 }}>
                <AtomInput
                  id="wallet-address-input"
                  name="walletAddress"
                  type="text"
                  label="Wallet Address"
                  placeholder="0x..."
                  helperText="Enter your Ethereum wallet address"
                />
              </Box>
            </Box>

            {/* Number Input */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                Number Input
              </Typography>
              <Box sx={{ maxWidth: 300 }}>
                <AtomInput
                  id="amount-input"
                  name="amount"
                  type="number"
                  label="Amount"
                  placeholder="0.00"
                  helperText="Enter transaction amount"
                />
              </Box>
            </Box>

            {/* Small Size Input */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                Small Size Input
              </Typography>
              <Box sx={{ maxWidth: 400 }}>
                <AtomInput
                  id="username-small"
                  name="username"
                  type="text"
                  label="Username"
                  placeholder="Enter username"
                  size="small"
                />
              </Box>
            </Box>

            {/* Disabled Input */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                Disabled State
              </Typography>
              <Box sx={{ maxWidth: 400 }}>
                <AtomInput
                  id="disabled-input"
                  name="disabled"
                  type="text"
                  label="Disabled Input"
                  placeholder="This field is disabled"
                  disabled
                />
              </Box>
            </Box>

            {/* Read-only Input */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                Read-only State
              </Typography>
              <Box sx={{ maxWidth: 400 }}>
                <AtomInput
                  id="readonly-input"
                  name="readonly"
                  type="text"
                  label="Read-only Input"
                  readOnly
                />
              </Box>
            </Box>

            {/* Full Width Input */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                Full Width Input
              </Typography>
              <AtomInput
                id="fullwidth-input"
                name="email"
                type="text"
                label="Full Width Input"
                placeholder="This input spans the full width"
                fullWidth
              />
            </Box>

            {/* Different Variants */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                Input Variants Comparison
              </Typography>
              <Stack spacing={3}>
                <Box sx={{ maxWidth: 400 }}>
                  <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                    Standard (Default - Underline)
                  </Typography>
                  <InputWithLabel
                    id="standard-variant"
                    name="email"
                    type="text"
                    label="standard"
                    placeholder="Text Input"
                    variant="standard"
                  />
                </Box>

                <Box sx={{ maxWidth: 400 }}>
                  <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                    Outlined Variant
                  </Typography>
                  <AtomInput
                    id="outlined-variant"
                    name="email"
                    type="text"
                    label="Outlined Variant"
                    placeholder="With border"
                    variant="outlined"
                  />
                </Box>

                <Box sx={{ maxWidth: 400 }}>
                  <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                    Filled Variant
                  </Typography>
                  <AtomInput
                    id="filled-variant"
                    name="email"
                    type="text"
                    label="Filled Variant"
                    placeholder="With background fill"
                    variant="filled"
                  />
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>

        {/* Switch Component Examples */}
        <Box sx={{ mb: 8, p: 4, border: '2px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Typography variant="h3" sx={{ mb: 4, color: 'text.primary', fontWeight: 700 }}>
            Switch Component Showcase
          </Typography>

          <Stack spacing={4}>
            {/* Unchecked States (isSelected = No) */}
            <Box>
              <Typography variant="h6" sx={{ mb: 3, color: 'text.primary' }}>
                isSelected = No (Unchecked States)
              </Typography>
              <Box sx={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                {/* Default Unchecked */}
                <Box>
                  <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                    Default
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={switchStates.unchecked}
                        onChange={(e) => setSwitchStates({ ...switchStates, unchecked: e.target.checked })}
                      />
                    }
                    label="Switch"
                  />
                </Box>

                {/* Focused Unchecked */}
                <Box>
                  <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                    Focused (Tab to focus)
                  </Typography>
                  <FormControlLabel control={<Switch />} label="Switch" />
                </Box>

                {/* Hovered Unchecked */}
                <Box>
                  <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                    Hovered (Hover me)
                  </Typography>
                  <FormControlLabel control={<Switch />} label="Switch" />
                </Box>

                {/* Pressed Unchecked */}
                <Box>
                  <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                    Pressed (Click me)
                  </Typography>
                  <FormControlLabel control={<Switch />} label="Switch" />
                </Box>

                {/* Disabled Unchecked */}
                <Box>
                  <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                    Disabled
                  </Typography>
                  <FormControlLabel
                    control={<Switch checked={switchStates.disabledUnchecked} disabled />}
                    label="Switch"
                  />
                </Box>
              </Box>
            </Box>

            {/* Checked States (isSelected = Yes) */}
            <Box>
              <Typography variant="h6" sx={{ mb: 3, color: 'text.primary' }}>
                isSelected = Yes (Checked States)
              </Typography>
              <Box sx={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                {/* Default Checked */}
                <Box>
                  <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                    Default
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={switchStates.checked}
                        onChange={(e) => setSwitchStates({ ...switchStates, checked: e.target.checked })}
                      />
                    }
                    label="Switch"
                  />
                </Box>

                {/* Focused Checked */}
                <Box>
                  <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                    Focused (Tab to focus)
                  </Typography>
                  <FormControlLabel control={<Switch defaultChecked />} label="Switch" />
                </Box>

                {/* Hovered Checked */}
                <Box>
                  <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                    Hovered (Hover me)
                  </Typography>
                  <FormControlLabel control={<Switch defaultChecked />} label="Switch" />
                </Box>

                {/* Pressed Checked */}
                <Box>
                  <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                    Pressed (Click me)
                  </Typography>
                  <FormControlLabel control={<Switch defaultChecked />} label="Switch" />
                </Box>

                {/* Disabled Checked */}
                <Box>
                  <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                    Disabled
                  </Typography>
                  <FormControlLabel
                    control={<Switch checked={switchStates.disabledChecked} disabled />}
                    label="Switch"
                  />
                </Box>
              </Box>
            </Box>

            {/* Practical Examples */}
            <Box>
              <Typography variant="h6" sx={{ mb: 3, color: 'text.primary' }}>
                Practical Use Cases
              </Typography>
              <Stack spacing={2}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Enable notifications"
                />
                <FormControlLabel
                  control={<Switch />}
                  label="Enable two-factor authentication"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Enable transaction alerts"
                />
                <FormControlLabel
                  control={<Switch />}
                  label="Auto-approve small transactions"
                />
                <FormControlLabel
                  control={<Switch disabled />}
                  label="Advanced features (Coming soon)"
                />
              </Stack>
            </Box>

            {/* Label Positions */}
            <Box>
              <Typography variant="h6" sx={{ mb: 3, color: 'text.primary' }}>
                Label Position Variants
              </Typography>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                    Label on Right (Default)
                  </Typography>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Enable dark mode"
                  />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                    Label on Left
                  </Typography>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Enable auto-save"
                    labelPlacement="start"
                  />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                    Label on Top
                  </Typography>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Privacy mode"
                    labelPlacement="top"
                    sx={{ alignItems: 'flex-start' }}
                  />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                    Label on Bottom
                  </Typography>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Advanced settings"
                    labelPlacement="bottom"
                    sx={{ alignItems: 'flex-start' }}
                  />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                    No Label (Switch Only)
                  </Typography>
                  <Switch defaultChecked />
                </Box>
              </Stack>
            </Box>

            {/* Interactive State Combinations */}
            <Box>
              <Typography variant="h6" sx={{ mb: 3, color: 'text.primary' }}>
                State Combinations
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 3 }}>
                <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                    Default OFF
                  </Typography>
                  <FormControlLabel control={<Switch />} label="Toggle" />
                </Box>
                <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                    Default ON
                  </Typography>
                  <FormControlLabel control={<Switch defaultChecked />} label="Toggle" />
                </Box>
                <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                    Disabled OFF
                  </Typography>
                  <FormControlLabel control={<Switch disabled />} label="Toggle" />
                </Box>
                <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                    Disabled ON
                  </Typography>
                  <FormControlLabel control={<Switch defaultChecked disabled />} label="Toggle" />
                </Box>
              </Box>
            </Box>

            {/* Form Integration Example */}
            <Box>
              <Typography variant="h6" sx={{ mb: 3, color: 'text.primary' }}>
                Form Integration Example
              </Typography>
              <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2, maxWidth: 500 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Notification Preferences
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Email Notifications
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Receive updates via email
                      </Typography>
                    </Box>
                    <Switch defaultChecked />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Push Notifications
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Get instant push alerts
                      </Typography>
                    </Box>
                    <Switch />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        SMS Notifications
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Receive text messages (Premium only)
                      </Typography>
                    </Box>
                    <Switch disabled />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Marketing Updates
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Get news and promotions
                      </Typography>
                    </Box>
                    <Switch defaultChecked />
                  </Box>
                </Stack>
              </Box>
            </Box>

            {/* Accessibility Example */}
            <Box>
              <Typography variant="h6" sx={{ mb: 3, color: 'text.primary' }}>
                Accessibility Features
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                    Tab through these switches to see focus states
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    <FormControlLabel control={<Switch />} label="Option 1" />
                    <FormControlLabel control={<Switch defaultChecked />} label="Option 2" />
                    <FormControlLabel control={<Switch />} label="Option 3" />
                    <FormControlLabel control={<Switch defaultChecked />} label="Option 4" />
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>

        {/* Checkbox Component Examples */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" sx={{ mb: 3, color: 'text.primary', fontWeight: 600 }}>
            Checkbox Component States
          </Typography>

          <Stack spacing={3}>
            {/* Default State */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                Default State
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checkboxStates.default}
                      onChange={(e) => setCheckboxStates({ ...checkboxStates, default: e.target.checked })}
                    />
                  }
                  label="Unchecked (hover me)"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checkboxStates.checked}
                      onChange={(e) => setCheckboxStates({ ...checkboxStates, checked: e.target.checked })}
                    />
                  }
                  label="Checked (hover me)"
                />
              </Box>
            </Box>

            {/* Focused State */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                Focused State (Tab to focus)
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                <FormControlLabel control={<Checkbox />} label="Focus me with Tab key" />
                <FormControlLabel control={<Checkbox defaultChecked />} label="Checked - Focus with Tab" />
              </Box>
            </Box>

            {/* Disabled State */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                Disabled State
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                <FormControlLabel control={<Checkbox disabled />} label="Disabled unchecked" />
                <FormControlLabel control={<Checkbox disabled checked />} label="Disabled checked" />
              </Box>
            </Box>

            {/* Indeterminate State */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                Indeterminate State
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkboxStates.indeterminate}
                    indeterminate={checkboxStates.indeterminate}
                    onChange={(e) => setCheckboxStates({ ...checkboxStates, indeterminate: e.target.checked })}
                  />
                }
                label="Indeterminate (partially selected)"
              />
            </Box>

            {/* Multiple Options */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                Multiple Checkbox Group
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControlLabel control={<Checkbox defaultChecked />} label="Enable notifications" />
                <FormControlLabel control={<Checkbox />} label="Enable email updates" />
                <FormControlLabel control={<Checkbox defaultChecked />} label="Enable two-factor authentication" />
                <FormControlLabel control={<Checkbox />} label="Enable transaction alerts" />
              </Box>
            </Box>
          </Stack>
        </Box>

        {/* Radio Button Component Examples */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" sx={{ mb: 3, color: 'text.primary', fontWeight: 600 }}>
            Radio Button Component States
          </Typography>

          <Stack spacing={3}>
            {/* Default State */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                Default State (Hover to see effect)
              </Typography>
              <FormControl>
                <FormLabel id="radio-default-group">Select Network</FormLabel>
                <RadioGroup
                  aria-labelledby="radio-default-group"
                  value={radioValue}
                  onChange={(e) => setRadioValue(e.target.value)}
                >
                  <FormControlLabel value="option1" control={<Radio />} label="Ethereum (hover me)" />
                  <FormControlLabel value="option2" control={<Radio />} label="Polygon (hover me)" />
                  <FormControlLabel value="option3" control={<Radio />} label="Arbitrum (hover me)" />
                </RadioGroup>
              </FormControl>
            </Box>

            {/* Focused State */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                Focused State (Tab to focus)
              </Typography>
              <FormControl>
                <FormLabel id="radio-focus-group">Payment Method</FormLabel>
                <RadioGroup aria-labelledby="radio-focus-group" defaultValue="crypto">
                  <FormControlLabel value="crypto" control={<Radio />} label="Cryptocurrency" />
                  <FormControlLabel value="fiat" control={<Radio />} label="Fiat Currency" />
                </RadioGroup>
              </FormControl>
            </Box>

            {/* Disabled State */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                Disabled State
              </Typography>
              <FormControl>
                <FormLabel id="radio-disabled-group">Transaction Type</FormLabel>
                <RadioGroup aria-labelledby="radio-disabled-group" defaultValue="send">
                  <FormControlLabel value="send" control={<Radio />} label="Send" />
                  <FormControlLabel value="receive" control={<Radio />} label="Receive" />
                  <FormControlLabel value="stake" control={<Radio disabled />} label="Stake (disabled)" />
                  <FormControlLabel value="swap" control={<Radio disabled />} label="Swap (disabled)" />
                </RadioGroup>
              </FormControl>
            </Box>

            {/* Horizontal Layout */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                Horizontal Layout
              </Typography>
              <FormControl>
                <FormLabel id="radio-horizontal-group">Token Standard</FormLabel>
                <RadioGroup row aria-labelledby="radio-horizontal-group" defaultValue="erc20">
                  <FormControlLabel value="erc20" control={<Radio />} label="ERC-20" />
                  <FormControlLabel value="erc721" control={<Radio />} label="ERC-721" />
                  <FormControlLabel value="erc1155" control={<Radio />} label="ERC-1155" />
                </RadioGroup>
              </FormControl>
            </Box>
          </Stack>
        </Box>

        {/* Alert Component Examples */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" sx={{ mb: 3, color: 'text.primary', fontWeight: 600 }}>
            Alert Component Variants
          </Typography>

          {/* Success Alert - Green */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
              Type: green (Success)
            </Typography>
            <AtomAlert
              type="success"
              id="alert-success"
              content={{
                heading: '',
                message: 'EVM address copied!',
              }}
            />
          </Box>

          {/* Error Alert - Red */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
              Type: red (Error)
            </Typography>
            <AtomAlert
              type="error"
              id="alert-error"
              content={{
                heading: '',
                message: 'EVM address copied!',
              }}
            />
          </Box>

          {/* Info Alert - Neutral */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
              Type: neutral (Info)
            </Typography>
            <AtomAlert
              type="info"
              id="alert-info"
              content={{
                heading: '',
                message: 'EVM address copied!',
              }}
            />
          </Box>

          {/* Warning Alert - Brand */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
              Type: brand (Warning)
            </Typography>
            <AtomAlert
              type="warning"
              id="alert-warning"
              content={{
                heading: '',
                message: 'EVM address copied!',
              }}
            />
          </Box>
        </Box>

        {/* Verification Button (uses bracket-styled contained primary) */}
        <Box sx={{ maxWidth: 820, mx: 'auto', mb: 4 }}>
          <AtomButton
            id="wallet-continue-button"
            label="CONTINUE"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
          />
        </Box>

        {/* Link Button Component Examples */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" sx={{ mb: 3, color: 'text.primary', fontWeight: 600 }}>
            Link Button Component States
          </Typography>

          <Stack spacing={3}>
            {/* Different Sizes */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                Size Large (l) - 18px
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                <AtomButton id="link-default-l" label="Button" variant="link" size="large" />
                <AtomButton id="link-hover-l" label="Button (hover me)" variant="link" size="large" />
                <AtomButton id="link-disabled-l" label="Button" variant="link" size="large" disabled />
              </Box>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                Size Medium (m) - 16px
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                <AtomButton id="link-default-m" label="Button" variant="link" size="medium" />
                <AtomButton id="link-hover-m" label="Button (hover me)" variant="link" size="medium" />
                <AtomButton id="link-disabled-m" label="Button" variant="link" size="medium" disabled />
              </Box>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                Size Small (s) - 14px
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                <AtomButton id="link-default-s" label="Button" variant="link" size="small" />
                <AtomButton id="link-hover-s" label="Button (hover me)" variant="link" size="small" />
                <AtomButton id="link-disabled-s" label="Button" variant="link" size="small" disabled />
              </Box>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                Size Extra Small (xs) - 12px
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                <AtomButton id="link-default-xs" label="Button" variant="link" size="xs" />
                <AtomButton id="link-hover-xs" label="Button (hover me)" variant="link" size="xs" />
                <AtomButton id="link-disabled-xs" label="Button" variant="link" size="xs" disabled />
              </Box>
            </Box>

            {/* All States Demo */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                All States (Tab to focus, hover for underline)
              </Typography>
              <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                    Default
                  </Typography>
                  <AtomButton id="link-state-default" label="Button" variant="link" />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                    Focused (Tab to focus)
                  </Typography>
                  <AtomButton id="link-state-focused" label="Button" variant="link" />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                    Hovered (Hover me)
                  </Typography>
                  <AtomButton id="link-state-hovered" label="Button" variant="link" />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                    Disabled
                  </Typography>
                  <AtomButton id="link-state-disabled" label="Button" variant="link" disabled />
                </Box>
              </Box>
            </Box>

            {/* Practical Use Cases */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                Practical Examples
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1" sx={{ color: 'text.primary' }}>
                    Need help?
                  </Typography>
                  <AtomButton
                    id="link-help"
                    label="Contact Support"
                    variant="link"
                    onClick={() => console.log('Contact support clicked')}
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1" sx={{ color: 'text.primary' }}>
                    Don&apos;t have an account?
                  </Typography>
                  <AtomButton
                    id="link-signup"
                    label="Sign up here"
                    variant="link"
                    onClick={() => console.log('Sign up clicked')}
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AtomButton
                    id="link-terms"
                    label="View Terms & Conditions"
                    variant="link"
                    size="small"
                    onClick={() => console.log('Terms clicked')}
                  />
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>

        {/* Button Component Variants - Comprehensive Showcase */}
        <Box sx={{ mb: 8, p: 4, border: '2px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Typography variant="h3" sx={{ mb: 4, color: 'text.primary', fontWeight: 700 }}>
            Button Component Variants
          </Typography>

          <Stack spacing={5}>
            {/* Contained Buttons */}
            <Box>
              <Typography variant="h5" sx={{ mb: 3, color: 'text.primary', fontWeight: 600 }}>
                Contained Variant (Primary)
              </Typography>
              <Stack spacing={3}>
                {/* All Sizes */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                    Button Sizes
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    <AtomButton id="contained-large" label="Large Button" variant="contained" size="large" />
                    <AtomButton id="contained-medium" label="Medium Button" variant="contained" size="medium" />
                    <AtomButton id="contained-small" label="Small Button" variant="contained" size="small" />
                    <AtomButton id="contained-xs" label="Extra Small" variant="contained" size="xs" />
                  </Box>
                </Box>

                {/* All States */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                    Button States
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    <AtomButton id="contained-default" label="Default" variant="contained" />
                    <AtomButton id="contained-hover" label="Hover Me" variant="contained" />
                    <AtomButton id="contained-focus" label="Press Tab" variant="contained" />
                    <AtomButton id="contained-disabled" label="Disabled" variant="contained" disabled />
                    <AtomButton id="contained-loading" label="Loading" variant="contained" isLoading />
                  </Box>
                </Box>

                {/* With Icons */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                    Buttons with Icons
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    <AtomButton 
                      id="contained-start-icon" 
                      label="Download" 
                      variant="contained" 
                      startIcon={<span>⬇</span>}
                    />
                    <AtomButton 
                      id="contained-end-icon" 
                      label="Next" 
                      variant="contained" 
                      endIcon={<span>→</span>}
                    />
                  </Box>
                </Box>

                {/* Full Width */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                    Full Width Button
                  </Typography>
                  <Box sx={{ maxWidth: 500 }}>
                    <AtomButton 
                      id="contained-fullwidth" 
                      label="Full Width Button" 
                      variant="contained" 
                      fullWidth
                    />
                  </Box>
                </Box>
              </Stack>
            </Box>

            {/* Outlined Buttons */}
            <Box>
              <Typography variant="h5" sx={{ mb: 3, color: 'text.primary', fontWeight: 600 }}>
                Outlined Variant
              </Typography>
              <Stack spacing={3}>
                {/* All Sizes */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                    Button Sizes
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    <AtomButton id="outlined-large" label="Large Button" variant="outlined" size="large" />
                    <AtomButton id="outlined-medium" label="Medium Button" variant="outlined" size="medium" />
                    <AtomButton id="outlined-small" label="Small Button" variant="outlined" size="small" />
                    <AtomButton id="outlined-xs" label="Extra Small" variant="outlined" size="xs" />
                  </Box>
                </Box>

                {/* All States */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                    Button States
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    <AtomButton id="outlined-default" label="Default" variant="outlined" />
                    <AtomButton id="outlined-hover" label="Hover Me" variant="outlined" />
                    <AtomButton id="outlined-focus" label="Press Tab" variant="outlined" />
                    <AtomButton id="outlined-disabled" label="Disabled" variant="outlined" disabled />
                  </Box>
                </Box>

                {/* With Icons */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                    Buttons with Icons
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    <AtomButton 
                      id="outlined-start-icon" 
                      label="Upload" 
                      variant="outlined" 
                      startIcon={<span>⬆</span>}
                    />
                    <AtomButton 
                      id="outlined-end-icon" 
                      label="Continue" 
                      variant="outlined" 
                      endIcon={<span>→</span>}
                    />
                  </Box>
                </Box>
              </Stack>
            </Box>

            {/* Text Buttons */}
            <Box>
              <Typography variant="h5" sx={{ mb: 3, color: 'text.primary', fontWeight: 600 }}>
                Text Variant
              </Typography>
              <Stack spacing={3}>
                {/* All Sizes */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                    Button Sizes
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    <AtomButton id="text-large" label="Large Button" variant="text" size="large" />
                    <AtomButton id="text-medium" label="Medium Button" variant="text" size="medium" />
                    <AtomButton id="text-small" label="Small Button" variant="text" size="small" />
                    <AtomButton id="text-xs" label="Extra Small" variant="text" size="xs" />
                  </Box>
                </Box>

                {/* All States */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                    Button States
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    <AtomButton id="text-default" label="Default" variant="text" />
                    <AtomButton id="text-hover" label="Hover Me" variant="text" />
                    <AtomButton id="text-focus" label="Press Tab" variant="text" />
                    <AtomButton id="text-disabled" label="Disabled" variant="text" disabled />
                  </Box>
                </Box>
              </Stack>
            </Box>

            {/* Button Groups / Combinations */}
            <Box>
              <Typography variant="h5" sx={{ mb: 3, color: 'text.primary', fontWeight: 600 }}>
                Button Combinations
              </Typography>
              <Stack spacing={3}>
                {/* Action Buttons */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                    Primary & Secondary Actions
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    <AtomButton id="combo-primary" label="Save Changes" variant="contained" />
                    <AtomButton id="combo-secondary" label="Cancel" variant="outlined" />
                  </Box>
                </Box>

                {/* Form Actions */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                    Form Actions (Aligned)
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <AtomButton id="form-cancel" label="Cancel" variant="text" />
                    <AtomButton id="form-submit" label="Submit" variant="contained" />
                  </Box>
                </Box>

                {/* Destructive Actions */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                    Destructive Actions
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    <AtomButton id="delete-primary" label="Delete Account" variant="contained" color="error" />
                    <AtomButton id="delete-outlined" label="Remove Item" variant="outlined" color="error" />
                  </Box>
                </Box>
              </Stack>
            </Box>

            {/* Real-world Examples */}
            <Box>
              <Typography variant="h5" sx={{ mb: 3, color: 'text.primary', fontWeight: 600 }}>
                Real-world Examples
              </Typography>
              <Stack spacing={3}>
                {/* Card with Actions */}
                <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2, maxWidth: 500 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Transaction Confirmation
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                    You are about to send 0.5 ETH to 0x1234...5678. This action cannot be undone.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <AtomButton id="confirm-cancel" label="Cancel" variant="outlined" />
                    <AtomButton id="confirm-send" label="Confirm & Send" variant="contained" />
                  </Box>
                </Box>

                {/* Loading States */}
                <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2, maxWidth: 500 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Loading States
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                    Buttons can show loading states during async operations
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <AtomButton id="loading-contained" label="Processing..." variant="contained" isLoading />
                    <AtomButton id="loading-outlined" label="Loading..." variant="outlined" isLoading />
                  </Box>
                </Box>

                {/* Disabled States */}
                <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2, maxWidth: 500 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Disabled States
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                    Disabled buttons indicate actions that are not currently available
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <AtomButton id="disabled-contained" label="Withdraw (Insufficient Balance)" variant="contained" disabled />
                    <AtomButton id="disabled-outlined" label="Connect Wallet" variant="outlined" disabled />
                  </Box>
                </Box>
              </Stack>
            </Box>

            {/* Bracket-Style Button Variants */}
            <Box>
              <Typography variant="h5" sx={{ mb: 3, color: 'text.primary', fontWeight: 600 }}>
                Bracket-Style Button Variants
              </Typography>
              <Stack spacing={4}>
                {/* Cyan Bracket (Primary) */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                    Cyan Bracket (Primary Color)
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                    Dark background with cyan brackets and text
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    <AtomButton id="bracket-cyan-large" label="LARGE BUTTON" variant="contained" color="primary" size="large" />
                    <AtomButton id="bracket-cyan-medium" label="MEDIUM BUTTON" variant="contained" color="primary" size="medium" />
                    <AtomButton id="bracket-cyan-small" label="SMALL BUTTON" variant="contained" color="primary" size="small" />
                    <AtomButton id="bracket-cyan-hover" label="HOVER ME" variant="contained" color="primary" size="medium" />
                    <AtomButton id="bracket-cyan-disabled" label="DISABLED" variant="contained" color="primary" size="medium" disabled />
                  </Box>
                </Box>

                {/* White Bracket (Secondary) */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                    White Bracket (Secondary Color)
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                    Black background with white brackets and text
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', bgcolor: yieldzNeutral[950], p: 2, borderRadius: 1 }}>
                    <AtomButton id="bracket-white-large" label="LARGE BUTTON" variant="contained" color="secondary" size="large" />
                    <AtomButton id="bracket-white-medium" label="MEDIUM BUTTON" variant="contained" color="secondary" size="medium" />
                    <AtomButton id="bracket-white-small" label="SMALL BUTTON" variant="contained" color="secondary" size="small" />
                    <AtomButton id="bracket-white-hover" label="HOVER ME" variant="contained" color="secondary" size="medium" />
                    <AtomButton id="bracket-white-disabled" label="DISABLED" variant="contained" color="secondary" size="medium" disabled />
                  </Box>
                </Box>

                {/* Cyan Transparent Bracket (Success) */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                    Cyan Transparent Bracket (Success Color)
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                    Transparent background, cyan brackets - becomes cyan on hover
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    <AtomButton id="bracket-transparent-large" label="LARGE BUTTON" variant="contained" color="success" size="large" />
                    <AtomButton id="bracket-transparent-medium" label="MEDIUM BUTTON" variant="contained" color="success" size="medium" />
                    <AtomButton id="bracket-transparent-small" label="SMALL BUTTON" variant="contained" color="success" size="small" />
                    <AtomButton id="bracket-transparent-hover" label="HOVER ME" variant="contained" color="success" size="medium" />
                    <AtomButton id="bracket-transparent-disabled" label="DISABLED" variant="contained" color="success" size="medium" disabled />
                  </Box>
                </Box>

                {/* Dark Gray Bracket (Info) */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                    Dark Gray Bracket (Info Color)
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                    Dark gray background with light gray brackets - becomes white on hover
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    <AtomButton id="bracket-gray-large" label="LARGE BUTTON" variant="contained" color="info" size="large" />
                    <AtomButton id="bracket-gray-medium" label="MEDIUM BUTTON" variant="contained" color="info" size="medium" />
                    <AtomButton id="bracket-gray-small" label="SMALL BUTTON" variant="contained" color="info" size="small" />
                    <AtomButton id="bracket-gray-hover" label="HOVER ME" variant="contained" color="info" size="medium" />
                    <AtomButton id="bracket-gray-disabled" label="DISABLED" variant="contained" color="info" size="medium" disabled />
                  </Box>
                </Box>

                {/* All States Comparison */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                    All Bracket Variants Side-by-Side
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    <AtomButton id="bracket-compare-1" label="CYAN PRIMARY" variant="contained" color="primary" />
                    <AtomButton id="bracket-compare-2" label="WHITE SECONDARY" variant="contained" color="secondary" />
                    <AtomButton id="bracket-compare-3" label="TRANSPARENT CYAN" variant="contained" color="success" />
                    <AtomButton id="bracket-compare-4" label="DARK GRAY" variant="contained" color="info" />
                  </Box>
                </Box>

                {/* Usage Examples */}
                <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2, maxWidth: 600 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Usage Example: Call-to-Action
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                    These bracket-styled buttons are perfect for hero sections and primary actions
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <AtomButton id="cta-1" label="GET STARTED" variant="contained" color="primary" size="large" />
                    <AtomButton id="cta-2" label="LEARN MORE" variant="contained" color="success" size="large" />
                  </Box>
                </Box>
              </Stack>
            </Box>

            {/* Accessibility Note */}
            <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                💡 Accessibility Tips
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                • Use Tab key to navigate through buttons
                <br />
                • Focus states are indicated with blue outline (#6388F7)
                <br />
                • Disabled buttons are not focusable
                <br />
                • Loading buttons prevent multiple submissions
                <br />
                • Always provide descriptive labels for screen readers
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Box>
          <Listing
            pageSize={pageSize}
            totalCount={totalCount}
            loading={loading}
            headers={headers}
            pageNumber={page}
            onRowsPerPageChange={handleRowsPerPageChange}
            onSortChangeHandler={() => {}}
            onPageChange={handlePageChange}
            rows={rows}
            noRecords="No token records found"
            isPaginationEnabled
            isDropdownAction
            hasCheckbox
            onSelectAllClick={handleSelectAllClick}
            selectedRows={selectedTokens}
          />
        </Box>
      </Box>
      {/* Select Box Examples */}
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Basic Select Box */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
            Basic Select Box
          </Typography>
          <Box sx={{ maxWidth: 300 }}>
            <SelectBox
              id="basic-select"
              name="basicSelect"
              label="Select Option"
              options={[
                { label: 'Option 1', value: 'opt1' },
                { label: 'Option 2', value: 'opt2' },
                { label: 'Option 3', value: 'opt3' },
              ]}
              placeholder="Choose an option"
            />
          </Box>
        </Box>

        {/* Network Select Box */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
            Network Select Box
          </Typography>
          <Box sx={{ maxWidth: 300 }}>
            <SelectBox
              id="network-select"
              name="networkSelect"
              label="Network"
              options={[
                { label: 'Ethereum', value: 'eth' },
                { label: 'Polygon', value: 'polygon' },
                { label: 'Arbitrum', value: 'arbitrum' },
                { label: 'Optimism', value: 'optimism' },
              ]}
              placeholder="Select network"
            />
          </Box>
        </Box>

        {/* Multiple Select Box */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
            Multiple Select Box
          </Typography>
          <Box sx={{ maxWidth: 400 }}>
            <SelectBox
              id="multiple-select"
              name="multipleSelect"
              label="Select Multiple Tokens"
              options={[
                { label: 'Bitcoin', value: 'btc' },
                { label: 'Ethereum', value: 'eth' },
                { label: 'Cardano', value: 'ada' },
                { label: 'Solana', value: 'sol' },
                { label: 'Polkadot', value: 'dot' },
              ]}
              multiple={true}
              placeholder="Select tokens"
            />
          </Box>
        </Box>
      </Box>

      {/* Progress Bar Examples */}
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Day-wise Progress Bar */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
            Day-wise Progress
          </Typography>
          <AtomProgressBar
            id="day-wise-progress"
            value={75}
            format="day-wise"
            timeDisplay={{ months: 2, days: 15, hours: 8 }}
            showLabel={true}
            visualVariant="segmented"
          />
        </Box>

        {/* Percentage Progress Bar */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
            Percentage Progress
          </Typography>
          <AtomProgressBar id="percentage-progress" value={65} format="percentage" showLabel={true} />
        </Box>

        {/* Yearly Progress Bar */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
            Yearly Progress
          </Typography>
          <AtomProgressBar
            id="yearly-progress"
            value={85}
            format="yearly"
            timeDisplay={{ years: 2, months: 6, days: 15 }}
            showLabel={true}
            visualVariant="lined"
          />
        </Box>

        {/* Quarterly Progress Bar */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
            Quarterly Progress
          </Typography>
          <AtomProgressBar
            id="quarterly-progress"
            value={70}
            format="quarterly"
            timeDisplay={{ quarters: 3, months: 2, days: 10 }}
            showLabel={true}
          />
        </Box>

        {/* Progress Bar without Label */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
            Progress without Label
          </Typography>
          <AtomProgressBar id="no-label-progress" value={45} format="percentage" showLabel={false} />
        </Box>

        {/* YieldsBadge Examples - All Variants */}
        <Box>
          <Typography variant="h4" sx={{ mb: 3, color: 'text.primary', fontWeight: 600 }}>
            Yields Badge Component
          </Typography>

          {/* Basic Variants Section */}

          {/* Token Status Badges */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
              Token Status
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <YieldsBadge variant="green" label="Listed" id="badge-listed" />
              <YieldsBadge variant="yellow" label="Under Review" id="badge-review" />
              <YieldsBadge variant="red" label="Delisted" id="badge-delisted" />
              <YieldsBadge variant="brand" label="Featured" id="badge-featured" />
              <YieldsBadge variant="neutral" label="Draft" id="badge-draft" />
            </Box>
          </Box>

          {/* Clickable Badges */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
              Clickable Badges (Hover to see effect)
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <YieldsBadge
                variant="neutral"
                label="Click Me"
                id="badge-clickable-neutral"
                onClick={() => alert('Neutral badge clicked!')}
              />
              <YieldsBadge
                variant="brand"
                label="Click Me"
                id="badge-clickable-brand"
                onClick={() => alert('Brand badge clicked!')}
              />
              <YieldsBadge
                variant="yellow"
                label="Click Me"
                id="badge-clickable-yellow"
                onClick={() => alert('Yellow badge clicked!')}
              />
              <YieldsBadge
                variant="red"
                label="Click Me"
                id="badge-clickable-red"
                onClick={() => alert('Red badge clicked!')}
              />
              <YieldsBadge
                variant="green"
                label="Click Me"
                id="badge-clickable-green"
                onClick={() => alert('Green badge clicked!')}
              />
            </Box>
          </Box>

          {/* Custom Styled Badges */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
              Custom Styled Badges
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
              <YieldsBadge
                variant="brand"
                label="Large Badge"
                id="badge-large"
                sx={{ fontSize: '1rem', px: 2.5, py: 1 }}
              />
              <YieldsBadge variant="green" label="Bold Badge" id="badge-bold" sx={{ fontWeight: 700 }} />
              <YieldsBadge
                variant="red"
                label="Small Badge"
                id="badge-small"
                sx={{ fontSize: '0.75rem', px: 1, py: 0.25 }}
              />
            </Box>
          </Box>
        </Box>

        <Box>
          <FeaturedTokens tokens={[...FEATURED_TOKENS].map(token => ({
            id: token.id,
            name: token.name,
            description: token.description,
            availability: token.availability,
            lockup: token.lockup,
            underlyingAsset: token.underlyingAsset,
            currentAPY: token.currentAPY,
          }))} />
        </Box>
        <Box padding={5}>
          <Footer />
        </Box>
        <Box sx={{ mb: 4 }}>
          <DashboardHeader />
        </Box>

        <CornerContainer
          sx={{
            width: 300,
            height: 150,
            borderColor: yieldzNeutral[700], // #343434
            background: yieldzNeutral[950], // #080808
            borderRadius: '16px',
          }}
        >
          <div style={{ color: 'white' }}>Curved Corner Container</div>
        </CornerContainer>

        {/* Radio Card Component Demo - Grid Layout */}
        <Box sx={{ mt: 6, mb: 6, px: 2 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ mb: 1, color: 'text.primary', fontWeight: 600 }}>
              Select Wallet Type
            </Typography>
            <Typography variant="body1" sx={{ color: yieldzNeutral[300] }}>
              Choose the type of wallet that best fits your needs
            </Typography>
          </Box>

          {/* Grid Layout for Radio Cards */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              },
              gap: 3,
              mb: 6,
            }}
          >
            <RadioCard
              label="Multi-Signature Wallet"
              description="Shared ownership permits up to 30 participants. Transactions require approval from all signers before execution."
              value="multisig"
              name="wallet-type"
              selected={selectedRadioCard === 'multisig'}
              onClick={() => setSelectedRadioCard('multisig')}
              data-testid="radio-card-multisig"
            />

            <RadioCard
              label="Standard Wallet"
              description="Single owner with full control. Execute transactions instantly without additional confirmations required."
              value="standard"
              name="wallet-type"
              selected={selectedRadioCard === 'standard'}
              onClick={() => setSelectedRadioCard('standard')}
              data-testid="radio-card-standard"
            />

            <RadioCard
              label="Smart Contract Wallet"
              description="Advanced features with programmable logic. Automate complex workflows and conditional transactions."
              value="smart"
              name="wallet-type"
              selected={selectedRadioCard === 'smart'}
              onClick={() => setSelectedRadioCard('smart')}
              data-testid="radio-card-smart"
            />

            <RadioCard
              label="Hardware Wallet"
              description="Maximum security with offline key storage. Compatible with Ledger and Trezor devices."
              value="hardware"
              name="wallet-type"
              selected={selectedRadioCard === 'hardware'}
              onClick={() => setSelectedRadioCard('hardware')}
              data-testid="radio-card-hardware"
            />

            <RadioCard
              label="Time-Locked Wallet"
              description="Assets locked until a specific time or condition. Perfect for vesting schedules and inheritance planning."
              value="timelock"
              name="wallet-type"
              selected={selectedRadioCard === 'timelock'}
              onClick={() => setSelectedRadioCard('timelock')}
              disabled={true}
              data-testid="radio-card-timelock"
            />

            <RadioCard
              label="Recovery Wallet"
              description="Social recovery mechanism with trusted guardians. Restore access if you lose your primary keys."
              value="recovery"
              name="wallet-type"
              selected={selectedRadioCard === 'recovery'}
              onClick={() => setSelectedRadioCard('recovery')}
              disabled={true}
              data-testid="radio-card-recovery"
            />
          </Box>

          <Box sx={{bgcolor:"#FFF", borderRadius:'0' , p:0 , m:0}}>
            <Box sx={{bgcolor:"background.default", border: "1px solid", borderRadius:'10px', height:'200px', width:'100%'}}></Box>
          </Box>

          {/* All States Demo Section */}
        </Box>
      </Box>
    </FormProvider>
  );
}
