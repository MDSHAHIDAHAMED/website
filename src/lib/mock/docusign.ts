/**
 * DocuSign Mock Service
 * ---------------------
 * Mock implementation for DocuSign API responses
 * Used for development/testing when backend API is not ready
 * 
 * Follows SOLID principles and factory pattern
 * 
 * To disable mock and use real API:
 * Set USE_MOCK_DOCUSIGN to false in config or environment variable
 */

import type { DocuSignConfirmRequest, DocuSignConfirmResponse, DocuSignUrlRequest, DocuSignUrlResponse } from '@/types/docusign';

/**
 * Mock configuration
 * Set to false when backend API is ready
 */
export const USE_MOCK_DOCUSIGN = false;

/**
 * Mock delay to simulate API latency (in milliseconds)
 * Helps simulate real-world network conditions during development
 */
const MOCK_API_DELAY_MS = 800;

/**
 * Simulate API delay
 * Creates realistic delay for mock API responses
 */
const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock DocuSign URL Response
 * Matches the actual backend API response structure:
 * {
 *   "status": "success",
 *   "data": { "envelopeId": "...", "signingUrl": "..." },
 *   "message": "..."
 * }
 * 
 * Using verified working DocuSign demo URL
 * URL is valid and tested: https://demo.docusign.net/Signing/MTRedeem/v1/89a67998-1ed9-42bc-9f5a-044a6e723865
 */
const MOCK_DOCUSIGN_RESPONSE: DocuSignUrlResponse = {
  signingUrl: 'https://demo.docusign.net/Signing/MTRedeem/v1/89a67998-1ed9-42bc-9f5a-044a6e723865?slt=eyJ0eXAiOiJNVCIsImFsZyI6IlJTMjU2Iiwia2lkIjoiNjgxODVmZjEtNGU1MS00Y2U5LWFmMWMtNjg5ODEyMjAzMzE3In0.AQYAAAABAAMABwAAh0ZhpiXeSAgAACdY6Mcl3kgYAAEAAAAAAAAAIQDsAgAAeyJUb2tlbklkIjoiYzMyZjkwZDAtOGYyMy00MzZhLWFlNTctN2Q1MDgxZGRkZjAxIiwiRXhwaXJhdGlvbiI6IjIwMjUtMTEtMTdUMDc6MDE6MDYrMDA6MDAiLCJJc3N1ZWRBdCI6IjIwMjUtMTEtMTdUMDY6NTY6MDYuOTM4MTY1NyswMDowMCIsIlJlc291cmNlSWQiOiI4NDliMTFjNy1jMTgzLThjYzctODE5YS05NzE4MDViNDEwZTgiLCJSZXNvdXJjZXMiOiJ7XCJFbnZlbG9wZUlkXCI6XCI4NDliMTFjNy1jMTgzLThjYzctODE5YS05NzE4MDViNDEwZThcIixcIkFjdG9yVXNlcklkXCI6XCJjZmJiNjI4YS1lNTY3LTQyOTEtYjdmOS0zYWY2ZGQyMTAzOTFcIixcIlJlY2lwaWVudElkXCI6XCJjMzhjMTA2ZC03NWIzLTg2MWUtODFiNi02NGQ2MjJiNDEwNmRcIixcIkZha2VRdWVyeVN0cmluZ1wiOlwidD0xZDE3MTc1NC0wYjIzLTg1OWUtODEyYi0wOWNmMGJiNDEwNzNcIixcIkludGVncmF0b3JLZXlcIjpcIjhjOTQ3MGNlLTQwODItNGNkNi1iZWJlLTJiODg3ZmIwMjE2ZlwiLFwiQ3JlYXRlZEF0XCI6XCIyMDI1LTExLTE3VDA2OjU2OjA2LjgxOTQ5MTRaXCJ9IiwiVG9rZW5UeXBlIjoxLCJBdWRpZW5jZSI6IjI1ZTA5Mzk4LTAzNDQtNDkwYy04ZTUzLTNhYjJjYTU2MjdiZiIsIlJlZGlyZWN0VXJpIjoiaHR0cHM6Ly9kZW1vLmRvY3VzaWduLm5ldC9TaWduaW5nL1N0YXJ0SW5TZXNzaW9uLmFzcHgiLCJIYXNoQWxnb3JpdGhtIjowLCJIYXNoUm91bmRzIjowLCJUb2tlblN0YXR1cyI6MCwiSXNTaW5nbGVVc2UiOmZhbHNlfT8AgE5-E6cl3kg.ZMKo63Y0PetoqCSmnmqN8keldNnomAkUVNeCfTF6MWsQJIKyf3YGuHdcztk6650hzSxWnoJf9VFdfsQG8EaWxsMsqKmqTm6ab2xi4yfq_FglyhBCQqdiHXRN4lLRBLfX6ENKd3Qg5yVPJ2rmtSUJbf4iw3Kklih85IXvCbdPNLU7pxj-RRb7648V1xMS8NQZW2Cl3UkKvzf0UjHbIGwj4iSzT5KWTPxJx9yvaphS8QpjLYm7Sah7Ii74Ob_8qC1zrl2U-U4k-PrsCuJymBslHZU94hYXvutqD25n0pw01WJ0iZ2CZGwmzw2pjtmDW0paRyvoTZJ7gaivPAlg1-WO4A',
  envelopeId: '849b11c7-c183-8cc7-819a-971805b410e8',
  expiresAt: '2025-11-17T07:01:06+00:00',
};

/**
 * Mock Get DocuSign URL
 * Simulates backend API call to get signing URL
 * 
 * @param request - Request payload (investorId, returnUrl, etc.)
 * @returns Promise resolving to mock DocuSignUrlResponse
 * 
 * Real API endpoint: POST /documents/sign
 * Real Response structure: { status: "success", data: { envelopeId, signingUrl }, message }
 */
export async function getMockDocuSignUrl(request: DocuSignUrlRequest): Promise<DocuSignUrlResponse> {
  // Simulate API delay
  await delay(MOCK_API_DELAY_MS);

  // Validate request (same validation as real API would do)
  if (!request.investorId) {
    throw new Error('investorId is required');
  }

  if (!request.returnUrl) {
    throw new Error('returnUrl is required');
  }

  return MOCK_DOCUSIGN_RESPONSE;
}

/**
 * Mock Confirm DocuSign Signing
 * Simulates backend API call to confirm signing completion
 * 
 * @param request - Confirmation request (envelopeId, event)
 * @returns Promise resolving to mock DocuSignConfirmResponse
 * 
 * Real API endpoint: POST /docusign/confirm
 */
export async function getMockDocuSignConfirm(request: DocuSignConfirmRequest): Promise<DocuSignConfirmResponse> {
  // Simulate API delay
  await delay(MOCK_API_DELAY_MS);

  const response: DocuSignConfirmResponse = {
    success: true,
    message: 'Document signed successfully!',
    envelopeId: request.envelopeId,
  };
  return response;
}

