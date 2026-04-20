import { redirect } from 'next/navigation';

import { paths } from '@/paths';

/**
 * Default verify-code page redirects to email verification by default
 * This maintains backward compatibility for any existing links
 */
export default function Page(): never {
  redirect(paths.auth.custom.verifyCode.email);
}
