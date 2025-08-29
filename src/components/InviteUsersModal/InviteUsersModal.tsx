import { useState, useEffect } from 'react'
import './InviteUsersModal.css'

interface InviteUsersModalProps {
  isOpen: boolean
  onClose: () => void
  onInvite: (emails: string[]) => void
  isLoading?: boolean
}

export const InviteUsersModal = ({ isOpen, onClose, onInvite, isLoading = false }: InviteUsersModalProps) => {
  const [emailInput, setEmailInput] = useState('')
  const [validEmails, setValidEmails] = useState<string[]>([])
  const [errors, setErrors] = useState<string[]>([])

  // Email validation function
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.trim())
  }

  // Process email input
  const processEmailInput = (input: string) => {
    const emails = input
      .split(/[,\n]/)
      .map(email => email.trim())
      .filter(email => email.length > 0)

    const valid: string[] = []
    const invalid: string[] = []

    emails.forEach(email => {
      if (isValidEmail(email)) {
        if (!valid.includes(email)) {
          valid.push(email)
        }
      } else if (email.length > 0) {
        invalid.push(email)
      }
    })

    setValidEmails(valid)
    setErrors(invalid)
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setEmailInput(value)
    processEmailInput(value)
  }

  // Handle key press for adding emails
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      processEmailInput(emailInput)
    }
  }

  // Remove email chip
  const removeEmail = (emailToRemove: string) => {
    const updatedEmails = validEmails.filter(email => email !== emailToRemove)
    setValidEmails(updatedEmails)
    
    // Update input to reflect removed email
    const remainingEmails = emailInput
      .split(/[,\n]/)
      .map(email => email.trim())
      .filter(email => email !== emailToRemove && email.length > 0)
    
    setEmailInput(remainingEmails.join(', '))
  }

  // Handle invite
  const handleInvite = () => {
    if (validEmails.length > 0) {
      onInvite(validEmails)
    }
  }

  // Reset modal state when closed
  useEffect(() => {
    if (!isOpen) {
      setEmailInput('')
      setValidEmails([])
      setErrors([])
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="invite-modal-overlay" onClick={onClose}>
      <div className="invite-modal" onClick={(e) => e.stopPropagation()}>
        <div className="invite-modal-header">
          <h2>Invite Users</h2>
          <button
            onClick={onClose}
            className="invite-modal-close"
            disabled={isLoading}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="invite-modal-body">
          <div className="email-input-section">
            <label htmlFor="email-input">Email Addresses</label>
            <textarea
              id="email-input"
              value={emailInput}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter email addresses..."
              className="email-input"
              rows={4}
              disabled={isLoading}
            />
            <p className="input-hint">
              Separate multiple emails with commas or line breaks
            </p>
          </div>

          {/* Valid Email Chips */}
          {validEmails.length > 0 && (
            <div className="email-chips-section">
              <label>Valid Emails ({validEmails.length})</label>
              <div className="email-chips">
                {validEmails.map((email) => (
                  <div key={email} className="email-chip valid">
                    <span>{email}</span>
                    <button
                      onClick={() => removeEmail(email)}
                      className="remove-chip"
                      disabled={isLoading}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Invalid Email Errors */}
          {errors.length > 0 && (
            <div className="email-errors-section">
              <label className="error-label">Invalid Emails</label>
              <div className="email-errors">
                {errors.map((email, index) => (
                  <div key={index} className="email-chip invalid">
                    <span>{email}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="invite-modal-footer">
          <button
            onClick={onClose}
            className="btn-secondary"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleInvite}
            className="btn-primary"
            disabled={validEmails.length === 0 || isLoading}
          >
            {isLoading ? 'Sending Invites...' : `Invite ${validEmails.length} User${validEmails.length !== 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  )
}