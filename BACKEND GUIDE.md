# Backend with MySQL Stored Procedures - Implementation Guide

## Overview

This guide provides a step-by-step tutorial for building a Node.js/Express backend that uses MySQL stored procedures for database operations.

**Architecture**: Controller → Service → Database (Stored Procedures)

**Benefits**: Security (SQL injection prevention), Performance (optimized execution), Maintainability (centralized logic), Reusability

---

## Prerequisites

- MySQL Server installed
- Node.js installed (v14+)
- Basic knowledge of SQL and JavaScript

---

## Step 1: Project Setup

### 1.1 Initialize Node.js Project

```bash
mkdir my-backend
cd my-backend
npm init -y
```

### 1.2 Install Dependencies

```bash
npm install express mysql2 cors bcryptjs jsonwebtoken
```

**Required Packages**:
- `express` - Web framework
- `mysql2` - MySQL client with promise support
- `cors` - Cross-origin resource sharing
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication

### 1.3 Create Folder Structure

```
backend/
├── config/
│   ├── database.js
│   └── constants.js
├── controllers/
├── models/
├── routes/
├── middleware/
└── app.js
```

---

## Step 2: Database Connection Setup

### 2.1 Create Connection Pool

**File: `config/database.js`**

```javascript
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'your_database',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true  // CRITICAL: Required for stored procedures
});

export default pool;
```

**Important**: `multipleStatements: true` is mandatory to retrieve OUT parameters.

---

## Step 3: Create MySQL Stored Procedures

### 3.1 Standard Stored Procedure Pattern

Every stored procedure should follow this structure:

```sql
CREATE PROCEDURE procedure_name(
    IN p_input_param VARCHAR(255),
    OUT p_error_code INT,
    OUT p_message VARCHAR(255)
)
BEGIN
    -- Declare variables
    DECLARE v_sqlstate CHAR(5) DEFAULT '00000';
    DECLARE v_error_text TEXT DEFAULT '';
    
    -- Error handler
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1
            v_sqlstate = RETURNED_SQLSTATE,
            v_error_text = MESSAGE_TEXT;
        SET p_error_code = 1;
        SET p_message = CONCAT('Error ', v_sqlstate, ': ', v_error_text);
    END;
    
    -- Your business logic here
    
    -- Set success response
    SET p_error_code = 0;
    SET p_message = 'Success message';
END
```

### 3.2 Key Components

1. **IN Parameters**: Input data from application
2. **OUT Parameters**: Always include `p_error_code` and `p_message`
3. **Error Handler**: Catches SQL exceptions automatically
4. **GET DIAGNOSTICS**: Retrieves error details
5. **Business Logic**: Data validation and operations

---

## Step 4: Implement Service Layer

### 4.1 Service Pattern for Calling Procedures

**Three calling patterns based on procedure type:**

#### Pattern A: With OUT Parameters Only
```javascript
import pool from '../config/database.js';

export const getAllItems = async () => {
    const [rows] = await pool.query(
        "CALL get_all_items(@error, @msg); SELECT @error AS error_code, @msg AS message;"
    );
    
    const items = rows[0] || [];
    const { error_code, message } = rows[1][0];
    
    return { items, error_code, message };
};
```

#### Pattern B: With IN and OUT Parameters
```javascript
export const createItem = async (name, price) => {
    const [rows] = await pool.query(
        "CALL create_item(?, ?, @error, @msg); SELECT @error AS error_code, @msg AS message;",
        [name, price]
    );
    
    const { error_code, message } = rows[1][0];
    return { error_code, message };
};
```

#### Pattern C: Returning Generated ID
```javascript
export const insertItem = async (name) => {
    const [rows] = await pool.query(
        "CALL insert_item(?, @id, @error, @msg); SELECT @id AS item_id, @error AS error_code, @msg AS message;",
        [name]
    );
    
    const { item_id, error_code, message } = rows[1][0];
    return { item_id, error_code, message };
};
```

### 4.2 Understanding Result Sets

- **First statement**: `CALL procedure(...)` - Executes procedure
- **Second statement**: `SELECT @variable...` - Retrieves OUT parameters
- **rows[0]**: Data returned by SELECT/INSERT in procedure
- **rows[1]**: OUT parameters from SELECT statement

---

## Step 5: Implement Controller Layer

### 5.1 Controller Pattern

**File: `controllers/itemController.js`**

```javascript
import { createItem } from '../models/itemService.js';

export const createItemController = async (req, res) => {
    try {
        // 1. Extract and validate input
        const { name, price } = req.body;
        if (!name || !price) {
            return res.status(400).json({
                success: false,
                message: 'Name and price are required'
            });
        }
        
        // 2. Call service
        const result = await createItem(name, price);
        
        // 3. Handle result based on error_code
        if (result.error_code === 0) {
            return res.status(201).json({
                success: true,
                message: result.message
            });
        } else {
            return res.status(400).json({
                success: false,
                message: result.message
            });
        }
        
    } catch (error) {
        console.error('Controller error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
```

### 5.2 Controller Responsibilities

- Input validation
- Calling service layer
- HTTP status code mapping
- Response formatting
- Error handling

---

## Step 6: Create Routes

**File: `routes/itemRoutes.js`**

```javascript
import express from 'express';
import { createItemController, getAllItemsController } from '../controllers/itemController.js';

const router = express.Router();

router.post('/items', createItemController);
router.get('/items', getAllItemsController);

export default router;
```

---

## Step 7: Setup Main Application

**File: `app.js`**

```javascript
import express from 'express';
import cors from 'cors';
import itemRoutes from './routes/itemRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', itemRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;
```

---

## Step 8: Authentication Implementation (Optional)

### 8.1 Password Hashing in Service

```javascript
import bcrypt from 'bcryptjs';

export const registerUser = async (email, password) => {
    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [rows] = await pool.query(
        "CALL register_user(?, ?, @error, @msg); SELECT @error AS error_code, @msg AS message;",
        [email, hashedPassword]
    );
    
    return rows[1][0];
};

export const loginUser = async (email, password) => {
    // Get hashed password from database
    const [rows] = await pool.query(
        "CALL get_user_by_email(?, @pass, @role, @error, @msg); SELECT @pass AS password_hash, @role, @error AS error_code, @msg AS message;",
        [email]
    );
    
    const { password_hash, role, error_code, message } = rows[1][0];
    
    if (error_code !== 0) return { error_code, message };
    
    // Verify password
    const isValid = await bcrypt.compare(password, password_hash);
    
    if (!isValid) {
        return { error_code: 1, message: 'Invalid credentials' };
    }
    
    return { error_code: 0, message: 'Login successful', role };
};
```

---

## Step 9: Error Handling Strategy

### Three-Level Error Handling

**Level 1: Database (Stored Procedure)**
- Catches SQL errors, constraint violations
- Returns standardized error_code and message

**Level 2: Service**
- Handles database connection errors
- Processes business logic
- Re-throws critical errors

**Level 3: Controller**
- Catches all errors
- Maps to HTTP status codes
- Returns formatted JSON response

### Error Code Convention

- `0` = Success
- `1` = Error (client error, validation failure)
- Check `error_code` in every response

---

## Step 10: Best Practices

### Stored Procedures
✅ Use consistent naming convention
✅ Always include error_code and message OUT parameters
✅ Use error handlers with GET DIAGNOSTICS
✅ Validate data within procedures
✅ Use transactions for multi-step operations

### models
✅ Always check rows[1][0] for OUT parameters
✅ Provide default values if missing
✅ Hash passwords before database calls
✅ Keep business logic here

### Controllers
✅ Validate input first
✅ Use proper HTTP status codes (200, 201, 400, 401, 404, 500)
✅ Consistent response format
✅ Use try-catch blocks
✅ Log errors for debugging

### Database Connection
✅ Use connection pooling
✅ Set multipleStatements: true
✅ Configure connection limits
✅ Handle connection errors

---

## Implementation Checklist

### Database Phase
- [ ] Create database and tables
- [ ] Write stored procedures with error handlers
- [ ] Test procedures directly in MySQL
- [ ] Document all parameters

### Backend Phase
- [ ] Initialize Node.js project
- [ ] Install dependencies
- [ ] Create folder structure
- [ ] Configure database connection pool
- [ ] Write service layer functions
- [ ] Create controllers with validation
- [ ] Set up routes
- [ ] Configure Express app
- [ ] Add error handling middleware

### Testing Phase
- [ ] Test database connection
- [ ] Test each stored procedure
- [ ] Test API endpoints with Postman
- [ ] Test error scenarios
- [ ] Verify OUT parameters work correctly

---

## Common Issues & Solutions

**Issue**: OUT parameters return undefined  
**Solution**: Ensure `multipleStatements: true` in database config and use SELECT after CALL

**Issue**: "ER_PARSE_ERROR" syntax error  
**Solution**: Check semicolon between CALL and SELECT statements

**Issue**: Wrong data returned  
**Solution**: Remember: rows[0] = procedure data, rows[1] = OUT parameters

**Issue**: "Commands out of sync"  
**Solution**: Ensure all result sets are consumed properly

---

## Response Format Standard

```javascript
// Success Response
{
    "success": true,
    "message": "Operation successful",
    "statusCode": 200,
    "data": { ... }
}

// Error Response
{
    "success": false,
    "message": "Error description",
    "statusCode": 400
}
```

---

## Next Steps

1. Set up authentication middleware (JWT)
2. Add request logging
3. Implement rate limiting
4. Add input sanitization
5. Set up environment variables
6. Configure HTTPS
7. Add API documentation
8. Implement testing (Jest, Mocha)

---

## Key Takeaways

1. **Always use connection pooling** with `multipleStatements: true`
2. **Standard procedure pattern**: IN params + OUT error_code + OUT message
3. **Two-statement query**: `CALL procedure(...); SELECT @out_params;`
4. **Result sets**: rows[0] = data, rows[1] = OUT parameters
5. **Error handling**: Three levels (DB, Service, Controller)
6. **Consistent responses**: Always check error_code
7. **Security**: Hash passwords, validate input, use parameterized queries

This architecture provides a secure, maintainable, and scalable backend solution.
