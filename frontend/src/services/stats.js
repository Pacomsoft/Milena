const getBoostForStat = (statKey) => {
  // Filtramos boosts activos (divinidad y signo seleccionados)
  const activeBoosts = boosts.filter(
    (b) =>
      (b.bo_type === "Deidad" && b.bo_origin === selectedDiv.di_key) ||
      (b.bo_type === "Signo" && b.bo_origin === selectedDivZo.zo_key)
  );

  // Sumamos solo los que afectan a ese stat
  return activeBoosts
    .filter((b) => b.bo_stat === statKey)
    .reduce((sum, b) => sum + Number(b.bo_quantity), 0);
};
