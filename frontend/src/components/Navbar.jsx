// For reusable components
import { Navbar, Nav, Container, Button, Modal} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import LogOut from '../features/auth/pages/logout';

function NavigationBar() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">NTU Star swapper</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/post/filter">Search</Nav.Link>
              <Nav.Link as={Link} to="/post/self">Own posts</Nav.Link>
              <Nav.Link as={Link} to="/create">Create Post</Nav.Link>
              <Button 
                  variant="outline-light" 
                  className="ms-2"
                  onClick={() => setShowLogoutModal(true)}
                >
                  Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <LogOut 
          show={showLogoutModal} 
          onHide={() => setShowLogoutModal(false)} 
        />
    </>
  );
}

export default NavigationBar; 