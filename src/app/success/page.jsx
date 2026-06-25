import { redirect } from 'next/navigation';
import Link from 'next/link';

import { stripe } from '../../lib/stripe';
import { addPurchase } from '@/lib/actions/purchase';

export default async function SuccessPage({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id) {
    throw new Error('Please provide a valid session_id (`cs_test_...`)');
  }

  const {
    status,
    customer_details: { email: customerEmail }, 
    metadata
  } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent']
  });

  

  if (status === 'open') {
    redirect('/');
  }

  if (status === 'complete') {

    const purchaseData = {
      ...metadata,
      userEmail:customerEmail
    }

    const result = await addPurchase(purchaseData);
    console.log(result)

    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-16">
        <div className="w-full max-w-xl rounded-2xl border border-emerald-500/30 bg-slate-900 p-8 text-center shadow-2xl shadow-emerald-900/20">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
            Payment successful
          </p>
          <h1 className="mb-4 text-3xl font-bold text-white">
            Your Stripe payment was completed.
          </h1>
          <p className="mb-6 text-slate-300">
            We appreciate your business! A confirmation email will be sent to{' '}
            {customerEmail}. If you have any questions, please email{' '}
            <a href="mailto:orders@example.com" className="text-emerald-400 hover:underline">
              orders@example.com
            </a>
            .
          </p>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="rounded-full bg-emerald-500 px-5 py-2.5 font-medium text-slate-950 transition hover:bg-emerald-400"
            >
              Go to dashboard
            </Link>
            <Link
              href="/classes"
              className="rounded-full border border-slate-700 px-5 py-2.5 font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
            >
              Browse classes
            </Link>
          </div>
        </div>
      </main>
    );
  }
}
