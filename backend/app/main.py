from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import time

from app.db import *
from app.models.Account import Account
from app.api.api_v1.api import api_router
from apscheduler.schedulers.background import BackgroundScheduler
from app.crud import caballero as CaballeroCRUD
import os



# Crear tablas si no existen
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SeiyaRPG - Backend (dev)")
#app.include_router(auth_router)
app.include_router(api_router, prefix="/api/v1")


# CORS: en dev permitir localhost:3000 (React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://192.168.0.24:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===========================================================
# 🔥 CONFIGURACIÓN DEL SCHEDULER
# ===========================================================
scheduler = BackgroundScheduler()


def job_regenerar_vida():
    db = Session()
    try:
        CaballeroCRUD.regenerar_vida(db)
    except Exception as e:
        print("⚠️ Error en job_regenerar_vida:", e)
    finally:
        db.close()


def job_actualizar_estados_y_niveles():
    db = Session()
    try:
        CaballeroCRUD.actualizar_estados(db)
        CaballeroCRUD.verificar_nivel(db)
    except Exception as e:
        print("⚠️ Error en job_actualizar_estados_y_niveles:", e)
    finally:
        db.close()


# ===========================================================
# 🧠 INICIALIZAR LOS JOBS (solo una vez)
# ===========================================================
if os.getenv("RUN_MAIN") == "true" or not os.getenv("RUN_MAIN"):
    # Evitar doble scheduler cuando se usa --reload en desarrollo
    if not scheduler.get_jobs():
        scheduler.add_job(job_regenerar_vida, "interval", seconds=3, id="regenerar_vida")
        scheduler.add_job(job_actualizar_estados_y_niveles, "interval", seconds=1, id="actualizar_estados_nivel")
        scheduler.start()
        print("✅ Scheduler iniciado: Vida cada 3s, Estados/Nivel cada 1s")


# ===========================================================
# 🔚 Evento de apagado limpio
# ===========================================================
@app.on_event("shutdown")
def shutdown_event():
    if scheduler.running:
        scheduler.shutdown(wait=False)
        print("🛑 Scheduler detenido correctamente")

