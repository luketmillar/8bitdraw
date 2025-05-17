import { Link, useLocation } from 'react-router-dom'

function Navigation() {
  const location = useLocation()

  return (
    <nav className='navigation'>
      <Link to='/' className={location.pathname === '/' ? 'active' : ''}>
        Gallery
      </Link>
      <Link to='/draw' className={location.pathname === '/draw' ? 'active' : ''}>
        Draw
      </Link>
    </nav>
  )
}

export default Navigation
