import Image from "next/image"

interface LogoProps {
  className?: string
}

export default function Logo({ className = "h-8 w-8" }: LogoProps) {
  return <Image src="/images/logo.png" alt="DZretour Logo" width={32} height={32} className={className} priority />
}
