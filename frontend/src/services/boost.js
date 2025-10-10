import { API_URL } from "../config";
import { notify } from "../components/Notification";
import { boStatMap } from "./habilidades";

export async function getAllBoosts() {
  try {
    const url = `${API_URL}/boost/all_boosts`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) return null; // si no hay Boosts, regresa null

    const data = await res.json();
    return data || null; // si el backend devuelve vacío, también null
  } catch (error) {
    notify("error", "Error fetching boosts: "+ error);
    return null;
  }
}

export async function getBoost(id, token) {
  try {
    const url = `${API_URL}/boost/boost_caballero/`+id;
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`

       }
      ,
    });

    if (!res.ok) return null; // si no hay Boosts, regresa null

    const data = await res.json();
    return data || null; // si el backend devuelve vacío, también null
  } catch (error) {
    notify("error", "Error fetching boost: "+ error);
    return null;
  }
}

export const getBoostForStat = (statKey, boosts, selectedDiv, selectedDivZo, stats) => {
    const activeBoosts = boosts.filter(
      (b) =>
        (b.bo_type === "Deidad" && b.bo_origin === selectedDiv.di_key) ||
        (b.bo_type === "Signo" && b.bo_origin === selectedDivZo.zo_key)
    );

    return activeBoosts
      .filter((b) => boStatMap[b.bo_stat] === statKey)
      .reduce((sum, b) => {
        if (b.bo_unit === "%") {
          return sum + (stats[statKey] * (Number(b.bo_quantity) / 100));
        } else {
          return sum + Number(b.bo_quantity);
        }
      }, 0);
  };