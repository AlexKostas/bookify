import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import { AuthProvider } from './context/AuthProvider';

function App() {
    return (
        <AuthProvider>
            <Router>
                <main className="App">
                    <Routes>
                        <Route path="/" element={<Navigate to="/registration/login" />} />
                        <Route path="/registration/login" element={<Login />} />
                        <Route path="/registration/register" element={<Register />} />
                    </Routes>
                </main>
            </Router>
        </AuthProvider>
    );
}

export default App;

