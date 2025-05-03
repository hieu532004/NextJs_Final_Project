import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {

  const paymentStatus = req.cookies.get('paymentStatus')?.value;

  if (paymentStatus !== 'success') {
    return NextResponse.redirect(new URL('/', req.url)); // Redirect to homepage
  }


  return NextResponse.next();
}


export const config = {
  matcher: '/payment-success', // Only apply middleware to '/payment-success'
};
