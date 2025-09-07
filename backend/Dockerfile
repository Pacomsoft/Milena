FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Copia requirements e instala (cacheable)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia código (en dev montaremos volumen para código en caliente)
COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
