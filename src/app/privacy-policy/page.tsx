'use client';

import { Box, Container, Divider } from '@mui/material';
import { motion } from 'framer-motion';

import AtomTypography from '@/components/atoms/typography';
import Footer from '@/components/sections/footer';
import Header from '@/components/sections/header';

export default function PrivacyPolicyPage() {

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ py: 8 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <AtomTypography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
            Privacy Policy
          </AtomTypography>
          <AtomTypography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
            Last updated: {new Date().toLocaleDateString()}
          </AtomTypography>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ mt: 4 }}>
            <AtomTypography variant="h5" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
              1. Introduction
            </AtomTypography>
            <AtomTypography variant="body1" component="p" sx={{ mb: 2 }}>
              Yieldz ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
            </AtomTypography>

            <AtomTypography variant="h5" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
              2. Information We Collect
            </AtomTypography>
            <AtomTypography variant="body1" component="p" sx={{ mb: 2 }}>
              We collect information that you provide directly to us, including:
            </AtomTypography>
            <AtomTypography variant="body2" component="ul" sx={{ pl: 3 }}>
              <li>Name and contact information</li>
              <li>Email address</li>
              <li>Financial information related to transactions</li>
              <li>Authentication credentials</li>
            </AtomTypography>

            <AtomTypography variant="h5" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
              3. How We Use Your Information
            </AtomTypography>
            <AtomTypography variant="body1" component="p" sx={{ mb: 2 }}>
              We use the information we collect to:
            </AtomTypography>
            <AtomTypography variant="body2" component="ul" sx={{ pl: 3 }}>
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
            </AtomTypography>

            <AtomTypography variant="h5" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
              4. Information Sharing
            </AtomTypography>
            <AtomTypography variant="body1" component="p" sx={{ mb: 2 }}>
              We do not sell or trade your personal information. We may share your information only in the following circumstances:
            </AtomTypography>
            <AtomTypography variant="body2" component="ul" sx={{ pl: 3 }}>
              <li>With your consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and prevent fraud</li>
              <li>With service providers who assist us in operating our service</li>
            </AtomTypography>

            <AtomTypography variant="h5" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
              5. Data Security
            </AtomTypography>
            <AtomTypography variant="body1" component="p" sx={{ mb: 2 }}>
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </AtomTypography>

            <AtomTypography variant="h5" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
              6. Your Rights
            </AtomTypography>
            <AtomTypography variant="body1" component="p" sx={{ mb: 2 }}>
              You have the right to access, update, or delete your personal information. You may also opt-out of certain data processing activities. Contact us to exercise these rights.
            </AtomTypography>

            <AtomTypography variant="h5" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
              7. Contact Us
            </AtomTypography>
            <AtomTypography variant="body1" component="p" sx={{ mb: 2 }}>
              If you have any questions about this Privacy Policy, please contact us through our website.
            </AtomTypography>
          </Box>
        </motion.div>
      </Container>
      <Footer />
    </>
  );
}

