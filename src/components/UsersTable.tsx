'use client'

import { useState } from 'react'
import { User, StageNumber } from '@/types'
import { QRCode } from './QRCode'
import { QRScanner } from './QRScanner'
import { updateStageStatus } from '@/lib/supabase/supabaseUtils'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Scan, CheckCircle2, Clock, Download } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { downloadQRCode } from '@/lib/utils/qrDownload'

interface UsersTableProps {
  users: User[]
}

export function UsersTable({ users }: UsersTableProps) {
  const [scanning, setScanning] = useState(false)

  const getNextPendingStage = (user: User): StageNumber | null => {
    const stages: StageNumber[] = ['1', '2', '3']
    
    // Check stages in sequence
    for (const stage of stages) {
      if (user.stages[stage]?.status === 'PENDING') {
        return stage
      }
    }
    return null
  }

  const handleScan = async (data: string) => {
    try {
      const scannedData = JSON.parse(data)
      const user = users.find(u => {
        const userData = {
          name: u.name,
          license_plate: u.license_plate,
          identity_card_number: u.identity_card_number
        }
        return JSON.stringify(userData) === JSON.stringify(scannedData)
      })

      if (!user) {
        alert('QR code does not match any user')
        return
      }

      const nextStage = getNextPendingStage(user)
      if (!nextStage) {
        alert('All stages are already completed for this user')
        setScanning(false)
        return
      }

      await updateStageStatus(user.id, nextStage, 'CHECK')
      alert(`Successfully marked Stage ${nextStage} as completed for ${user.name}`)
      setScanning(false)
    } catch (error) {
      console.error('Error processing scan:', error)
      alert('Error processing QR code')
    }
  }

  const getStageStatus = (stage: Stage) => {
    if (stage?.status === 'CHECK') {
      return (
        <div className="flex items-center gap-2">
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </Badge>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {format(new Date(stage.scan_time || ''), 'HH:mm')}
          </span>
        </div>
      )
    }
    return (
      <Badge variant="secondary">
        Pending
      </Badge>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => setScanning(true)}
          className="flex items-center gap-2"
        >
          <Scan className="h-4 w-4" />
          Scan QR Code
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User Info</TableHead>
              <TableHead>QR Code</TableHead>
              <TableHead>Stage 1</TableHead>
              <TableHead>Stage 2</TableHead>
              <TableHead>Stage 3</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.license_plate}</div>
                    <div className="text-sm text-gray-500">{user.identity_card_number}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <QRCode 
                      data={user.qr_code} 
                      size={96} 
                      id={`qr-${user.name}`}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full flex items-center gap-2"
                      onClick={() => downloadQRCode(user.qr_code, user.name)}
                    >
                      <Download className="h-4 w-4" />
                      Download QR
                    </Button>
                  </div>
                </TableCell>
                <TableCell>{getStageStatus(user.stages['1'])}</TableCell>
                <TableCell>{getStageStatus(user.stages['2'])}</TableCell>
                <TableCell>{getStageStatus(user.stages['3'])}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {scanning && (
        <QRScanner
          onScan={handleScan}
          onClose={() => setScanning(false)}
        />
      )}
    </div>
  )
} 