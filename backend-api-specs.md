# API Backend - Especificaciones

**IMPORTANTE**: Todos los endpoints requieren autenticación JWT Bearer Token obtenido del login.

**Headers requeridos:**
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

## 📋 Endpoints Implementados

### 🏛️ Municipios
- ✅ `GET /api/municipalities` - Obtener todos los municipios

### 🏢 Negocios
- ✅ `GET /api/businesses` - Obtener todos los negocios
- ✅ `GET /api/businesses/{id}` - Obtener negocio por ID

### 👤 Usuario
- ✅ `GET /api/user/profile` - Obtener perfil del usuario
- ✅ `PUT /api/user/profile` - Actualizar perfil del usuario
- ✅ `GET /api/user/visits` - Obtener visitas del usuario
- ✅ `POST /api/user/visits` - Crear nueva visita

### 📋 Menú de Negocios
- ⏳ `GET /api/menu/{business_id}` - Obtener menú del negocio por ID

## Endpoints Requeridos

### 1. Municipios
```
GET /api/municipalities
```
**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "municipio": "Guadalajara",
      "state": "Jalisco",
      "active": true
    }
  ]
}
```

### 2. Negocios
```
GET /api/businesses
GET /api/businesses/{id}
```
**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Restaurante El Sabor",
      "category": "Restaurante",
      "address": "Av. Principal 123",
      "municipality_id": 1,
      "municipality": "Guadalajara",
      "phone": "3312345678",
      "email": "contacto@elsabor.com",
      "logo": "https://example.com/logo.jpg",
      "description": "Comida tradicional mexicana",
      "rating": 4.5,
      "facebook": "https://facebook.com/elsabor",
      "instagram": "https://instagram.com/elsabor",
      "tiktok": "https://tiktok.com/@elsabor",
      "whatsapp": "https://wa.me/523312345678",
      "active": true,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### 3. Visitas del Cliente
```
GET /api/user/visits
POST /api/user/visits
```
**GET Response:**
```json
{
  "data": [
    {
      "id": 1,
      "business_id": 1,
      "business_name": "Restaurante El Sabor",
      "current_month": "2024-01",
      "visit_count": 3,
      "status": "completed"
    }
  ],
  "total_visits": 15
}
```

**POST Request:**
```json
{
  "business_id": 1,
  "user_id": 1,
  "visit_date": "2024-01-15T14:30:00Z"
}
```

**POST Response:**
```json
{
  "success": true,
  "message": "Visita registrada exitosamente",
  "qr_code": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
}
```

### 4. Perfil de Usuario
```
GET /api/user/profile
PUT /api/user/profile
```
**Response:**
```json
{
  "data": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "phone": "3312345678",
    "municipality_id": 1,
    "municipality": "Guadalajara",
    "total_points": 1250,
    "level": "Gold",
    "avatar": "https://example.com/avatar.jpg",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### 5. Menú de Negocios
```
GET /api/menu/{business_id}
```
**Response:**
```json
{
  "data": [
    {
      "id": 6,
      "business_id": 2,
      "producto": "Sandwich Club",
      "descripcion": "Sandwich de pollo, tocino y vegetales",
      "precio": 85.0,
      "categoria": "Alimentos",
      "disponible": 1,
      "created_at": "2025-11-07T00:06:00",
      "updated_at": "2025-11-07T00:06:00"
    }
  ]
}
```

## Modelos de Base de Datos

### municipalities
```sql
CREATE TABLE municipalities (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    municipio VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### businesses
```sql
CREATE TABLE businesses (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    address TEXT,
    municipality_id BIGINT,
    phone VARCHAR(20),
    email VARCHAR(100),
    logo VARCHAR(500),
    description TEXT,
    rating DECIMAL(2,1) DEFAULT 0.0,
    facebook VARCHAR(500),
    instagram VARCHAR(500),
    tiktok VARCHAR(500),
    whatsapp VARCHAR(500),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (municipality_id) REFERENCES municipalities(id)
);
```

### user_visits
```sql
CREATE TABLE user_visits (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    business_id BIGINT NOT NULL,
    visit_date TIMESTAMP NOT NULL,
    visit_month VARCHAR(7) NOT NULL, -- Format: YYYY-MM
    qr_code TEXT,
    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (business_id) REFERENCES businesses(id),
    INDEX idx_user_business_month (user_id, business_id, visit_month)
);
```

### business_menu_items
```sql
CREATE TABLE business_menu_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    business_id BIGINT NOT NULL,
    product VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
);
```

### users (actualización)
```sql
ALTER TABLE users ADD COLUMN municipality_id BIGINT;
ALTER TABLE users ADD COLUMN avatar VARCHAR(500);
ALTER TABLE users ADD FOREIGN KEY (municipality_id) REFERENCES municipalities(id);
```

## Datos de Prueba

### Municipios
```sql
INSERT INTO municipalities (municipio, state) VALUES
('Guadalajara', 'Jalisco'),
('Zapopan', 'Jalisco'),
('Tlaquepaque', 'Jalisco'),
('Tonalá', 'Jalisco'),
('Tlajomulco', 'Jalisco');
```

### Negocios
```sql
INSERT INTO businesses (name, category, address, municipality_id, phone, email, description, rating, facebook, instagram, tiktok, whatsapp) VALUES
('Restaurante El Sabor', 'Restaurante', 'Av. Principal 123', 1, '3312345678', 'contacto@elsabor.com', 'Comida tradicional mexicana', 4.5, 'https://facebook.com/elsabor', 'https://instagram.com/elsabor', 'https://tiktok.com/@elsabor', 'https://wa.me/523312345678'),
('Café Central', 'Cafetería', 'Calle Centro 45', 1, '3387654321', 'info@cafecentral.com', 'Café de especialidad y postres', 4.2, 'https://facebook.com/cafecentral', 'https://instagram.com/cafecentral', 'https://tiktok.com/@cafecentral', 'https://wa.me/523387654321'),
('Tienda Fashion', 'Ropa', 'Plaza Comercial 67', 2, '3398765432', 'ventas@fashion.com', 'Ropa y accesorios de moda', 4.0, 'https://facebook.com/tiendafashion', 'https://instagram.com/tiendafashion', 'https://tiktok.com/@tiendafashion', 'https://wa.me/523398765432'),
('Farmacia Salud', 'Farmacia', 'Av. Salud 89', 1, '3376543210', 'contacto@salud.com', 'Medicamentos y productos de salud', 4.3, 'https://facebook.com/farmaciasalud', 'https://instagram.com/farmaciasalud', 'https://tiktok.com/@farmaciasalud', 'https://wa.me/523376543210'),
('Gimnasio Fit', 'Deportes', 'Calle Fitness 12', 3, '3365432109', 'info@gymfit.com', 'Gimnasio y entrenamiento personal', 4.4, 'https://facebook.com/gimnasiofit', 'https://instagram.com/gimnasiofit', 'https://tiktok.com/@gimnasiofit', 'https://wa.me/523365432109');
```

### Menús de Negocios
```sql
-- Restaurante El Sabor (ID: 1)
INSERT INTO business_menu_items (business_id, product, description, price) VALUES
(1, 'Tacos al Pastor', 'Tacos con carne al pastor, piña, cebolla y cilantro', 45.00),
(1, 'Quesadillas', 'Quesadillas de queso con tortilla de maíz', 35.00),
(1, 'Pozole Rojo', 'Pozole tradicional con carne de cerdo', 85.00),
(1, 'Agua de Horchata', 'Bebida tradicional de arroz y canela', 25.00);

-- Café Central (ID: 2)
INSERT INTO business_menu_items (business_id, product, description, price) VALUES
(2, 'Café Americano', 'Café negro tradicional', 35.00),
(2, 'Cappuccino', 'Café con leche espumada', 45.00),
(2, 'Croissant', 'Pan francés con mantequilla', 40.00),
(2, 'Cheesecake', 'Pastel de queso con frutos rojos', 65.00);

-- Tienda Fashion (ID: 3)
INSERT INTO business_menu_items (business_id, product, description, price) VALUES
(3, 'Camisas Casuales', 'Camisas de algodón para uso diario', 350.00),
(3, 'Pantalones de Mezclilla', 'Jeans de corte clásico', 450.00),
(3, 'Vestidos de Temporada', 'Vestidos casuales y elegantes', 550.00),
(3, 'Zapatos Deportivos', 'Tenis para actividades deportivas', 750.00);

-- Farmacia Salud (ID: 4)
INSERT INTO business_menu_items (business_id, product, description, price) VALUES
(4, 'Paracetamol 500mg', 'Analgésico y antipirético', 25.00),
(4, 'Vitamina C', 'Suplemento vitamínico 1000mg', 85.00),
(4, 'Alcohol en Gel', 'Desinfectante para manos 250ml', 35.00),
(4, 'Termómetro Digital', 'Medidor de temperatura corporal', 150.00);

-- Gimnasio Fit (ID: 5)
INSERT INTO business_menu_items (business_id, product, description, price) VALUES
(5, 'Membresía Mensual', 'Acceso completo al gimnasio por 30 días', 450.00),
(5, 'Clase de Yoga', 'Sesión grupal de yoga de 1 hora', 80.00),
(5, 'Entrenamiento Personal', 'Sesión individual con entrenador', 300.00),
(5, 'Paquete 3 Meses', 'Membresía trimestral con descuento', 1200.00);
```