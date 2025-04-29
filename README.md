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

*   **Docker** y **Docker Compose** instalados y funcionando.
*   **Git** instalado y configurado

### Pasos (Producción)

1.  **Asegurar Configuración de Producción:**
    *   Crea un archivo `.env` en la raíz del proyecto (o en el directorio del backend) con las variables de entorno necesarias para producción. Puedes usar el archivo `.env.example` como referencia.
    *   Asegúrate de que el archivo `docker-compose.yml` esté configurado para producción. Revisa las variables de entorno y los volúmenes para asegurarte de que no se monten directorios locales innecesarios.
2.  **Construir y Levantar Todos los Contenedores:**
    Desde la raíz del proyecto, ejecuta:
    ```bash
    docker-compose up -d
    ```
    *   `-d`: Ejecuta los contenedores en segundo plano (detached mode).

    *Nota: Si tienes un archivo específico para producción (ej. `docker-compose.prod.yml`), el comando podría ser: `docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d`.*

3.  **Base de Datos:**
    Por defecto, el proyecto arranca con un archivo init.sql ubicado en la carpeta initialDB que esta en la raiz del proyecto. Este crea la base de datos, los esquemas y las tablas necesarias. Si necesitas agregar mas condiciones o datos inicales, puedes agregarlas a este archivo. 
    Si necesitas ejecutar migraciones adicionales, asegúrate de que el backend esté configurado para ejecutarlas automáticamente al iniciar. Si no es así, puedes ejecutar manualmente las migraciones desde el contenedor del backend:
    ```bash
    docker-compose exec backend pnpm run migration:run # O tu comando específico
    ```
    *(Reemplaza `backend` con el nombre real del servicio en tu `docker-compose.yml` si es diferente.)*

    *   **Nota:** Por defecto el proyecto no cuenta con migraciones, el mismo solo depende de un archivo init.sql ubicado en la carpeta initialDB que esta en la raiz del proyecto. En este caso para agregarlas tendrias que desarrollar las migraciones desde el backend y luego ejecutarlas desde el contenedor del backend. Si necesitas ayuda con esto, no dudes en preguntar.

4.  **Acceder a la Aplicación:**
    * **Frontend:** Abre tu navegador en la dirección y puerto expuestos por Docker Compose para el frontend (por defecto `http://localhost:4000` por defecto al app se ejecuta en el puerto 4000 dentro del contenedor) si cambiaste el puerto en el archivo `docker-compose.yml` asegurate de acceder al puerto correcto. 
    * **Backend:** Estará accesible en el puerto 3000 (ej. `http://localhost:3000` por defecto si no existe la env para el puerto la app se ejecutara por defecto en el puerto 3000 dentro del contenedor) si cambiaste el puerto en el archivo `docker-compose.yml` asegurate de acceder al puerto correcto. Si deseas acceder a la API directamente puedes visualizarla con el swagger que se encuentra en `http://localhost:3000/api` asegurate de que el puerto sea el correcto.
    * **Base de Datos:** Puedes acceder a la base de datos PostgreSQL desde tu cliente preferido (ej. pgAdmin, DBeaver) usando las credenciales definidas en el archivo `.env` y el puerto expuesto por Docker Compose (por defecto `5432` para PostgreSQL).
    * **Redis:** Puedes acceder a Redis desde tu cliente preferido (ej. Redis Desktop Manager) usando las credenciales definidas en el archivo `.env` y el puerto expuesto por Docker Compose (por defecto `6379` para Redis).
    * Nota: Si necesitas acceder a la base de datos o a Redis desde tu máquina local, asegúrate de que los puertos estén expuestos correctamente en el archivo `docker-compose.yml` y que no haya conflictos con otros servicios en tu máquina.   

## Ejecución en Modo Desarrollo

Este modo es ideal para desarrollar y depurar. Ejecutarás el backend y el frontend directamente en tu máquina local (con hot-reloading) mientras que los servicios como la base de datos y la caché se ejecutan en contenedores Docker.

### Condiciones Previas (Desarrollo)

*   **Node.js** (v20+)
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
    * **Frontend:** Abre tu navegador en `http://localhost:4000` (o el puerto que hayas configurado).
    * **Backend:** Accede a la API en `http://localhost:3000` (o el puerto que hayas configurado). Puedes acceder a la documentación de la API en `http://localhost:3000/api` (o el puerto que hayas configurado).

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

