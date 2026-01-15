# CheckoutCore Microservices 🧩💳📦

**CheckoutCore** es un sistema backend basado en **arquitectura de microservicios orientada a eventos**, diseñado para gestionar el flujo completo de una compra: **creación de órdenes, procesamiento de pagos y notificación al usuario**, de forma desacoplada, escalable y resiliente.

El sistema utiliza un **API Gateway** como punto de entrada, **RabbitMQ** como bus de eventos y **bases de datos independientes por servicio**, siguiendo buenas prácticas de arquitectura distribuida.

---

## ✨ Características Principales

- Arquitectura de **microservicios con NestJS**
- API Gateway como único punto de acceso
- Validación de tokens y control de acceso
- Procesamiento de órdenes desacoplado
- Servicio de pagos independiente
- Sistema de notificaciones basado en eventos
- Comunicación asíncrona mediante **RabbitMQ**
- Bases de datos dedicadas por microservicio
- Monorepo gestionado con **pnpm workspaces**
- Infraestructura completamente dockerizada

---

## 🧠 Arquitectura del Sistema

### 📌 Descripción del Flujo

1. **Client Apps (Web App)**

   - Envía solicitudes HTTP al sistema.

2. **API Gateway**

   - Punto único de entrada.
   - Valida tokens.
   - Redirige solicitudes a los microservicios correspondientes.
   - Publica eventos hacia RabbitMQ cuando es necesario.

3. **User Service**

   - Gestión de usuarios.
   - Obtención de perfil.
   - Autenticación y validación de acceso.

4. **RabbitMQ (Event Bus)**

   - Maneja eventos como:
     - `order.created`
     - `payment.processed`
     - `payment.succeeded`
   - Permite comunicación desacoplada entre servicios.

5. **Order Service**

   - Crea y gestiona órdenes.
   - Persiste información en `orders_db`.
   - Emite el evento `order.created`.

6. **Payment Service**

   - Escucha eventos de órdenes.
   - Procesa pagos.
   - Guarda información en `payments_db`.
   - Emite el evento `payment.succeeded`.

7. **Notification Service**
   - Escucha eventos de órdenes y pagos.
   - Registra notificaciones.
   - Envía notificaciones al usuario.
   - Persiste datos en `notifications_db`.

Cada microservicio:

- Es **independiente**
- Tiene su **propia base de datos**
- Se comunica mediante **eventos**
- Puede escalarse de forma aislada

---

## 👨‍💻 Tecnologías Utilizadas

### Backend

- Node.js
- NestJS
- RabbitMQ
- PostgreSQL

### Infraestructura & Tooling

- Docker
- Docker Compose
- pnpm (Workspaces)
- Monorepo

[![Tech Stack](https://skillicons.dev/icons?i=nodejs,nestjs,docker,postgres,rabbitmq)](https://skillicons.dev)

---

## 🗂️ Estructura del Proyecto

<details>
<summary><b>Contenido</b></summary>

```bash
checkoutcore-microservices/
├── apps/
│   ├── api-gateway/
│   ├── service-auth/
│   ├── service-users/
│   ├── service-orders/
│   ├── service-payments/
│   └── service-notifications/
│
├── packages/
│   └── shared/
│
├── .env.example
├── docker-compose.yml
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── package.json
├── .gitignore
└── README.md
```

</details>

🧰 Get Started
Para poner este proyecto en funcionamiento en su entorno de desarrollo, siga estas instrucciones paso a paso.

### ⚙️ Instalación & Correrlo en Local

**Step 0:**

- Node.js >= 18
- pnpm
- Docker
- Docker Compose

🚀 Instalación y Ejecución en Local
**Step 1:** Clonar el repositorio
git clone https://github.com/LFernando07/checkoutcore-microservices.git
cd checkoutcore-microservices

**Step 2:** Instalar dependencias
pnpm install

**Step 3:** Configurar variables de entorno

Copia el archivo de ejemplo:

cp .env.example .env

Cada microservicio dentro de apps/ cuenta con su propio .env.example para configuración específica.

**Step 4:** Levantar infraestructura y servicios
docker-compose up --build

Esto levantará:

- RabbitMQ
- Bases de datos PostgreSQL
- Todos los microservicios
- API Gateway

🔌 Servicios y Puertos

- Servicio Puerto
  1. API Gateway 3000
  2. Payments Service 3002
  3. RabbitMQ UI 15672

🎯 Objetivo del Proyecto

- Este proyecto fue desarrollado como:

- Práctica avanzada de arquitectura backend

- Implementación real de microservicios

- Diseño orientado a eventos

- Base para sistemas distribuidos de nivel productivo

📋 Licencia

Este proyecto es open-source y se distribuye bajo la licencia MIT.
Uso libre para aprendizaje, modificación y distribución.
