"use client"

import React, { createContext, useContext, useState, useCallback } from "react"
import { Friend } from "@/types/friend"

type FriendModalContextValue = {
  openModal: (friend?: Friend | null) => void
  closeModal: () => void
  isOpen: boolean
  editingFriend: Friend | null
  savedCount: number
  notifySaved: () => void
}

const FriendModalContext = createContext<FriendModalContextValue | undefined>(undefined)

export const FriendModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [editingFriend, setEditingFriend] = useState<Friend | null>(null)
  const [savedCount, setSavedCount] = useState(0)

  const openModal = useCallback((friend?: Friend | null) => {
    setEditingFriend(friend ?? null)
    setIsOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsOpen(false)
    setEditingFriend(null)
  }, [])

  const notifySaved = useCallback(() => {
    setSavedCount((s) => s + 1)
    setIsOpen(false)
    setEditingFriend(null)
  }, [])

  return (
    <FriendModalContext.Provider value={{ openModal, closeModal, isOpen, editingFriend, savedCount, notifySaved }}>
      {children}
    </FriendModalContext.Provider>
  )
}

export const useFriendModal = () => {
  const ctx = useContext(FriendModalContext)
  if (!ctx) throw new Error("useFriendModal must be used within FriendModalProvider")
  return ctx
}

export default FriendModalContext
