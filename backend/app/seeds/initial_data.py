
from ..db import Session
from app import models
from datetime import datetime
def init_data(db: Session):
# Limpiar tabla antes de insertar
    db.query(models.Niveles).delete()
    db.commit()

    niveles_list = []

    niveles_totales = 100
    exp_max = 32000  # experiencia acumulada nivel 100
    p = 1.8          # potencia para curva progresiva
    k = exp_max / (niveles_totales ** p)

    base_oro = 200
    oro_growth = 1.05  # oro aumenta 10% por nivel

    for nivel in range(1, niveles_totales + 1):
        # Experiencia mínima acumulada para alcanzar este nivel
        exp_acumulada = round(k * (nivel ** p))

        oro_reward = int(base_oro * (oro_growth ** (nivel - 1)))

        nivel_obj = models.Niveles(
            ni_level=nivel,
            ni_exp_necessary=exp_acumulada,  # experiencia mínima acumulada
            ni_exp_accumulated=exp_acumulada,
            ni_oro_reward=oro_reward,
            ni_habilidad=None,  # no se otorgan puntos de habilidad
            ni_other_reward=None,
            ni_createddate=int(datetime.utcnow().timestamp())
        )

        niveles_list.append(nivel_obj)

    db.bulk_save_objects(niveles_list)
    db.commit()
    if db.query(models.Divinidad).count() == 0:
        divinidades = [
            models.Divinidad(di_name="Hades", di_description = "Señor del inframundo y maestro de la muerte, Hades es el guardián de los secretos eternos. Su poder proviene del equilibrio entre la vida y la muerte, y su ideal es mantener la justicia absoluta más allá del mundo mortal. Solo los dignos pueden comprender su frío pero justo juicio. Su símbolo es la oscuridad, el destino inevitable y el poder absoluto sobre los reinos ocultos.", di_icon="hades.png"),
            models.Divinidad(di_name="Athena", di_description = "La diosa de la sabiduría, la justicia y la protección. Athena encarna la paz y la armonía, guiando a los caballeros con coraje y compasión. Su valor reside en proteger la vida y luchar contra la injusticia, incluso cuando los caminos se vuelven oscuros. Su símbolo es la justicia, la estrategia y la luz que ilumina el corazón de los que buscan la verdad.", di_icon="athena.png"),
            models.Divinidad(di_name="Poseidon", di_description = "Dios de los océanos y señor de las profundidades, Poseidón representa la fuerza indomable de la naturaleza. Su ideal es mantener el poder del mar, castigando a quienes perturban su armonía. Su espíritu es salvaje, orgulloso y majestuoso, reflejando la eternidad de las aguas. Su símbolo es el tridente, el dominio de los océanos y la fuerza indomable de la naturaleza.", di_icon="poseidon.png"),
            models.Divinidad(di_name="Odín", di_description = "El padre de todos y señor de Asgard, Odin encarna la sabiduría ancestral y la visión que trasciende el tiempo. Su ideal es mantener el equilibrio entre los mundos y proteger el orden cósmico. Su fuerza proviene del conocimiento y de la capacidad de sacrificar lo necesario por el bien mayor. Su símbolo es la sabiduría infinita, el coraje y la protección de los mundos.", di_icon="odin.png"),
        ]
        db.add_all(divinidades)
        db.commit()

    if db.query(models.Zodiaco).count() ==0:
        signos = [
            models.Zodiaco(zo_name = "Aries", zo_description = "Si perteneces a la constelación de Aries, serás reconocido por tu coraje y determinación inquebrantable. Tu espíritu aventurero y tu fuerza interior te llevan a enfrentarte a los desafíos sin titubear, siempre con la determinación de liderar y marcar el camino. Los nacidos bajo Aries son la llama que inspira a los demás a luchar por sus ideales.", zo_image = "aries.png"),
            models.Zodiaco(zo_name = "Tauro", zo_description = "Los que portan la constelación de Tauro poseen una fuerza tranquila pero constante. Su paciencia y resistencia los hacen inquebrantables frente a la adversidad. La estabilidad y la tenacidad son sus pilares; actúan con seguridad y perseverancia, y quienes los rodean confían en su capacidad de mantenerse firmes ante cualquier prueba.", zo_image = "tauro.png"),
            models.Zodiaco(zo_name = "Géminis", zo_description = "Si tu signo es Géminis, destacas por tu mente ágil y curiosa. Adaptarte a cualquier situación es tu talento natural, y tu ingenio te permite encontrar soluciones rápidas y creativas. La dualidad que te caracteriza te da la habilidad de ver varias perspectivas y de comunicarte con facilidad, convirtiéndote en un estratega astuto.", zo_image = "geminis.png"),
            models.Zodiaco(zo_name = "Cáncer", zo_description = "Los caballeros de la constelación de Cáncer son guardianes del corazón y del hogar. Su intuición y empatía les permiten anticipar necesidades y proteger a quienes aman. Aunque pueden parecer sensibles, poseen una fortaleza interior formidable que se manifiesta cuando defienden a los suyos.", zo_image = "cancer.png"),
            models.Zodiaco(zo_name = "Leo", zo_description = "Si perteneces a Leo, la grandeza y el liderazgo fluyen en tu ser. Brillas en todo lo que haces, y tu presencia inspira respeto y admiración. La confianza y el valor son tu sello; tu espíritu ardiente y tu lealtad hacen que seas un caballero digno de cualquier desafío.", zo_image = "leon.png"),
            models.Zodiaco(zo_name = "Virgo", zo_description = "Los de Virgo destacan por su atención al detalle y su sabiduría analítica. La disciplina y la lógica guían sus acciones, y buscan la perfección en cada tarea que emprenden. Su capacidad de observación y su prudencia los convierten en estrategas confiables y en compañeros incansables.", zo_image = "virgo.png"),
            models.Zodiaco(zo_name = "Libra", zo_description = "Si eres Libra, valoras la armonía y la justicia sobre todo. Tu sentido del equilibrio y tu capacidad de juicio equilibrado te permiten mediar en conflictos y mantener la paz. Los caballeros de Libra buscan el orden y la belleza en todo lo que los rodea, y su tacto los hace aliados valiosos.", zo_image = "libra.png"),
            models.Zodiaco(zo_name = "Escorpion", zo_description = "La constelación de Escorpio otorga a sus caballeros una pasión y determinación que pocos pueden igualar. Intensos y enigmáticos, tienen la habilidad de ver más allá de lo superficial y de actuar con precisión letal. Su fortaleza interna y su coraje los hacen capaces de superar cualquier obstáculo.", zo_image = "escorpion.png"),
            models.Zodiaco(zo_name = "Sagitario", zo_description = "Si perteneces a Sagitario, tu espíritu busca horizontes lejanos y aventuras sin fin. La libertad y el optimismo guían tus pasos, y tu entusiasmo contagia a todos los que te acompañan. Los caballeros de Sagitario confían en su intuición y en su energía inagotable para explorar lo desconocido.", zo_image = "sagitario.png"),
            models.Zodiaco(zo_name = "Capricornio", zo_description = "Los de Capricornio poseen una fuerza de voluntad inquebrantable y un sentido del deber muy marcado. La disciplina y la ambición son su motor; nada los detiene en la búsqueda de sus objetivos. Su paciencia y constancia los convierten en líderes respetados y confiables.", zo_image = "capricornio.png"),
            models.Zodiaco(zo_name = "Acuario", zo_description = "Si eres Acuario, tu mente está siempre un paso adelante. La creatividad y la visión del futuro te distinguen, y tu originalidad inspira cambios y nuevas ideas. Los caballeros de Acuario buscan romper límites y guiar a otros hacia nuevos horizontes con su inteligencia y su espíritu independiente.", zo_image = "acuario.png"),
            models.Zodiaco(zo_name = "Piscis", zo_description = "Los que portan la constelación de Piscis destacan por su sensibilidad y conexión con el mundo espiritual. Son empáticos y compasivos, capaces de comprender a los demás más allá de las palabras. Su intuición y creatividad los hacen artistas y visionarios, siempre movidos por el corazón.", zo_image = "piscis.png")
            
        ]
        db.add_all(signos)
        db.commit()

    if db.query(models.Zona).count() ==0:
        zonas = [
            models.Zona(zon_name ="Isla de Entrenamiento", zon_description ="Lugar donde los jóvenes guerreros dan sus primeros pasos, enfrentando pruebas que forjan cuerpo y espíritu.", zon_minlevel=1, zon_image="isla_entrenamiento.png"),
            models.Zona(zon_name ="Japón", zon_description ="Tierra natal de muchos caballeros, entre templos antiguos y ciudades modernas, los secretos del cosmos se esconden en cada rincón.", zon_minlevel=1, zon_image="japon.png"),
            models.Zona(zon_name ="Grecia", zon_description ="Cuna de leyendas y ruinas místicas, donde los dioses dejaron huellas imborrables y aún resuenan ecos de batallas sagradas.", zon_minlevel=1, zon_image="grecia.png"),
            models.Zona(zon_name ="Isla de la Reina Muerte", zon_description ="Una tierra sombría cubierta de brumas, donde el dolor y la disciplina despiadada forjan caballeros temibles.", zon_minlevel=2, zon_image="isla_muerte.png"),
            models.Zona(zon_name ="Siberia", zon_description ="Un páramo helado y despiadado, donde solo los corazones más firmes sobreviven al frío eterno.", zon_minlevel=4, zon_image="siberia.png"),
            models.Zona(zon_name ="China", zon_description ="Entre montañas sagradas y ríos ancestrales, los dragones vigilan a quienes buscan la verdadera sabiduría.", zon_minlevel=6, zon_image="china.png"),
            models.Zona(zon_name ="El Santuario de Athena", zon_description ="El bastión sagrado de la diosa, resguardado por los caballeros dorados y lleno de misterios divinos.", zon_minlevel=7, zon_image="santuario_athena.png"),
            models.Zona(zon_name ="Isla del Espectro", zon_description ="Un paraje maldito donde los espectros de Hades vagan, probando la fuerza de los vivos con su oscuridad.", zon_minlevel=7, zon_image="isla_espectro.png"),
            models.Zona(zon_name ="Isla de Andrómeda", zon_description ="Isla serena pero peligrosa, donde el espíritu de la defensa y la cadena de la justicia se entrelazan.", zon_minlevel=6, zon_image="isla_andromeda.png"),
            models.Zona(zon_name ="Inframundo", zon_description ="Oscuras prisiones, almas errantes y jueces implacables marcan el camino hacia los dominios de Hades.", zon_minlevel=50, zon_image="inframundo.png"),
            models.Zona(zon_name ="Jamir", zon_description ="Entre los Himalayas se alza la tierra de los maestros reparadores de armaduras, un lugar de sabiduría arcana.", zon_minlevel=6, zon_image="jamir.png"),
            models.Zona(zon_name ="Ineditos", zon_description ="Territorios ocultos y nunca antes explorados, donde aguardan caballeros perdidos y secretos olvidados.", zon_minlevel=200, zon_image="indeditos.png"),
            models.Zona(zon_name ="Egipto", zon_description ="Bajo las arenas eternas reposan templos olvidados y guardianes del sol, ocultando misterios milenarios.", zon_minlevel=11, zon_image="egipto.png"),
            models.Zona(zon_name ="Africa", zon_description ="Tierras salvajes y vastas, donde el cosmos se funde con la naturaleza indomable y los espíritus ancestrales.", zon_minlevel=18, zon_image="africa.png"),
            models.Zona(zon_name ="Australia", zon_description ="Un continente lejano lleno de cavernas ocultas, desiertos implacables y guardianes de horizontes remotos.", zon_minlevel=1, zon_image="australia.png"),
            models.Zona(zon_name ="Asgard", zon_description ="Entre glaciares y palacios nórdicos, los dioses guerreros se alzan bajo la mirada eterna de Odín.", zon_minlevel=30, zon_image="asgard.png"),
            models.Zona(zon_name ="Palacio de Poseidón", zon_description ="Bajo los mares, un reino majestuoso protegido por generales marinos y pilares que sostienen los océanos.", zon_minlevel=48, zon_image="poseidon.png"),
            models.Zona(zon_name ="Vacaciones", zon_description ="Una isla paradisíaca donde incluso los caballeros descansan, aunque nunca falta una prueba inesperada.", zon_minlevel=999, zon_image="vacaciones.png"),
            models.Zona(zon_name ="Coliseo", zon_description ="Arena de combates legendarios donde guerreros de todo el mundo prueban su fuerza bajo la mirada del público.", zon_minlevel=999, zon_image="coliseo.png")

        ]
        db.add_all(zonas)
        db.commit()

    if db.query(models.Boost).count()==0:
        boosts=[
            #Boost de Deidades
            # Hades 
            models.Boost(
                bo_name="Manto del Inframundo",
                bo_description="El poder sombrío de Hades envuelve a su caballero, endureciendo su espíritu y cuerpo frente al sufrimiento eterno.",
                bo_type="Deidad",
                bo_origin=1, # ID de Hades
                bo_unit="%",
                bo_stat="Resistencia",
                bo_quantity=15
            ),

            # Athena
            models.Boost(
                bo_name="Luz de la Justicia",
                bo_description="La bendición de Athena ilumina el camino del caballero, dándole fortaleza para proteger y luchar incansablemente.",
                bo_type="Deidad",
                bo_origin=2, # ID de Athena
                bo_unit="%",
                bo_stat="Vida Máxima",
                bo_quantity=12
            ),

            # Poseidon
            models.Boost(
                bo_name="Oleaje Incontenible",
                bo_description="Las mareas de Poseidón fluyen en su elegido, otorgándole precisión con la furia de los océanos.",
                bo_type="Deidad",
                bo_origin=3, # ID de Poseidon
                bo_unit="%",
                bo_stat="Presición",
                bo_quantity=15
            ),

            # Odín
            models.Boost(
                bo_name="Sabiduría de Asgard",
                bo_description="El manto de Odín otorga a su caballero la visión y voluntad inquebrantable de los dioses nórdicos.",
                bo_type="Deidad",
                bo_origin=4, # ID de Odín
                bo_unit="%",
                bo_stat="Sabiduría",
                bo_quantity=10
            ),

            #Boost de signos
            models.Boost(
                        bo_name="Astucia del Carnero",
                        bo_description="La constelación de Aries otorga claridad y mente táctica para abrir caminos en la batalla.",
                        bo_type="Signo",
                        bo_origin=1,
                        bo_unit="%",
                        bo_stat="Sabiduría",
                        bo_quantity=4
                    ),

                    # Tauro
                    models.Boost(
                        bo_name="Fuerza Indomable",
                        bo_description="El espíritu del toro imprime poder y constancia al caballero, volviéndolo imparable en combate.",
                        bo_type="Signo",
                        bo_origin=2,
                        bo_unit="%",
                        bo_stat="Resistencia",
                        bo_quantity=6
                    ),

                    # Géminis
                    models.Boost(
                        bo_name="Dualidad Cósmica",
                        bo_description="La energía dual de Géminis amplifica la velocidad de reacción y adaptación en la batalla.",
                        bo_type="Signo",
                        bo_origin=3,
                        bo_unit="%",
                        bo_stat="Reflejos",
                        bo_quantity=5
                    ),

                    # Cáncer
                    models.Boost(
                        bo_name="Aura del Guardián",
                        bo_description="El caballero bajo Cáncer canaliza el umbral entre la vida y la muerte, resistiendo ataques que quebrarían a otros.",
                        bo_type="Signo",
                        bo_origin=4,
                        bo_unit="%",
                        bo_stat="Resistencia Psíquica",
                        bo_quantity=6
                    ),

                    # Leo
                    models.Boost(
                        bo_name="Rugido Solar",
                        bo_description="La constelación de Leo infunde un fuego interior que brilla con poder demoledor.",
                        bo_type="Signo",
                        bo_origin=5,
                        bo_unit="%",
                        bo_stat="Fuerza",
                        bo_quantity=3
                    ),

                    # Virgo
                    models.Boost(
                        bo_name="Calma del Cosmos",
                        bo_description="La pureza de Virgo concede disciplina y conocimiento espiritual al caballero.",
                        bo_type="Signo",
                        bo_origin=6,
                        bo_unit="%",
                        bo_stat="Cosmo",
                        bo_quantity=6
                    ),

                    # Libra
                    models.Boost(
                        bo_name="Equilibrio Supremo",
                        bo_description="El aura de Libra balancea cuerpo y mente, afinando la precisión en cada golpe.",
                        bo_type="Signo",
                        bo_origin=7,
                        bo_unit="%",
                        bo_stat="Precisión",
                        bo_quantity=6
                    ),

                    # Escorpio
                    models.Boost(
                        bo_name="Veneno Letal",
                        bo_description="La intensidad de Escorpio otorga agilidad mortal, esquivando y contraatacando sin piedad.",
                        bo_type="Signo",
                        bo_origin=8,
                        bo_unit="%",
                        bo_stat="Reflejos",
                        bo_quantity=5
                    ),

                    # Sagitario
                    models.Boost(
                        bo_name="Flecha de Luz",
                        bo_description="El espíritu de Sagitario impulsa al caballero hacia la victoria con velocidad celestial.",
                        bo_type="Signo",
                        bo_origin=9,
                        bo_unit="%",
                        bo_stat="Velocidad",
                        bo_quantity=3
                    ),

                    # Capricornio
                    models.Boost(
                        bo_name="Disciplina de Capricornio",
                        bo_description="Los caballeros de Capricornio son conocidos por su temple y precisión en combate. Su disciplina les otorga una puntería impecable y una fuerza medida en cada ataque.",
                        bo_type="Signo",
                        bo_origin=10,
                        bo_unit="%",
                        bo_stat="Precisión",
                        bo_quantity=6
                    ),

                    # Acuario
                    models.Boost(
                        bo_name="Corriente del Futuro",
                        bo_description="La constelación de Acuario derrama el flujo del cosmos, potenciando la energía vital del caballero.",
                        bo_type="Signo",
                        bo_origin=11,
                        bo_unit="%",
                        bo_stat="Cosmo",
                        bo_quantity=6
                    ),

                    # Piscis
                    models.Boost(
                        bo_name="Danza de las Rosas",
                        bo_description="Piscis otorga una gracia en combate que entrelaza agilidad con un poder delicado pero mortal.",
                        bo_type="Signo",
                        bo_origin=12,
                        bo_unit="%",
                        bo_stat="Reflejos",
                        bo_quantity=5
                    )            
        ]
        db.add_all(boosts)
        db.commit()

    if db.query(models.Boost).count()==0:
        boosts=[
                    
            ]
        db.add_all(boosts)
        db.commit()

if __name__ == "__main__":
    db =    Session()
    try:
        init_data(db)
    finally:
        db.close()
