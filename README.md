# Weather App

Aplicación web que permite a los usuarios obtener información meteorológica en tiempo real para cualquier ciudad o ubicación. Consume datos de una API externa y utiliza caché para optimizar las respuestas.

## Tecnologías Utilizadas

*   **Backend:** NestJS (Node.js, TypeScript)
*   **Frontend:** Next.js (React, TypeScript)
*   **Base de Datos:** PostgreSQL
*   **Caché:** Redis
*   **Contenedorización:** Docker, Docker Compose
*   **Gestor de Paquetes:** pnpm
*   **Control de Versiones:** Git

## Ejecución en Modo Producción (con Docker Compose)

Este modo ejecuta **toda** la aplicación (backend, frontend, base de datos, caché) dentro de contenedores Docker, simulando un entorno de despliegue.

### Condiciones Previas (Producción)

*   **Docker** y **Docker Compose**
*   **Git**
*   *(Opcional)* **Node.js** y **pnpm**: Pueden ser necesarios si necesitas construir las imágenes localmente antes de ejecutar `docker-compose up` y tus Dockerfiles no manejan la instalación de dependencias y build por sí mismos. Sin embargo, si los Dockerfiles están bien configurados, solo Docker es estrictamente necesario en el servidor de despliegue.

### Pasos (Producción)

1.  **Asegurar Configuración de Producción:**
    *   Verifica que los archivos `.env` (backend) y `.env.local` (frontend) estén correctamente configurados para producción. Las URLs de conexión entre servicios (ej. frontend a backend, backend a DB/Redis) probablemente usarán los nombres de servicio definidos en `docker-compose.yml` (ej. `http://backend:3001`, `postgres`, `redis`).
    *   Asegúrate de que tu `docker-compose.yml` (o un archivo de override como `docker-compose.prod.yml`) esté configurado para construir y ejecutar los contenedores del backend y frontend, además de los servicios.

2.  **Construir y Levantar Todos los Contenedores:**
    Desde la raíz del proyecto, ejecuta:
    ```bash
    docker-compose up --build -d
    ```
    *   `--build`: Fuerza la reconstrucción de las imágenes si los Dockerfiles o su contexto han cambiado. Es importante al desplegar nuevo código.
    *   `-d`: Ejecuta los contenedores en segundo plano (detached mode).

    *Nota: Si tienes un archivo específico para producción (ej. `docker-compose.prod.yml`), el comando podría ser: `docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d`.*

3.  **Ejecutar Migraciones (Si es necesario post-arranque):**
    Si las migraciones no se ejecutan automáticamente al iniciar el contenedor del backend, puedes ejecutarlas manualmente en el contenedor en ejecución:
    ```bash
    docker-compose exec backend pnpm run migration:run # Reemplaza 'backend' con el nombre de tu servicio backend en docker-compose.yml
    ```

4.  **Acceder a la Aplicación:**
    Abre tu navegador en la dirección y puerto expuestos por Docker Compose para el frontend (usualmente `http://localhost:3000` o `http://localhost:80` si mapeaste al puerto 80).

## Ejecución en Modo Desarrollo

Este modo es ideal para desarrollar y depurar. Ejecutarás el backend y el frontend directamente en tu máquina local (con hot-reloading) mientras que los servicios como la base de datos y la caché se ejecutan en contenedores Docker.

### Condiciones Previas (Desarrollo)

*   **Node.js** (v18+)
*   **pnpm**
*   **Docker** y **Docker Compose**
*   **Git**

### Pasos (Desarrollo)

1.  **Instalar Dependencias (usando pnpm):**
    *   **Backend:**
        ```bash
        # Desde el directorio del backend (ej. ./backend/)
        pnpm install
        ```
    *   **Frontend:**
        ```bash
        # Desde el directorio del frontend (ej. ./frontend/)
        pnpm install
        ```
    *(O ejecuta `pnpm install -r` desde la raíz si usas workspaces de pnpm).*

2.  **Levantar Servicios Externos (DB, Caché) con Docker Compose:**
    Desde la raíz del proyecto, inicia solo los contenedores de la base de datos y Redis:
    ```bash
    # Asegúrate de que tu docker-compose.yml defina los servicios (ej: 'postgres', 'redis')
    docker-compose up -d postgres redis # Reemplaza 'postgres' y 'redis' con los nombres reales de tus servicios en docker-compose.yml
    ```
    Espera a que los contenedores estén listos (`docker ps`).

3.  **Ejecutar Migraciones de Base de Datos (Si aplica):**
    ```bash
    # Desde el directorio del backend (ej. ./backend/)
    pnpm run migration:run # O tu comando específico
    ```

4.  **Iniciar las Aplicaciones (con Hot-Reload):**
    Necesitarás dos terminales separadas.
    *   **Iniciar Backend (NestJS):**
        ```bash
        # Desde el directorio del backend (ej. ./backend/)
        pnpm run start:dev
        ```
    *   **Iniciar Frontend (Next.js):**
        ```bash
        # Desde el directorio del frontend (ej. ./frontend/)
        pnpm run dev
        ```

5.  **Acceder a la Aplicación:**
    Abre tu navegador en `http://localhost:3000` (o el puerto configurado para el frontend). El backend estará accesible en el puerto definido en su `.env` (ej. `http://localhost:3001`).


## Detener la Aplicación

*   **Modo Desarrollo:**
    1.  Presiona `Ctrl+C` en las terminales donde se ejecutan el backend y el frontend.
    2.  Detén los contenedores de servicios: `docker-compose stop postgres redis` (o los nombres de tus servicios) o `docker-compose down` para detenerlos y eliminarlos.
*   **Modo Producción:**
    Desde la raíz del proyecto:
    ```bash
    docker-compose down
    ```
    Esto detendrá y eliminará los contenedores, redes y (opcionalmente, si se especifica con `-v`) volúmenes definidos en el archivo `docker-compose.yml`.

