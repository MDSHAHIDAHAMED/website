'use client';

import { Box, Container, Divider } from '@mui/material';
import { motion } from 'framer-motion';

import AtomTypography from '@/components/atoms/typography';
import Footer from '@/components/sections/footer';
import Header from '@/components/sections/header';

export default function TermsOfServicePage() {

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ py: 8 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <AtomTypography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
            Terms of Service
          </AtomTypography>
          <AtomTypography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
            Last updated: {new Date().toLocaleDateString()}
          </AtomTypography>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ mt: 4 }}>
            <AtomTypography variant="h5" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
              1. Acceptance of Terms
            </AtomTypography>
            <AtomTypography variant="body1" component="p" sx={{ mb: 2 }}>
              By accessing and using Yieldz, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </AtomTypography>

            <AtomTypography variant="h5" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
              2. Use License
            </AtomTypography>
            <AtomTypography variant="body1" component="p" sx={{ mb: 2 }}>
              Permission is granted to temporarily use Yieldz for personal, non-commercial transitory viewing only. Under this license you may not:
            </AtomTypography>
            <AtomTypography variant="body2" component="ul" sx={{ pl: 3 }}>
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose</li>
              <li>Attempt to reverse engineer any software contained on Yieldz</li>
              <li>Remove any copyright or other proprietary notations</li>
            </AtomTypography>

            <AtomTypography variant="h5" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
              3. Investment Risk Disclaimer
            </AtomTypography>
            <AtomTypography variant="body1" component="p" sx={{ mb: 2 }}>
              All investments carry risk. The value of investments can go down as well as up, and you may get back less than you invest. Past performance does not guarantee future results. Please consult with a financial advisor before making investment decisions.
            </AtomTypography>

            <AtomTypography variant="h5" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
              4. Account Responsibilities
            </AtomTypography>
            <AtomTypography variant="body1" component="p" sx={{ mb: 2 }}>
              You are responsible for maintaining the confidentiality of your account and password. You agree to:
            </AtomTypography>
            <AtomTypography variant="body2" component="ul" sx={{ pl: 3 }}>
              <li>Immediately notify us of any unauthorized use of your account</li>
              <li>Take all necessary steps to secure your account</li>
              <li>Ensure the accuracy of information provided</li>
            </AtomTypography>

            <AtomTypography variant="h5" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
              5. Limitation of Liability
            </AtomTypography>
            <AtomTypography variant="body1" component="p" sx={{ mb: 2 }}>
              Yieldz shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </AtomTypography>

            <AtomTypography variant="h5" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
              6. Governing Law
            </AtomTypography>
            <AtomTypography variant="body1" component="p" sx={{ mb: 2 }}>
              These Terms of Service are governed by and construed in accordance with applicable law, without regard to conflict of law provisions.
            </AtomTypography>

            <AtomTypography variant="h5" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
              7. Changes to Terms
            </AtomTypography>
            <AtomTypography variant="body1" component="p" sx={{ mb: 2 }}>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. Your continued use of the service after such changes constitutes acceptance of the new Terms.
            </AtomTypography>

            <AtomTypography variant="h5" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
              8. Contact Information
            </AtomTypography>
            <AtomTypography variant="body1" component="p" sx={{ mb: 2 }}>
              If you have any questions about these Terms of Service, please contact us through our website.
            </AtomTypography>
          </Box>
        </motion.div>
      </Container>
      <Footer />
    </>
  );
}

