const User = require('../models/User');
const jwt = require('jsonwebtoken');

// JWT secret key - should be in environment variables in production
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create new user
    const user = new User({
      username,
      password
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    console.log('Intento de login recibido:', { 
      body: req.body,
      headers: req.headers 
    });

    const { username, password } = req.body;

    if (!username || !password) {
      console.log('Faltan credenciales:', { username: !!username, password: !!password });
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find user
    console.log('Buscando usuario en la base de datos:', username);
    const user = await User.findOne({ username });
    
    if (!user) {
      console.log('Usuario no encontrado:', username);
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    console.log('Usuario encontrado, verificando contraseña');
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Contraseña incorrecta para usuario:', username);
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    console.log('Contraseña correcta, generando token');
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login exitoso para usuario:', username);
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error en el proceso de login:', error);
    res.status(500).json({ 
      message: 'Error en el servidor durante el login', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.verifyToken = (req, res, next) => {
  console.log('Headers de autorización recibidos:', req.headers.authorization);
  
  const token = req.headers.authorization?.split(' ')[1];
  console.log('Token extraído:', token ? 'Presente' : 'No presente');

  if (!token) {
    console.log('No se proporcionó token');
    return res.status(401).json({ message: 'No se proporcionó token de autenticación' });
  }

  try {
    console.log('Intentando verificar token');
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token verificado exitosamente para:', decoded.username);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error al verificar token:', error.message);
    return res.status(401).json({ 
      message: 'Token inválido',
      error: error.message
    });
  }
};
