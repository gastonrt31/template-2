'use client'

import { useEffect, useRef, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'

interface QRScannerProps {
  onScan: (data: string) => void
  onClose: () => void
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [error, setError] = useState<string>('')
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)

  useEffect(() => {
    // Create scanner instance
    scannerRef.current = new Html5QrcodeScanner(
      'qr-reader',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1,
      },
      false
    )

    // Start scanning
    scannerRef.current.render(
      (decodedText) => {
        try {
          // Validate the QR code data
          const data = JSON.parse(decodedText)
          if (data.name && data.license_plate && data.identity_card_number) {
            onScan(decodedText)
            if (scannerRef.current) {
              scannerRef.current.clear()
            }
          } else {
            setError('Invalid QR code format')
          }
        } catch (e) {
          setError('Invalid QR code data')
        }
      },
      (error) => {
        // Ignore errors as they occur frequently during scanning
        console.debug('QR scan error:', error)
      }
    )

    // Cleanup
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear()
      }
    }
  }, [onScan])

  const handleClose = () => {
    if (scannerRef.current) {
      scannerRef.current.clear()
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg max-w-lg w-full mx-4">
        <div className="mb-4">
          <h3 className="text-lg font-medium">Scan QR Code</h3>
          {error && (
            <p className="text-red-500 text-sm mt-1">{error}</p>
          )}
        </div>

        <div id="qr-reader" className="w-full" />

        <button
          type="button"
          onClick={handleClose}
          className="mt-4 w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
        >
          Close Scanner
        </button>
      </div>
    </div>
  )
} 