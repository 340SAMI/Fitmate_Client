import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { stripe } from '../../../lib/stripe'
import { getUserSession } from '@/lib/core/Session'

export async function POST(request) {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const formData = await request.formData()

    const classId = formData.get('classId')
    const rawPrice = formData.get('price')
    const userId = formData.get('userId')
    const name = formData.get('name')
    const trainerId = formData.get('trainerId')
    const unitAmount = Number(rawPrice) * 100

    if (!Number.isFinite(unitAmount) || unitAmount <= 0) {
      return NextResponse.json({ error: 'Valid price is required' }, { status: 400 })
    }

    const user = await getUserSession()

    if (!user?.email) {
      return NextResponse.redirect(new URL('/authenticate/signin', origin), 303)
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: classId ? `Class booking ${name}` : 'Class booking',
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/classes`,
      metadata: {
        classId: classId?.toString() || '',
        userId: userId?.toString() || '',
        trainerId: trainerId?.toString() || '',
        price: unitAmount,
        mainPrice: rawPrice,
        name: name?.toString() || '',
      },
    })

    return NextResponse.redirect(session.url, 303)
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    )
  }
}