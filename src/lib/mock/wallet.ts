/**
 * Mock functions for wallet-related API calls
 */

export interface WalletConnectResponse {
  status: 'success' | 'error';
  message: string;
  data: {
    id?: string;
    userId?: string;
    address?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  errorCode?: number;
}

/**
 * Mocks wallet connection API.
 * Simulates POST /users/wallet-address endpoint.
 * 
 * @param address - The wallet address to connect
 * @returns Promise with wallet connection response
 */
export async function mockWalletConnectApi(
  address: string
): Promise<WalletConnectResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock different scenarios based on address or random behavior
  // You can customize this logic based on your testing needs
  
  // Scenario 1: Success - new wallet address
  if (address && !address.includes('existing') && !address.includes('error')) {
    return {
      status: 'success',
      message: 'Wallet address added successfully',
      data: {
        id: 'wlt_' + address.toLowerCase().substring(2, 15),
        userId: 'usr_' + address.toLowerCase().substring(2, 15),
        address: address.toLowerCase(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  }

  // Scenario 2: Error - wallet address already exists (400)
  if (address?.toLowerCase().includes('existing') || address?.toLowerCase().includes('duplicate')) {
    const error = new Error('Wallet address already exists');
    (error as any).response = {
      status: 400,
      data: {
        status: 'error',
        message: 'Wallet address already exists',
        data: {},
        errorCode: 400,
      },
    };
    throw error;
  }

  // Scenario 3: Error - wallet address already exists (409 Conflict)
  if (address?.toLowerCase().includes('conflict')) {
    const error = new Error('Wallet address already exists');
    (error as any).response = {
      status: 409,
      data: {
        status: 'error',
        message: 'Wallet address already exists',
        data: {},
        errorCode: 409,
      },
    };
    throw error;
  }

  // Scenario 4: Error - user not found (404)
  if (address?.toLowerCase().includes('notfound')) {
    const error = new Error('User not found');
    (error as any).response = {
      status: 404,
      data: {
        status: 'error',
        message: 'User not found',
        data: {},
        errorCode: 404,
      },
    };
    throw error;
  }

  // Scenario 5: Error - unauthorized (401)
  if (address?.toLowerCase().includes('unauthorized')) {
    const error = new Error('Unauthorized');
    (error as any).response = {
      status: 401,
      data: {
        status: 'error',
        message: 'Unauthorized',
        data: {},
        errorCode: 401,
      },
    };
    throw error;
  }

  // Scenario 6: Error - internal server error (500)
  if (address?.toLowerCase().includes('servererror')) {
    const error = new Error('Internal server error');
    (error as any).response = {
      status: 500,
      data: {
        status: 'error',
        message: 'Internal server error',
        data: {},
        errorCode: 500,
      },
    };
    throw error;
  }

  // Scenario 7: Error - address is required (400)
  if (!address || address.trim() === '') {
    const error = new Error('Address is required');
    (error as any).response = {
      status: 400,
      data: {
        status: 'error',
        message: 'Address is required',
        data: {},
        errorCode: 400,
      },
    };
    throw error;
  }

  // Default: Success response
  return {
    status: 'success',
    message: 'Wallet address added successfully',
    data: {
      id: 'wlt_' + address.toLowerCase().substring(2, 15),
      userId: 'usr_' + address.toLowerCase().substring(2, 15),
      address: address.toLowerCase(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };
}

