import { NextResponse } from 'next/server';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * Apple App Site Association Route Handler
 * ========================================
 * Serves the apple-app-site-association.json file at /.well-known/apple-app-site-association
 * 
 * Apple requires this file to be:
 * - Accessible at /.well-known/apple-app-site-association (no .json extension)
 * - Served with Content-Type: application/json
 * - Served over HTTPS
 * 
 * Reference: Similar to how assetlinks.json is served
 * 
 * @returns JSON response with apple-app-site-association data
 */
export async function GET(): Promise<NextResponse> {
  try {
    // Read the JSON file from the public folder
    const filePath = join(process.cwd(), 'public', '.well-known', 'apple-app-site-association.json');
    const fileContents = await readFile(filePath, 'utf-8');
    
    // Parse to validate JSON structure
    const jsonData = JSON.parse(fileContents);
    
    // Return the JSON with proper content-type header
    return NextResponse.json(jsonData, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error reading apple-app-site-association file:', error);
    }
    
    // Return 404 if file not found or invalid
    return new NextResponse(null, {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
