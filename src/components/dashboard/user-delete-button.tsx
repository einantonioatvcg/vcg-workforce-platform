"use client"

import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { adminDeleteUser } from '@/app/actions/auth'

interface UserDeleteButtonProps {
  userId: string
  userEmail: string
}

export function UserDeleteButton({ userId, userEmail }: UserDeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm(`¿Estás seguro de que deseas eliminar permanentemente a ${userEmail}?`)) {
      return
    }

    setIsDeleting(true)
    try {
      const result = await adminDeleteUser(userId)
      if (result.error) {
        alert('Error al eliminar usuario: ' + result.error)
      }
    } catch (err) {
       console.error(err)
       alert('Error inesperado al eliminar')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
      title="Eliminar usuario"
    >
      {isDeleting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </button>
  )
}
