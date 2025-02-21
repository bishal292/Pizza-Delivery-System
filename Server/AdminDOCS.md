# Admin Other Routes Docs

## Table of Contents
- [Dashboard](#dashboard)
- [Inventory](#inventory)
- [Add Product](#add-product)
- [Update Product](#update-product)
- [Delete Product](#delete-product)
- [Live Orders](#live-orders)
- [Update Order Status](#update-order-status)
- [Completed Orders](#completed-orders)

## Dashboard
### GET /api/v1/admin/dashboard
- **Description**: Fetch the admin dashboard data.
- **Headers**: 
  - `Authorization`: Bearer token
- **Response**:
  - `200 OK`: Returns the dashboard data.
  - `500 Internal Server Error`: If there is an error on the server.

## Inventory
### GET /api/v1/admin/inventory
- **Description**: Fetch the inventory data.
- **Headers**: 
  - `Authorization`: Bearer token
- **Response**:
  - `200 OK`: Returns the inventory data.
  - `404 Not Found`: If no inventory is found.
  - `500 Internal Server Error`: If there is an error on the server.

## Add Product
### POST /api/v1/admin/addproduct
- **Description**: Add a new product to the inventory.
- **Headers**: 
  - `Authorization`: Bearer token
- **Body**:
  - `name`: String (required)
  - `category`: String (required, one of ['cheese', 'sauce', 'base', 'topping'])
  - `type`: String (required, one of ['veg', 'non-veg'])
  - `price`: Number (required)
  - `stock`: Number (required)
  - `threshold`: Number (required)
- **Response**:
  - `201 Created`: Returns the added product.
  - `400 Bad Request`: If required fields are missing or invalid.
  - `500 Internal Server Error`: If there is an error on the server.

## Update Product
### PATCH /api/v1/admin/updateproduct
- **Description**: Update an existing product in the inventory.
- **Headers**: 
  - `Authorization`: Bearer token
- **Query**:
  - `id`: String (required, product ID)
- **Body**:
  - `type`: String (optional, one of ['veg', 'non-veg'])
  - `price`: Number (optional)
  - `stock`: Number (optional)
  - `threshold`: Number (optional)
- **Response**:
  - `200 OK`: Returns the updated product.
  - `400 Bad Request`: If required fields are missing or invalid.
  - `404 Not Found`: If the product is not found.
  - `500 Internal Server Error`: If there is an error on the server.

## Delete Product
### DELETE /api/v1/admin/deleteproduct
- **Description**: Delete a product from the inventory.
- **Headers**: 
  - `Authorization`: Bearer token
- **Query**:
  - `id`: String (required, product ID)
- **Response**:
  - `200 OK`: Returns the deleted product.
  - `400 Bad Request`: If the product ID is invalid.
  - `404 Not Found`: If the product is not found.
  - `500 Internal Server Error`: If there is an error on the server.

## Live Orders
### GET /api/v1/admin/orders
- **Description**: Fetch the live orders.
- **Headers**: 
  - `Authorization`: Bearer token
- **Response**:
  - `200 OK`: Returns the live orders.
  - `500 Internal Server Error`: If there is an error on the server.

## Update Order Status
### PATCH /api/v1/admin/updateorder/:orderId
- **Description**: Update the status of an order.
- **Headers**: 
  - `Authorization`: Bearer token
- **Params**:
  - `orderId`: String (required, order ID)
- **Body**:
  - `status`: String (required, one of ['preparing', 'out for delivery', 'delivered'])
- **Response**:
  - `200 OK`: Returns the updated order.
  - `400 Bad Request`: If required fields are missing or invalid.
  - `404 Not Found`: If the order is not found.
  - `500 Internal Server Error`: If there is an error on the server.

## Completed Orders
### GET /api/v1/admin/completedorders
- **Description**: Fetch the completed orders.
- **Headers**: 
  - `Authorization`: Bearer token
- **Response**:
  - `200 OK`: Returns the completed orders.
  - `500 Internal Server Error`: If there is an error on the server.
