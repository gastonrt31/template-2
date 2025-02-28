export const downloadQRCode = (qrData: string, userName: string) => {
  // Get the QR code SVG element
  const svg = document.getElementById(`qr-${userName}`)?.querySelector('svg')
  if (!svg) return

  // Create a canvas element
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Set canvas size (with padding)
  const padding = 20
  canvas.width = 256 + (padding * 2)
  canvas.height = 256 + (padding * 2)

  // Fill white background
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Convert SVG to data URL
  const svgData = new XMLSerializer().serializeToString(svg)
  const img = new Image()
  
  img.onload = () => {
    // Draw the image centered with padding
    ctx.drawImage(img, padding, padding, 256, 256)
    
    // Convert to data URL and trigger download
    const dataUrl = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = `qr-code-${userName.toLowerCase().replace(/\s+/g, '-')}.png`
    link.href = dataUrl
    link.click()
  }

  img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
} 