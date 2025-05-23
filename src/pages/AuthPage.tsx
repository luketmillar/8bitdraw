import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { signIn, signUp } from '../api/supabase'
import { useAuth } from '../api/AuthContext'

const AuthPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()

  // If user is already logged in with a profile, redirect to draw page
  // If user is logged in but has no profile, redirect to create profile page
  const { profile } = useAuth()
  if (user) {
    if (profile) {
      navigate('/draw')
    } else {
      navigate('/create-profile')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (isSignUp) {
        // Sign up
        const { error } = await signUp(email, password)
        if (error) throw error
        setError('Please check your email for confirmation!')
      } else {
        // Sign in
        const { error } = await signIn(email, password)
        if (error) throw error
        // Redirect will happen automatically due to the useEffect above
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageContainer>
      <AuthCard>
        <Logo>8BitDraw</Logo>
        <Title>{isSignUp ? 'Create Account' : 'Welcome Back'}</Title>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor='password'>Password</Label>
            <Input
              id='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </InputGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Button type='submit' disabled={loading}>
            {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
        </Form>

        <SwitchText>
          {isSignUp ? 'Already have an account?' : 'Need an account?'}
          <SwitchButton type='button' onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </SwitchButton>
        </SwitchText>
      </AuthCard>
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

const AuthCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
`

const Logo = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.8rem;
`

const Title = styled.h2`
  text-align: center;
  color: #555;
  margin-bottom: 2rem;
  font-size: 1.2rem;
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

const SwitchText = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: #555;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
`

const SwitchButton = styled.button`
  background: none;
  border: none;
  color: #333;
  font-weight: bold;
  cursor: pointer;
  padding: 0;
  font-size: 0.9rem;

  &:hover {
    text-decoration: underline;
  }
`

export default AuthPage
