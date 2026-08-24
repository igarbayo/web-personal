# GardenPersonal CMS Backend (FastAPI)

Backend modular en FastAPI (arquitectura inspirada en NestJS) para la gestión de contenidos trilingües de [ignaciogarbayo.com](https://ignaciogarbayo.com).

## 🚀 Características
- **Arquitectura Modular NestJS-like:** Módulos organizados en `auth`, `content`, `media` y `git` con Controladores, Servicios, DTOs (Pydantic) y Guards de autenticación (`@Depends`).
- **Autenticación JWT & Master Key en cada cambio:** Doble factor lógico donde cada guardado o borrado exige validación de contraseña maestra en el backend.
- **Validación Estricta de Invariantes:** Paridad trilingüe estricta (ES, EN, GL), años con 4 cifras (`MM/YYYY`), control de imágenes y presupuesto de **8 MB** en `public/`.
- **Media Pipeline con Pillow:** Conversión y compresión automática de imágenes a `.webp` (calidad 85%).
- **GitOps con GitHub API:** Commits atómicos multi-archivo a la rama `main` para activar el despliegue continuo de GitHub Pages.
- **Servicio de UI en Subdominio:** Sirve directamente la interfaz web del CMS estática en la raíz (`/`) cuando se despliega en `<subdominio>.ignaciogarbayo.com`.

## 🛠️ Ejecución Local

```bash
# 1. Instalar dependencias
pip install -r requirements.txt

# 2. Ejecutar tests
python -m pytest tests/

# 3. Iniciar servidor de desarrollo
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## 🐳 Docker

```bash
docker build -t garden-personal-cms .
docker run -d -p 8000:8000 --env-file .env garden-personal-cms
```
