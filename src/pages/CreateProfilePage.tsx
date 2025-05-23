import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { createProfile, checkUsernameAvailable } from '../api/supabase'
import { useAuth } from '../api/AuthContext'

const CreateProfilePage = () => {
  const [username, setUsername] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [usernameError, setUsernameError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(false)
  const navigate = useNavigate()

  const { user, refreshProfile } = useAuth()

  // If not authenticated, redirect to auth page
  useEffect(() => {
    if (!user) {
      navigate('/auth')
    }
  }, [user, navigate])

  // Check username availability with debounce
  useEffect(() => {
    if (!username || username.length < 3) return

    const timer = setTimeout(async () => {
      setChecking(true)
      try {
        const { available, error } = await checkUsernameAvailable(username)
        if (error) throw error

        if (!available) {
          setUsernameError('Username is already taken')
        } else {
          setUsernameError(null)
        }
      } catch (err) {
        console.error('Error checking username:', err)
      } finally {
        setChecking(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [username])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return
    if (usernameError) return
    if (username.length < 3) {
      setUsernameError('Username must be at least 3 characters')
      return
    }

    setLoading(true)

    try {
      const { error } = await createProfile(user.id, username, avatarUrl || undefined)
      if (error) throw error

      await refreshProfile()
      navigate('/draw')
    } catch (err: any) {
      console.error('Error creating profile:', err)
      setUsernameError(err.message || 'Failed to create profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageContainer>
      <ProfileCard>
        <Title>Create Your Profile</Title>
        <Subtitle>One last step before you start drawing</Subtitle>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor='username'>
              Username <Required>*</Required>
            </Label>
            <Input
              id='username'
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder='Choose a unique username'
              required
              minLength={3}
              maxLength={20}
            />
            {checking && <CheckingMessage>Checking availability...</CheckingMessage>}
            {usernameError && <ErrorMessage>{usernameError}</ErrorMessage>}
            <HelpText>Username must be at least 3 characters</HelpText>
          </InputGroup>

          <InputGroup>
            <Label htmlFor='avatar'>Avatar URL (optional)</Label>
            <Input
              id='avatar'
              type='url'
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder='https://example.com/your-avatar.jpg'
            />
          </InputGroup>

          <Button
            type='submit'
            disabled={loading || !!usernameError || checking || username.length < 3}
          >
            {loading ? 'Creating Profile...' : 'Create Profile'}
          </Button>
        </Form>
      </ProfileCard>
    </PageContainer>
  )
}

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f0f0;
`

const ProfileCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
`

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.8rem;
`

const Subtitle = styled.p`
  text-align: center;
  color: #555;
  margin-bottom: 2rem;
  font-size: 1rem;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const Label = styled.label`
  font-size: 0.9rem;
  color: #555;
  display: flex;
  align-items: center;
`

const Required = styled.span`
  color: #e74c3c;
  margin-left: 0.25rem;
`

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  outline: none;

  &:focus {
    border-color: #555;
  }
`

const Button = styled.button`
  background-color: #333;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1rem;

  &:hover {
    background-color: #444;
  }

  &:disabled {
    background-color: #999;
    cursor: not-allowed;
  }
`

const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 0.9rem;
  margin: 0;
`

const CheckingMessage = styled.p`
  color: #3498db;
  font-size: 0.9rem;
  margin: 0;
`

const HelpText = styled.p`
  color: #777;
  font-size: 0.8rem;
  margin: 0;
`

export default CreateProfilePage
