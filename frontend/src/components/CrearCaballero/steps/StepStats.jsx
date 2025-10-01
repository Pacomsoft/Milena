import React from "react";
import FinishIcon from "../../icons/Finish"
import BackIcon from "../../icons/Back";
import FormularioHabilidades from "../../FormStats";


export default function StepOtrosDatos({ otrosDatos, setOtrosDatos, onPrev, boosts, selectedDiv, selectedDivZo}) {
const habilidadesData = [
  { key: "velocidad", nombre: "Velocidad", desc: "El Caballero veloz rompe la distancia entre un parpadeo y la eternidad. Su rapidez no solo decide quién ataca primero, también le otorga reflejos imposibles de seguir, volviéndose más esquivo y anticipando los movimientos del rival. + Probabilidad de ganar ronda. + Reflejos + Reduce la evación enemiga.", costo: 0, nivel:1 },
  { key: "fuerza", nombre: "Fuerza", desc: "La fuerza no solo quiebra montañas, también moldea tu destino; al elevarla, tu ataque crece y tu cuerpo gana resistencia. + Daño físico + Resistencia + Resistencia Psíquica", costo: 0, nivel:1},
  { key: "sabiduria", nombre: "Sabiduría", desc: "Quien domina el saber de los astros y los secretos del cosmos puede liberar ataques devastadores. Pero también entiende cómo contrarrestar las artes de sus enemigos, forjando una voluntad que no cede. + ATK Cósmico + Reduce el daño por habilidades especiales. + Persistencia", costo: 0, nivel:1 },
  { key: "presicion", nombre: "Precisión", desc: "Un verdadero Caballero no desperdicia energía: cada golpe busca las grietas en la armadura, los puntos débiles del cuerpo y hasta del alma. La precisión transforma un ataque en una sentencia. + Probabilidad de acertar golpe o habilidad + ATK Físico y Cósmico.", costo: 0, nivel:1},
  { key: "reflejos", nombre: "Agilidad", desc: "La danza de un Caballero en combate es tan ligera como el viento, tan impredecible como una hoja en la tormenta. Un guerrero ágil evade, contraataca y golpea con la gracia de los dioses. + Probabilidad de esquivar golpe o habilidad + Probabilidad de Contragolpear + Velocidad", costo: 0, nivel:1 },
  { key: "resistencia", nombre: "Resistencia", desc: "El cuerpo del Caballero es su templo, y cada golpe soportado es una prueba superada. Su aguante no solo lo hace más sólido, también le permite contener mayores reservas de cosmos para la batalla. + Defensa física + Cosmo + Resistencia a Efectos ", costo: 0, nivel:1 },
  { key: "resistenciap", nombre: "Resistencia Psíquica", desc: "El alma de un Caballero es tan dura como el diamante. Quien domina su mente puede resistir ilusiones, miedos y poderes psíquicos, al tiempo que expande sus límites cósmicos. + Defensa cósmica + Cosmo + Resistencia a Efectos", costo: 0, nivel:1 },
  { key: "persistencia", nombre: "Persistencia", desc: "Aun cuando la oscuridad lo cubra y su cuerpo caiga al suelo, un Caballero de Atena se levanta una y otra vez. Su voluntad le otorga un temple que refuerza tanto cuerpo como espíritu. + Probabilidad de levantarse al caer en batalla + Resistencia Física y Cósmica", costo: 0, max: 100, nivel:1 },
  { key: "cosmo", nombre: "Cosmo", desc: "El Cosmo es el aliento del universo, la chispa de la vida y la furia de las estrellas. Quien lo domina no solo ejecuta técnicas legendarias, sino que eleva cada golpe común a la altura de un mito. + Energía para uso de habilidades + %  Probabilidad de Críticos", costo: 0, nivel: 1},
  { key: "septimo", nombre: "Séptimo Sentido", desc: "Solo aquellos que trascienden los cinco sentidos y despiertan el séptimo son capaces de luchar en perfecta sintonía con el universo. Cada fibra de su ser vibra con un poder superior que desborda los límites de los mortales. + Incrementa todas las estadísticas de combate en un porcentaje + Aumenta la probabilidad de anular efectos negativos", costo: 0, max: 100, nivel:1}
];


  return (
    <div className="p-4">
      <h3 className="text-center text-gold" style={{ fontSize: "5vh" }}>
        Personalización de Caballero
      </h3>

      <FormularioHabilidades boosts={boosts} selectedDiv={selectedDiv} selectedDivZo={selectedDivZo} habilidadesData={habilidadesData} puntosIniciales={20} oroInicial={0}/>
            <div className="text-center mt-4">
        <button type="button" className="btn btn-secondary float-start" onClick={onPrev}>
          <BackIcon/>
        </button>
      </div>
    </div>
  )

}
