

# operations/operations.py

# Parámetros configurables de la fórmula de costos
BASE_COST = 40            # costo mínimo
GROWTH_FACTOR = 7         # factor de crecimiento lineal
CURVE_EXPONENT = 0.7      # forma de la curva

def calcular_costo_stat(nivel_stat: int) -> int:
    """
    Calcula el costo para subir un stat según el nivel actual.
    """
    return int(BASE_COST + GROWTH_FACTOR * (nivel_stat ** CURVE_EXPONENT))
