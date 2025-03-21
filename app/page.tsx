'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Spinner from '@/components/Spinner'

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    router.push('/socials')
  }, [router])

  return <Spinner />
}