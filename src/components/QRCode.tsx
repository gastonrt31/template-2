'use client'

import { QRCodeSVG } from 'qrcode.react'

interface QRCodeProps {
  data: string
  size?: number
  id?: string
}

export function QRCode({ data, size = 128, id }: QRCodeProps) {
  return (
    <div id={id} className="inline-block bg-white p-2 rounded-lg">
      <QRCodeSVG
        value={data}
        size={size}
        level="H"
        includeMargin={true}
      />
    </div>
  )
} 